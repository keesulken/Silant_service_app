from django.contrib.auth.models import AbstractUser
from django.db import models
from .choices import *


class User(AbstractUser):
    type = models.CharField(
        max_length=3,
        choices=USER_TYPES,
        default='MNU',
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['type']


class MachineDirectory(models.Model):
    type = models.CharField(
        max_length=3,
        choices=MACHINE_DIRECTORY_CHOICES,
        default='NDT',
    )
    name = models.CharField(max_length=255)
    description = models.TextField()


class RepairDirectory(models.Model):
    type = models.CharField(
        max_length=3,
        choices=REPAIR_DIRECTORY_CHOICES,
        default='NDT',
    )
    name = models.CharField(max_length=255)
    description = models.TextField()


class Machine(models.Model):
    factory_number = models.CharField(max_length=255, unique=True)
    machine_model = models.ForeignKey(
        MachineDirectory,
        related_name='machine_models',
        on_delete=models.RESTRICT
    )
    engine_model = models.ForeignKey(
        MachineDirectory,
        related_name='engines',
        on_delete=models.RESTRICT
    )
    engine_number = models.CharField(max_length=255)
    transmission_model = models.ForeignKey(
        MachineDirectory,
        related_name='transmissions',
        on_delete=models.RESTRICT
    )
    transmission_number = models.CharField(max_length=255)
    drive_axle_model = models.ForeignKey(
        MachineDirectory,
        related_name='drive_axles',
        on_delete=models.RESTRICT
    )
    drive_axle_number = models.CharField(max_length=255)
    steered_axle_model = models.ForeignKey(
        MachineDirectory,
        related_name='steered_axles',
        on_delete=models.RESTRICT
    )
    steered_axle_number = models.CharField(max_length=255)
    supply_contract_number_date = models.CharField(max_length=255)
    dispatch_date = models.DateField()
    consignee = models.TextField()
    delivery_address = models.TextField()
    equipment = models.TextField()
    client = models.ForeignKey(
        User,
        related_name='machines_in_use',
        on_delete=models.RESTRICT,
        blank=True
    )
    service_company = models.ForeignKey(
        User,
        related_name='maintain_units',
        on_delete=models.RESTRICT,
        blank=True
    )


class Maintenance(models.Model):
    type = models.ForeignKey(
        RepairDirectory,
        related_name='types',
        on_delete=models.RESTRICT
    )
    date = models.DateField()
    operating_time = models.PositiveIntegerField()
    work_order_number = models.CharField(max_length=255)
    work_order_date = models.DateField()
    maintenance_holder = models.ForeignKey(
        RepairDirectory,
        related_name='holders',
        on_delete=models.RESTRICT
    )
    machine = models.ForeignKey(
        Machine,
        related_name='maintenances',
        on_delete=models.CASCADE
    )
    service_company = models.ForeignKey(
        User,
        related_name='maintenances',
        on_delete=models.RESTRICT
    )


class Reclamation(models.Model):
    rejection_date = models.DateField()
    operating_time = models.PositiveIntegerField()
    unit = models.ForeignKey(
        RepairDirectory,
        related_name='units',
        on_delete=models.RESTRICT
    )
    description = models.TextField()
    repair_method = models.ForeignKey(
        RepairDirectory,
        related_name='methods',
        on_delete=models.RESTRICT
    )
    spare_parts = models.TextField()
    recovery_date = models.DateField()
    machine = models.ForeignKey(
        Machine,
        related_name='reclamations',
        on_delete=models.CASCADE
    )
    service_company = models.ForeignKey(
        User,
        related_name='reclamations',
        on_delete=models.RESTRICT
    )

    # @property
    # def downtime(self):
    #     return self.recovery_date - self.rejection_date
