from rest_framework import serializers
from .models import *


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
