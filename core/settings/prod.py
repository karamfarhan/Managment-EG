import dj_database_url

from .base import *
from .base import MIDDLEWARE, env

DEBUG = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
ALLOWED_HOSTS = [
    "managementdjango.onrender.com",
]
CSRF_TRUSTED_ORIGINS = [
    "https://mountain-system.web.app",
]


CORS_ALLOWED_ORIGINS = [
    "https://mountain-system.web.app",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": env("PGDATABASE"),
        "USER": env("PGUSER"),
        "PASSWORD": env("PGPASSWORD"),
        "HOST": env("PGHOST"),
        "PORT": env("PGPORT"),
    }
}


# DATABASES = {"default": dj_database_url.parse(env("DATABASE_URL"))}


# ### PRODUCTION SETTING -- WITH AWS SERVER
# # - make an account in aws
# # - make bucket in s3
# # - make user and give him the access to the bucket
# # - pip install  boto3
# # - pip install django-storages

# AWS_ACCESS_KEY_ID = 'AAKIATYYBUP12YW5YDX1235X2YCOEV'
# AWS_SECRET_ACCESS_KEY = 'YYaCxRJa213Qk61q7is612srYb523315EycY123ygasgGW0tYor0PfaciC210asdasdn8B'
# AWS_STORAGE_BUCKET_NAME = '19387112125n981efwefwe7b98c12'
# AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
# AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
# AWS_DEFAULT_ACL = 'public-read'

# AWS_LOCATION = 'static'
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'static'),
# ]

# # - now go and make the storages file in the main folder of the project
# STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
# STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
# DEFAULT_FILE_STORAGE = 'core.storages.MediaStore'
