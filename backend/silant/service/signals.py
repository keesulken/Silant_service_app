from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created and instance.type == 'MNU':
        user = instance
        name = instance.username
        ClientProfile.objects.create(user=user, name=name)
        if Group.objects.filter(name='clients').exists():
            clients = Group.objects.get(name='clients')
            clients.user_set.add(instance)
        else:
            clients = Group.objects.create(name='clients')
            clients.permissions.add(
                Permission.objects.get(codename='view_machine'),
                Permission.objects.get(codename='view_maintenance'),
                Permission.objects.get(codename='change_maintenance'),
                Permission.objects.get(codename='view_reclamation'),
            )
            clients.user_set.add(instance)
    elif created and instance.type == 'SVC':
        user = instance
        name = instance.username
        ServiceCompanyProfile.objects.create(user=user, name=name)
        if Group.objects.filter(name='service_companies').exists():
            sc = Group.objects.get(name='service_companies')
            sc.user_set.add(instance)
        else:
            sc = Group.objects.create(name='service_companies')
            sc.permissions.add(
                Permission.objects.get(codename='view_machine'),
                Permission.objects.get(codename='view_maintenance'),
                Permission.objects.get(codename='change_maintenance'),
                Permission.objects.get(codename='view_reclamation'),
                Permission.objects.get(codename='change_reclamation'),
            )
            sc.user_set.add(instance)
    elif created and instance.type == 'MFR':
        if Group.objects.filter(name='managers').exists():
            managers = Group.objects.get(name='managers')
            managers.user_set.add(instance)
        else:
            managers = Group.objects.create(name='managers')
            managers.permissions.add(
                Permission.objects.get(codename='view_machine'),
                Permission.objects.get(codename='change_machine'),
                Permission.objects.get(codename='view_maintenance'),
                Permission.objects.get(codename='change_maintenance'),
                Permission.objects.get(codename='view_reclamation'),
                Permission.objects.get(codename='change_reclamation'),
                Permission.objects.get(codename='view_machinedirectory'),
                Permission.objects.get(codename='add_machinedirectory'),
                Permission.objects.get(codename='delete_machinedirectory'),
                Permission.objects.get(codename='change_machinedirectory'),
                Permission.objects.get(codename='view_repairdirectory'),
                Permission.objects.get(codename='add_repairdirectory'),
                Permission.objects.get(codename='delete_repairdirectory'),
                Permission.objects.get(codename='change_repairdirectory'),
            )
            managers.user_set.add(instance)
