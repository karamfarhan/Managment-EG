# from django.db.models.signals import pre_delete
# from django.dispatch import receiver
# from .models import Instrument, InvoiceInstrumentItem


# @receiver(pre_delete, sender=InvoiceInstrumentItem)
# def update_instrument_action(sender, instance, **kwargs):
#     # instance is the deleted object of ModelB
#     # Perform your update logic here
#     # instance.substance.in_action = False
#     # instance.substance.save()
#     Instrument.objects.filter(id=instance.substance.id).update(in_action=True)
