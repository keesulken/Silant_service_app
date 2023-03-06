from django.contrib.auth.models import AbstractUser
from django.db import models
from choices import *


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


class ServiceCompany(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()


class Machine(models.Model):
    factory_number = models.CharField(max_length=255, unique=True)
    machine_model = models.ForeignKey(MachineDirectory, on_delete=models.RESTRICT)
    engine_model = models.ForeignKey(MachineDirectory, on_delete=models.RESTRICT)
    engine_number = models.CharField(max_length=255)
    transmission_model = models.ForeignKey(MachineDirectory, on_delete=models.RESTRICT)
    transmission_number = models.CharField(max_length=255)
    drive_axle_model = models.ForeignKey(MachineDirectory, on_delete=models.RESTRICT)
    drive_axle_number = models.CharField(max_length=255)
    steered_axle_model = models.ForeignKey(MachineDirectory, on_delete=models.RESTRICT)
    steered_axle_number = models.CharField(max_length=255)
    supply_contract_number_date = models.CharField(max_length=255)
    dispatch_date = models.DateField()
    consignee = models.TextField()
    delivery_address = models.TextField()
    equipment = models.TextField()
    client = None
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.RESTRICT)


class Maintenance(models.Model):
    type = models.ForeignKey(RepairDirectory, on_delete=models.RESTRICT)
    date = models.DateField()
    operating_time = models.PositiveIntegerField()
    work_order_number = models.CharField(max_length=255)
    work_order_date = models.DateField()
    maintenance_helder = models.ForeignKey(ServiceCompany, on_delete=models.RESTRICT)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.RESTRICT)


class Reclamation(models.Model):
    rejection_date = models.DateField()
    operating_time = models.PositiveIntegerField()
    unit = models.ForeignKey(RepairDirectory, on_delete=models.RESTRICT)
    description = models.TextField()
    repair_method = models.ForeignKey(RepairDirectory, on_delete=models.RESTRICT)
    spare_parts = models.TextField()
    recovery_date = models.DateField()
    downtime = None
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.RESTRICT)
