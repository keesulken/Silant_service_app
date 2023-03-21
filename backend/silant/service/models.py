from django.contrib.auth.models import AbstractUser
from django.db import models
from .choices import *


class User(AbstractUser):
    type = models.CharField(
        max_length=3,
        choices=USER_TYPES,
        default='MNU',
        verbose_name='Тип пользователя'
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['type', 'is_superuser']


class MachineDirectory(models.Model):
    type = models.CharField(
        max_length=3,
        choices=MACHINE_DIRECTORY_CHOICES,
        default='NDT',
        verbose_name='Тип'
    )
    name = models.CharField(max_length=255,
                            verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        unit_type = None
        for i in MACHINE_DIRECTORY_CHOICES:
            if self.type == i[0]:
                unit_type = i[1]
                break
        return f'{unit_type} {self.name[:20]}'

    class Meta:
        verbose_name = 'Справочник агрегатов'
        verbose_name_plural = 'Справочники агрегатов'


class RepairDirectory(models.Model):
    type = models.CharField(
        max_length=3,
        choices=REPAIR_DIRECTORY_CHOICES,
        default='NDT',
        verbose_name='Тип'
    )
    name = models.CharField(max_length=255,
                            verbose_name='Название')
    description = models.TextField(verbose_name='Описание')

    def __str__(self):
        repair_type = None
        for i in REPAIR_DIRECTORY_CHOICES:
            if self.type == i[0]:
                repair_type = i[1]
                break
        return f'{repair_type} {self.name[:20]}'

    class Meta:
        verbose_name = 'Справочник по обслуживанию'
        verbose_name_plural = 'Справочники по обслуживанию'


class ClientProfile(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Аккаунт в системе',
        related_name='cl_profile'
    )
    name = models.CharField(max_length=255,
                            verbose_name='Название организации-клиента')
    description = models.TextField(blank=True,
                                   verbose_name='Описание')

    def __str__(self):
        return f'Клиент {self.name[:20]}'

    class Meta:
        verbose_name = 'Карточка клиента'
        verbose_name_plural = 'Карточки клиентов'


class ServiceCompanyProfile(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Аккаунт в системе',
        related_name='sc_profile'
    )
    name = models.CharField(max_length=255,
                            verbose_name='Название сервисной организации')
    description = models.TextField(blank=True,
                                   verbose_name='Описание')

    def __str__(self):
        return f'Сервисная компания {self.name[:20]}'

    class Meta:
        verbose_name = 'Карточка сервисной организации'
        verbose_name_plural = 'Карточки сервисных организаций'


class Machine(models.Model):
    factory_number = models.CharField(
        max_length=255,
        unique=True,
        verbose_name='Зав. № машины'
    )
    machine_model = models.ForeignKey(
        MachineDirectory,
        related_name='machine_models',
        on_delete=models.RESTRICT,
        verbose_name='Модель техники'
    )
    engine_model = models.ForeignKey(
        MachineDirectory,
        related_name='engines',
        on_delete=models.RESTRICT,
        verbose_name='Модель двигателя'
    )
    engine_number = models.CharField(max_length=255,
                                     verbose_name='Зав. № двигателя')
    transmission_model = models.ForeignKey(
        MachineDirectory,
        related_name='transmissions',
        on_delete=models.RESTRICT,
        verbose_name='Модель трансмиссии'
    )
    transmission_number = models.CharField(max_length=255,
                                           verbose_name='Зав. № трансмиссии')
    drive_axle_model = models.ForeignKey(
        MachineDirectory,
        related_name='drive_axles',
        on_delete=models.RESTRICT,
        verbose_name='Модель ведущего моста'
    )
    drive_axle_number = models.CharField(max_length=255,
                                         verbose_name='Зав. № ведущего моста')
    steered_axle_model = models.ForeignKey(
        MachineDirectory,
        related_name='steered_axles',
        on_delete=models.RESTRICT,
        verbose_name='Модель управляемого моста'
    )
    steered_axle_number = models.CharField(max_length=255,
                                           verbose_name='Зав. № управляемого моста')
    supply_contract_number_date = models.CharField(
        max_length=255,
        verbose_name='Договор поставки №, дата'
    )
    dispatch_date = models.DateField(verbose_name='Дата отгрузки с завода')
    consignee = models.TextField(verbose_name='Грузополучатель (конечный потребитель)')
    delivery_address = models.TextField(verbose_name='Адрес поставки (эксплуатации)')
    equipment = models.TextField(verbose_name='Комплектация (доп. опции)')
    client = models.ForeignKey(
        ClientProfile,
        related_name='machines_in_use',
        on_delete=models.RESTRICT,
        blank=True,
        null=True,
        verbose_name='Клиент'
    )
    service_company = models.ForeignKey(
        ServiceCompanyProfile,
        related_name='maintain_units',
        on_delete=models.RESTRICT,
        blank=True,
        null=True,
        verbose_name='Сервисная компания'
    )

    def __str__(self):
        return f'{self.machine_model.name} №{self.factory_number}'

    class Meta:
        verbose_name = 'Машина'
        verbose_name_plural = 'Машины'


class Maintenance(models.Model):
    type = models.ForeignKey(
        RepairDirectory,
        related_name='types',
        on_delete=models.RESTRICT,
        verbose_name='Вид ТО'
    )
    date = models.DateField(verbose_name='Дата проведения ТО')
    operating_time = models.PositiveIntegerField(verbose_name='Наработка, м/час')
    work_order_number = models.CharField(max_length=255,
                                         verbose_name='№ заказ-наряда')
    work_order_date = models.DateField(verbose_name='Дата заказ-наряда')
    maintenance_holder = models.ForeignKey(
        RepairDirectory,
        related_name='holders',
        on_delete=models.RESTRICT,
        verbose_name='Организация, проводившая ТО'
    )
    machine = models.ForeignKey(
        Machine,
        related_name='maintenances',
        on_delete=models.CASCADE,
        verbose_name='Машина'
    )
    service_company = models.ForeignKey(
        ServiceCompanyProfile,
        related_name='maintenances',
        on_delete=models.RESTRICT,
        verbose_name='Сервисная компания'
    )

    def __str__(self):
        return f'ТО {self.type.name} {self.date}'

    class Meta:
        verbose_name = 'ТО'
        verbose_name_plural = 'ТО'


class Reclamation(models.Model):
    rejection_date = models.DateField(verbose_name='Дата отказа')
    operating_time = models.PositiveIntegerField(verbose_name='Наработка м/час')
    unit = models.ForeignKey(
        RepairDirectory,
        related_name='units',
        on_delete=models.RESTRICT,
        verbose_name='Узел отказа'
    )
    description = models.TextField(verbose_name='Описание отказа')
    repair_method = models.ForeignKey(
        RepairDirectory,
        related_name='methods',
        on_delete=models.RESTRICT,
        verbose_name='Способ восстановления'
    )
    spare_parts = models.TextField(verbose_name='Используемые запасные части')
    recovery_date = models.DateField(verbose_name='Дата восстановления')
    downtime = models.PositiveIntegerField(verbose_name='Время простоя техники')
    machine = models.ForeignKey(
        Machine,
        related_name='reclamations',
        on_delete=models.CASCADE,
        verbose_name='Машина'
    )
    service_company = models.ForeignKey(
        ServiceCompanyProfile,
        related_name='reclamations',
        on_delete=models.RESTRICT,
        verbose_name='Сервисная компания'
    )

    def __str__(self):
        return f'Рекламация {self.unit.name} {self.rejection_date}'

    class Meta:
        verbose_name = 'Рекламация'
        verbose_name_plural = 'Рекламации'
