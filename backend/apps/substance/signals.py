# from django.db.models.signals import pre_delete
# from django.dispatch import receiver
# from .models import Instrument, InvoiceInstrumentItem


# @receiver(pre_delete, sender=InvoiceInstrumentItem)
# def update_instrument_action(sender, instance, **kwargs):
#     # instance is the deleted object of ModelB
#     # Perform your update logic here
#     print("pre_delete being claled")
#     Instrument.objects.filter(id=instance.instrument.id).update(in_action=True)
#     # instance.instrument.in_action = False
#     # instance.instrument.save()


# @receiver(post_save, sender=User)
# def create_user_token(sender, instance, created, **kwargs):
#     if created:
#         Token.objects.create(user=instance)


# @receiver(post_save, sender=User)
# def create_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)


# @receiver(post_save, sender=User)
# def save_profile(sender, instance, created, **kwargs):
#     if created == False:
#         instance.profile.save()
