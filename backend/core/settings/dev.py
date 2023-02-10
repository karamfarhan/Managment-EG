import os

import dj_database_url

from .base import *
from .base import BASE_DIR

ALLOWED_HOSTS = ["*"]

DEBUG = True
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_ALL_ORIGINS = True

# PUT THE URL FOR THE SITE TO GET THE BASE URL
BASE_URL = "http://127.0.0.1:8000"

DATABASES = {"default": {}}
if os.environ.get("DEVELOPER") == "KARAM":
    DATABASES["default"]["ENGINE"] = "django.db.backends.postgresql_psycopg2"
    DATABASES["default"]["NAME"] = os.environ.get("DB_NAME")
    DATABASES["default"]["USER"] = os.environ.get("DB_USER")
    DATABASES["default"]["PASSWORD"] = os.environ.get("DB_PASSWORD")
    DATABASES["default"]["HOST"] = "pgdb"
    DATABASES["default"]["PORT"] = 5432
if os.environ.get("DEVELOPER") == "ALAA":
    DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"
    DATABASES["default"]["NAME"] = BASE_DIR / "db.sqlite3"
if os.environ.get("DEVELOPER") == "PROD":
    DATABASES = {"default": dj_database_url.parse(os.environ.get("DATABASE_URL"))}
