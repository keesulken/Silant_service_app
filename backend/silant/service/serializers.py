from rest_framework import serializers
from .models import *


class MachineTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = (
            'pk',
            'factory_number'
        )


class MachineDirectoryTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineDirectory
        fields = (
            'pk',
            'name',
        )


class RepairDirectoryTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineDirectory
        fields = (
            'pk',
            'name',
        )


class ClientProfileTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = (
            'pk',
            'name',
        )


class ServiceCompanyProfileTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCompanyProfile
        fields = (
            'pk',
            'name',
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'type',
        )


class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = (
            'user',
            'name',
            'description',
        )


class ServiceCompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCompanyProfile
        fields = (
            'user',
            'name',
            'description',
        )


class MachineLoggedUserSerializer(serializers.ModelSerializer):
    machine_model = MachineDirectoryTableSerializer()
    engine_model = MachineDirectoryTableSerializer()
    transmission_model = MachineDirectoryTableSerializer()
    drive_axle_model = MachineDirectoryTableSerializer()
    steered_axle_model = MachineDirectoryTableSerializer()
    client = ClientProfileTableSerializer()
    service_company = ServiceCompanyProfileTableSerializer()

    class Meta:
        model = Machine
        fields = (
            'id',
            'factory_number',
            'machine_model',
            'engine_model',
            'engine_number',
            'transmission_model',
            'transmission_number',
            'drive_axle_model',
            'drive_axle_number',
            'steered_axle_model',
            'steered_axle_number',
            'supply_contract_number_date',
            'dispatch_date',
            'consignee',
            'delivery_address',
            'equipment',
            'client',
            'service_company',
        )


class MachineAnonymousUserSerializer(serializers.ModelSerializer):
    machine_model = MachineDirectoryTableSerializer()
    engine_model = MachineDirectoryTableSerializer()
    transmission_model = MachineDirectoryTableSerializer()
    drive_axle_model = MachineDirectoryTableSerializer()
    steered_axle_model = MachineDirectoryTableSerializer()

    class Meta:
        model = Machine
        fields = (
            'factory_number',
            'machine_model',
            'engine_model',
            'engine_number',
            'transmission_model',
            'transmission_number',
            'drive_axle_model',
            'drive_axle_number',
            'steered_axle_model',
            'steered_axle_number',
        )


class MaintenanceSerializer(serializers.ModelSerializer):
    type = RepairDirectoryTableSerializer()
    maintenance_holder = RepairDirectoryTableSerializer()
    machine = MachineTableSerializer()
    service_company = ServiceCompanyProfileTableSerializer()

    class Meta:
        model = Maintenance
        fields = (
            'id',
            'type',
            'date',
            'operating_time',
            'work_order_number',
            'work_order_date',
            'maintenance_holder',
            'machine',
            'service_company',
        )


class ReclamationSerializer(serializers.ModelSerializer):
    unit = RepairDirectoryTableSerializer()
    repair_method = RepairDirectoryTableSerializer()
    machine = MachineTableSerializer()
    service_company = ServiceCompanyProfileTableSerializer()

    class Meta:
        model = Reclamation
        fields = (
            'id',
            'rejection_date',
            'operating_time',
            'unit',
            'description',
            'repair_method',
            'spare_parts',
            'recovery_date',
            'downtime',
            'machine',
            'service_company',
        )


class MachineDirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineDirectory
        fields = (
            'type',
            'name',
            'description',
        )


class RepairDirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RepairDirectory
        fields = (
            'type',
            'name',
            'description',
        )

