from django.db import models


class MachineModel(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class Engine(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class Transmission(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class DriveAxle(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class SteeredAxle(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class MaintenanceType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class MaintenanceHelder(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class Unit(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class RecoveryType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()


class Machine(models.Model):
    factory_number = models.CharField(max_length=255, unique=True)
    machine_model = models.ForeignKey(MachineModel, on_delete=models.RESTRICT)
    engine_model = models.ForeignKey(Engine, on_delete=models.RESTRICT)
    engine_number = models.CharField(max_length=255)
    transmission_model = models.ForeignKey(Transmission, on_delete=models.RESTRICT)
    transmission_number = models.CharField(max_length=255)
    drive_axle_model = models.ForeignKey(DriveAxle, on_delete=models.RESTRICT)
    drive_axle_number = models.CharField(max_length=255)
    steered_axle_model = models.ForeignKey(SteeredAxle, on_delete=models.RESTRICT)
    steered_axle_number = models.CharField(max_length=255)
    supply_contract_number_date = models.CharField(max_length=255)
    dispatch_date = models.DateField()
    consignee = models.TextField()
    delivery_address = models.TextField()
    equipment = models.TextField()
    client = None
    service_company = None


class Maintenance(models.Model):
    type = models.ForeignKey(MaintenanceType, on_delete=models.RESTRICT)
    date = models.DateField()
    operating_time = models.PositiveIntegerField()
    work_order_number = models.CharField(max_length=255)
    work_order_date = models.DateField()
    maintenance_helder = models.ForeignKey(MaintenanceHelder, on_delete=models.RESTRICT)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    service_company = None


class Reclamation(models.Model):
    rejection_date = models.DateField()
    operating_time = models.PositiveIntegerField()
    unit = models.ForeignKey(Unit, on_delete=models.RESTRICT)
    description = models.TextField()
    recovery_method = models.ForeignKey(RecoveryType, on_delete=models.RESTRICT)
    spare_parts = models.TextField()
    recovery_date = models.DateField()
    downtime = None
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    service_company = None
