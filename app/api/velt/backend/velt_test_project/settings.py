"""
Django settings for velt_test_project project.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-test-key-change-in-production'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'corsheaders',
    'velt_api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'velt_test_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'velt_test_project.wsgi.application'

# Database (not used, we use MongoDB via Velt SDK)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings for frontend integration
# Read from environment variable, with localhost as fallback for local development
cors_origins_env = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:3001')
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()]

CORS_ALLOW_CREDENTIALS = True

# Allow all headers and methods for file uploads
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# File upload settings
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB

# Velt SDK Configuration
# Option 1: Use MongoDB Atlas connection string (recommended)
# Get your connection string from: MongoDB Atlas → Connect → Connect your application
# Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
VELT_SDK_CONFIG = {
    'database': {
        # Use connection_string for MongoDB Atlas (easiest)
        'connection_string': os.getenv(
            'VELT_MONGODB_CONNECTION_STRING',
            ''
        ),
        # OR use individual components (for local MongoDB or if connection_string not set)
        # For MongoDB Atlas SRV: use cluster hostname (fallback if connection_string not set)
        # The SDK will automatically detect .mongodb.net domains and use SRV connection
        'host': os.getenv('VELT_MONGODB_HOST', ''),
        'username': os.getenv('VELT_MONGODB_USERNAME', ''),
        'password': os.getenv('VELT_MONGODB_PASSWORD', ''),
        'auth_database': os.getenv('VELT_MONGODB_AUTH_DB', ''),
        'database_name': os.getenv('VELT_MONGODB_DATABASE', '')
    },
    'user_schema': {
        'userId': 'userId',
        'name': 'name',
        'photoUrl': 'photoUrl',
        'email': 'email',
        'color': 'color',
        'textColor': 'textColor',
        'isAdmin': 'isAdmin',
        'initial': 'initial'
    },
    'collections': {
        'comments': 'comment_annotations',
        'reactions': 'reaction_annotations',
        'attachments': 'attachments',
        'users': 'users'
    },
    'aws': {
        'access_key_id': os.getenv('AWS_ACCESS_KEY_ID', ''),
        'secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY', ''),
        'region': os.getenv('AWS_REGION', ''),
        'bucket_name': os.getenv('AWS_S3_BUCKET', ''),  # Match .env variable name
    },
    # Support both VELT_API_KEY and NEXT_PUBLIC_VELT_API_KEY (for shared .env with frontend)
    'apiKey': os.getenv('VELT_API_KEY', os.getenv('NEXT_PUBLIC_VELT_API_KEY', '')),
    'authToken': os.getenv('VELT_AUTH_TOKEN', ''),
    # resolver-endpoint-auth (Feature 1): verify the JWT the Velt frontend forwards to
    # the gated resolver endpoints (Authorization: Bearer <token>). The
    # require_velt_token gate calls sdk.selfHosting.verifyToken with this config.
    # AUTHENTICATION-ONLY — the resolver services keep their own apiKey/org scoping.
    # The gate is fail-closed: a missing/invalid/expired token yields a 401.
    #
    # LOCAL-DEV ONLY: HS256 with a shared secret read from env. The SAME secret is used
    # by the dev-only /api/velt/auth/mint endpoint to sign tokens the frontend forwards.
    # In production, use an asymmetric algorithm (RS256/ES256) with a JWKS URL or public
    # key and a real identity provider instead of the mint endpoint. NEVER ship the secret.
    'resolver_auth': {
        'jwt': {
            'secret': os.getenv('VELT_RESOLVER_JWT_SECRET', 'dev-resolver-secret'),
            'algorithms': ['HS256'],
            # optional: 'issuer': '...', 'audience': '...', 'leeway': 5,
        },
        # 'header': 'Authorization',  # default
        # 'scheme': 'Bearer',         # default
    },
}

