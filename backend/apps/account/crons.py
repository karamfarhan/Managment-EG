# TODO: user this library instead django-apscheduler
from django.core import management
from rest_framework_simplejwt.token_blacklist.management.commands import flushexpiredtokens


def delete_expired_tokens():
    print("Deleting expired tokens------------------")
    cmd = flushexpiredtokens.Command()
    management.call_command(cmd)
