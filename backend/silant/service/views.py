from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                user = User.objects.get(pk=kwargs['id'])
                data = UserSerializer(user).data
                return Response(data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            user = User.objects.all()
            data = UserSerializer(user, many=True).data
            return Response(data)


class MachineAPIView(APIView):
    def get(self, request, **kwargs):
        try:
            machine = Machine.objects.get(pk=kwargs['id'])
            maintenance = Maintenance.objects.filter(machine=machine).order_by('-date')
            reclamation = Reclamation.objects.filter(machine=machine).order_by('-rejection_date')
            machine_data = MachineLoggedUserSerializer(machine).data
            if maintenance.exists():
                maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            else:
                maintenance_data = None
            if reclamation.exists():
                reclamation_data = ReclamationSerializer(reclamation, many=True).data
            else:
                reclamation_data = None
            return Response({
                'machine': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
            })
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, **kwargs):
        if kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            machine = Machine()
            machine.factory_number = request.data['serial']
            machine.machine_model = MachineDirectory.objects.get(name=request.data['tech-model'])
            machine.engine_model = MachineDirectory.objects.get(name=request.data['eng-model'])
            machine.engine_number = request.data['engine']
            machine.transmission_model = MachineDirectory.objects.get(name=request.data['trm-model'])
            machine.transmission_number = request.data['transmission']
            machine.drive_axle_model = MachineDirectory.objects.get(name=request.data['dra-model'])
            machine.drive_axle_number = request.data['drive']
            machine.steered_axle_model = MachineDirectory.objects.get(name=request.data['sta-model'])
            machine.steered_axle_number = request.data['steered']
            machine.supply_contract_number_date = request.data['supply']
            machine.dispatch_date = request.data['dispatch']
            machine.consignee = request.data['consignee']
            machine.delivery_address = request.data['address']
            machine.equipment = request.data['equipment']
            machine.client = ClientProfile.objects.get(name=request.data['client'])
            machine.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
            machine.save()
            return Response({'id': machine.pk}, status=status.HTTP_201_CREATED)

    def patch(self, request, **kwargs):
        if not kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            machine = Machine.objects.get(pk=kwargs['id'])
            machine.factory_number = request.data['serial']
            machine.machine_model = MachineDirectory.objects.get(name=request.data['tech-model'])
            machine.engine_model = MachineDirectory.objects.get(name=request.data['eng-model'])
            machine.engine_number = request.data['engine']
            machine.transmission_model = MachineDirectory.objects.get(name=request.data['trm-model'])
            machine.transmission_number = request.data['transmission']
            machine.drive_axle_model = MachineDirectory.objects.get(name=request.data['dra-model'])
            machine.drive_axle_number = request.data['drive']
            machine.steered_axle_model = MachineDirectory.objects.get(name=request.data['sta-model'])
            machine.steered_axle_number = request.data['steered']
            machine.supply_contract_number_date = request.data['supply']
            machine.dispatch_date = request.data['dispatch']
            machine.consignee = request.data['consignee']
            machine.delivery_address = request.data['address']
            machine.equipment = request.data['equipment']
            machine.client = ClientProfile.objects.get(name=request.data['client'])
            machine.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
            machine.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, **kwargs):
        if not kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            machine = Machine.objects.get(pk=kwargs['id'])
            machine.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class MachineSearchAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                machine = Machine.objects.get(pk=kwargs['id'])
                data = MachineLoggedUserSerializer(machine).data
                return Response(data)
            except ObjectDoesNotExist:
                return Response(status.HTTP_404_NOT_FOUND)
        else:
            items = Machine.objects.all().order_by('-dispatch_date')
            data = MachineLoggedUserSerializer(items, many=True).data
            return Response(data)

    def post(self, request, **kwargs):
        try:
            machine = Machine.objects.get(factory_number=request.data['num'])
            data = MachineAnonymousUserSerializer(machine).data
            return Response(data)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PersonalPageAPIView(APIView):
    def post(self, request, **kwargs):
        user = User.objects.get(username=request.data['username'])
        if user.type == 'MFR':
            machines = Machine.objects.all().order_by('-dispatch_date')
            maintenance = Maintenance.objects.all().order_by('-date')
            reclamation = Reclamation.objects.all().order_by('-rejection_date')
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
            })
        elif user.type == 'SVC':
            profile = ServiceCompanyProfile.objects.get(user=user)
            machines = Machine.objects.filter(service_company=profile).order_by('-dispatch_date')
            maintenance = Maintenance.objects.filter(service_company=profile).order_by('-date')
            reclamation = Reclamation.objects.filter(service_company=profile).order_by('-rejection_date')
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
            })
        else:
            profile = ClientProfile.objects.get(user=user)
            machines = Machine.objects.filter(client=profile).order_by('-dispatch_date')
            if not machines.exists():
                return Response({
                    'machines': None,
                    'maintenance': None,
                    'reclamation': None,
                })
            maintenance = Maintenance.objects.filter(machine__in=machines).order_by('-date')
            reclamation = Reclamation.objects.filter(machine__in=machines).order_by('-rejection_date')
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
            })


class UnitAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                item = MachineDirectory.objects.get(pk=kwargs['id'])
                item_data = MachineDirectorySerializer(item).data
                return Response(item_data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            items = MachineDirectory.objects.all()
            data = MachineDirectoryFormSerializer(items, many=True).data
            return Response(data)


class RepairAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                item = RepairDirectory.objects.get(pk=kwargs['id'])
                item_data = RepairDirectorySerializer(item).data
                return Response(item_data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            items = RepairDirectory.objects.all()
            data = RepairDirectoryFormSerializer(items, many=True).data
            return Response(data)


class ClientAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                item = ClientProfile.objects.get(pk=kwargs['id'])
                item_data = ClientProfileSerializer(item).data
                return Response(item_data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            clients = ClientProfile.objects.all()
            data = ClientProfileSerializer(clients, many=True).data
            return Response(data)


class CompanyAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                item = ServiceCompanyProfile.objects.get(pk=kwargs['id'])
                item_data = ServiceCompanyProfileSerializer(item).data
                return Response(item_data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            companies = ServiceCompanyProfile.objects.all()
            data = ServiceCompanyProfileSerializer(companies, many=True).data
            return Response(data)


class MaintenanceAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                item = Maintenance.objects.get(pk=kwargs['id'])
                item_data = MaintenanceSerializer(item).data
                return Response(item_data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            items = Maintenance.objects.all().order_by('-date')
            data = MaintenanceSerializer(items, many=True).data
            return Response(data)

    def post(self, request, **kwargs):
        if kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            maintenance = Maintenance()
            maintenance.type = RepairDirectory.objects.get(name=request.data['mt-type'])
            maintenance.date = request.data['mt-date']
            maintenance.operating_time = request.data['mt-time']
            maintenance.work_order_number = request.data['work-order-number']
            maintenance.work_order_date = request.data['work-order-date']
            maintenance.maintenance_holder = RepairDirectory.objects.get(name=request.data['mt-holder'])
            maintenance.machine = Machine.objects.get(factory_number=request.data['machine'])
            maintenance.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
            maintenance.save()
            return Response({'id': maintenance.pk}, status=status.HTTP_201_CREATED)

    def patch(self, request, **kwargs):
        if not kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            maintenance = Maintenance.objects.get(pk=kwargs['id'])
            maintenance.type = RepairDirectory.objects.get(name=request.data['mt-type'])
            maintenance.date = request.data['mt-date']
            maintenance.operating_time = request.data['mt-time']
            maintenance.work_order_number = request.data['work-order-number']
            maintenance.work_order_date = request.data['work-order-date']
            maintenance.maintenance_holder = RepairDirectory.objects.get(name=request.data['mt-holder'])
            maintenance.machine = Machine.objects.get(factory_number=request.data['machine'])
            maintenance.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
            maintenance.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, **kwargs):
        if not kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            maintenance = Maintenance.objects.get(pk=kwargs['id'])
            maintenance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class ReclamationAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs:
            try:
                item = Reclamation.objects.get(pk=kwargs['id'])
                item_data = ReclamationSerializer(item).data
                return Response(item_data)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            items = Reclamation.objects.all().order_by('-rejection_date')
            data = ReclamationSerializer(items, many=True).data
            return Response(data)

    def post(self, request, **kwargs):
        if kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            reclamation = Reclamation()
            reclamation.rejection_date = request.data['rl-date']
            reclamation.operating_time = request.data['operating']
            reclamation.unit = RepairDirectory.objects.get(name=request.data['rl-unit'])
            reclamation.description = request.data['rl-description']
            reclamation.repair_method = RepairDirectory.objects.get(name=request.data['recovery'])
            reclamation.spare_parts = request.data['rl-parts']
            reclamation.recovery_date = request.data['recovery-date']
            reclamation.downtime = request.data['downtime']
            reclamation.machine = Machine.objects.get(factory_number=request.data['machine'])
            reclamation.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
            reclamation.save()
            return Response({'id': reclamation.pk}, status=status.HTTP_201_CREATED)

    def patch(self, request, **kwargs):
        if not kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            reclamation = Reclamation.objects.get(kwargs['id'])
            reclamation.rejection_date = request.data['rl-date']
            reclamation.operating_time = request.data['operating']
            reclamation.unit = RepairDirectory.objects.get(name=request.data['rl-unit'])
            reclamation.description = request.data['rl-description']
            reclamation.repair_method = RepairDirectory.objects.get(name=request.data['recovery'])
            reclamation.spare_parts = request.data['rl-parts']
            reclamation.recovery_date = request.data['recovery-date']
            reclamation.downtime = request.data['downtime']
            reclamation.machine = Machine.objects.get(factory_number=request.data['machine'])
            reclamation.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
            reclamation.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, **kwargs):
        if not kwargs:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            reclamation = Reclamation.objects.get(pk=kwargs['id'])
            reclamation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class DirectoryListAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs['instance'] == 'units':
            items = MachineDirectory.objects.all()
            data = MachineDirectorySerializer(items, many=True).data
            return Response(data)
        elif kwargs['instance'] == 'repairs':
            items = RepairDirectory.objects.all()
            data = RepairDirectorySerializer(items, many=True).data
            return Response(data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
