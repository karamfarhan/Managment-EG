from .base import *
from .base import BASE_DIR, env

ALLOWED_HOSTS = ["*"]

DEBUG = True
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_ALL_ORIGINS = True


# PUT THE URL FOR THE SITE TO GET THE BASE URL
BASE_URL = "http://127.0.0.1:8000"

DATABASES = {"default": {}}
if env("DEVELOPER") == "KARAM":
    DATABASES["default"]["ENGINE"] = "django.db.backends.postgresql_psycopg2"
    DATABASES["default"]["NAME"] = env("DB_NAME")
    DATABASES["default"]["USER"] = env("DB_USER")
    DATABASES["default"]["PASSWORD"] = env("DB_PASSWORD")
    DATABASES["default"]["HOST"] = "pgdb"
    DATABASES["default"]["PORT"] = 5432
if env("DEVELOPER") == "ALAA":
    DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"
    DATABASES["default"]["NAME"] = BASE_DIR / "db.sqlite3"
