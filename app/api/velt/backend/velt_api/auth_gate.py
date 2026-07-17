"""
Auth gate for the Velt self-hosting resolver endpoints (resolver-endpoint-auth).

The Velt frontend now forwards a JWT (``Authorization: Bearer <token>``) to the
endpoint-based resolvers. ``require_velt_token`` verifies that token via the SDK's
``selfHosting.verifyToken`` helper before the view runs.

This is AUTHENTICATION-ONLY: it confirms the caller presented a valid token. It does
NOT authorize — the resolver services keep their own apiKey/organizationId scoping.

Fail-closed (INV-001): a missing/invalid/expired token, or any unexpected error, yields
a 401. Verification never silently allows an unverified write in the gated config.
"""
import functools

from django.conf import settings
from django.http import JsonResponse

from .velt_sdk import get_velt_sdk

# Explicit dev escape hatch. When `resolver_auth` is absent from VELT_SDK_CONFIG the
# SDK returns errorCode NOT_CONFIGURED. By default we still fail closed (401) so an
# unconfigured deployment can never silently accept unverified writes. Set this to True
# in settings ONLY for local dev where you intentionally run without a verifier.
_ALLOW_UNCONFIGURED = getattr(settings, 'VELT_RESOLVER_AUTH_ALLOW_UNCONFIGURED', False)


def _unauthorized(error, error_code):
    """Build the standard 401 body (matches the existing view error shape)."""
    return JsonResponse({
        'success': False,
        'error': error,
        'errorCode': error_code,
        'statusCode': 401,
    }, status=401)


def require_velt_token(view_func):
    """
    Decorator that verifies the frontend-forwarded Velt resolver token.

    Place it AFTER @csrf_exempt and @require_http_methods so it runs inside them
    (i.e. only after the method check passes, and CSRF is already exempted)::

        @csrf_exempt
        @require_http_methods(["POST"])
        @require_velt_token
        def save_comments(request):
            ...

    On success, stashes the decoded claims on ``request.velt_claims`` and calls the
    view. On failure, returns a 401 with the SDK's ``error``/``errorCode``.
    """
    @functools.wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        try:
            sdk = get_velt_sdk()
            # Django's request.headers is a case-insensitive Mapping — pass it straight
            # through; the SDK extracts/strips the Bearer scheme itself.
            result = sdk.selfHosting.verifyToken(headers=request.headers)
        except Exception:
            # Fail-closed: never let an unexpected error fall through to the view.
            return _unauthorized('Token verification failed.', 'VERIFICATION_FAILED')

        if not result.verified:
            # Explicit, opt-in dev allow-through when no verifier is configured.
            if _ALLOW_UNCONFIGURED and result.errorCode == 'NOT_CONFIGURED':
                request.velt_claims = None
                return view_func(request, *args, **kwargs)
            return _unauthorized(result.error, result.errorCode)

        request.velt_claims = result.claims
        return view_func(request, *args, **kwargs)

    return _wrapped
