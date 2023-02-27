import os

from .base import *
from .base import BASE_DIR, env

# import dj_database_url


DEBUG = False
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
ALLOWED_HOSTS = [
    "managment-eg-production.up.railway.app",
]
CSRF_TRUSTED_ORIGINS = [
    "https://mountain-system.web.app",
]


CORS_ALLOWED_ORIGINS = [
    "https://mountain-system.web.app",
]


# DATABASES = {"default": dj_database_url.parse(env("DATABASE_URL"))}

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


### PRODUCTION SETTING -- WITH AWS SERVER
# - make an account in aws
# - make bucket in s3
# - make user and give him the access to the bucket
# - pip install  boto3
# - pip install django-storages

AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
AWS_S3_CUSTOM_DOMAIN = "%s.s3.amazonaws.com" % AWS_STORAGE_BUCKET_NAME
AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
AWS_DEFAULT_ACL = "public-read"

AWS_LOCATION = "static"
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

# - now go and make the storages file in the main folder of the project
STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_LOCATION}/"
STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
DEFAULT_FILE_STORAGE = "core.storages.MediaStore"
