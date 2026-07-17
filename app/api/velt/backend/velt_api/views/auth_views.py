"""
Dev-only auth helper views for resolver-endpoint-auth.

================================  SECURITY WARNING  ================================
The /api/velt/auth/mint endpoint mints a signed JWT for ANY userId with NO
authentication, using the same shared HS256 secret the resolver gate trusts. It exists
ONLY so the local frontend can obtain a real token to forward to the gated resolvers.

NEVER deploy this endpoint. In production, tokens must come from your real identity
provider and the resolver gate should verify them with an asymmetric key (RS256/ES256)
via a JWKS URL — not a shared secret. Shipping this would let anyone forge a valid
resolver token.
===================================================================================
"""
import json
import time

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


def _resolver_jwt_config():
    """Pull the HS256 secret/algorithm from the same resolver_auth block the gate uses."""
    resolver_auth = settings.VELT_SDK_CONFIG.get('resolver_auth') or {}
    return resolver_auth.get('jwt') or {}


@csrf_exempt
@require_http_methods(["POST"])
def mint_token(request):
    """
    DEV-ONLY: sign a short-lived HS256 JWT so the frontend can forward a real token to
    the gated resolver endpoints. NOT gated by require_velt_token (it is how you obtain
    a token in the first place). NEVER ship this.

    Body: { "userId": "<id>", "ttl": <optional seconds, default 300> }
    Returns: { "token": "<jwt>" }
    """
    try:
        import jwt  # PyJWT (velt-py[auth]); same lib the SDK verifier uses
    except ImportError:
        return JsonResponse({
            'success': False,
            'error': 'PyJWT is not installed. Install velt-py[auth].',
            'errorCode': 'DEPENDENCY_MISSING',
            'statusCode': 500,
        }, status=500)

    try:
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON',
            'errorCode': 'INVALID_INPUT',
            'statusCode': 400,
        }, status=400)

    user_id = data.get('userId') or 'dev-user'
    try:
        ttl = int(data.get('ttl', 300))
    except (TypeError, ValueError):
        ttl = 300

    jwt_cfg = _resolver_jwt_config()
    secret = jwt_cfg.get('secret')
    algorithm = (jwt_cfg.get('algorithms') or ['HS256'])[0]
    if not secret:
        return JsonResponse({
            'success': False,
            'error': 'resolver_auth.jwt.secret is not configured.',
            'errorCode': 'NOT_CONFIGURED',
            'statusCode': 500,
        }, status=500)

    now = int(time.time())
    payload = {
        'sub': user_id,
        'iat': now,
        'exp': now + ttl,  # negative ttl => already expired (handy for testing EXPIRED)
    }
    token = jwt.encode(payload, secret, algorithm=algorithm)
    # PyJWT < 2 returned bytes; normalize to str for JSON.
    if isinstance(token, bytes):
        token = token.decode('utf-8')

    return JsonResponse({'token': token})
