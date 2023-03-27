from django.core.exceptions import ObjectDoesNotExist
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from .models import *
from .serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAPIView(APIView):
    def get(self, request, **kwargs):
        if request.user.is_superuser:
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, **kwargs):
        if request.user.is_superuser:
            if kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                user = User()
                user.username = request.data['username']
                user.set_password(request.data['password'])
                for i in USER_TYPES:
                    if i[1] == request.data['user-type']:
                        user.type = i[0]
                if request.data.__contains__('admin-cb'):
                    user.is_superuser = True
                user.save()
                if user.type == 'MNU':
                    client = ClientProfile()
                    client.user = user
                    client.name = request.data['prof-name']
                    client.description = request.data['description']
                    client.save()
                    return Response({'id': client.pk}, status=status.HTTP_201_CREATED)
                elif user.type == 'SVC':
                    company = ServiceCompanyProfile()
                    company.user = user
                    company.name = request.data['prof-name']
                    company.description = request.data['description']
                    company.save()
                    return Response({'id': company.pk}, status=status.HTTP_201_CREATED)
                else:
                    return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, **kwargs):
        if request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                user = User.objects.get(pk=kwargs['id'])
                current_type = user.get_type_display()
                user.username = request.data['username']
                for i in USER_TYPES:
                    if i[1] == request.data['user-type']:
                        user.type = i[0]
                        break
                if request.data.__contains__('admin-cb'):
                    user.is_superuser = True
                else:
                    user.is_superuser = False
                if current_type == request.data['user-type']:
                    user.save()
                    if user.cl_profile.exists():
                        profile = user.cl_profile.first()
                        profile.name = request.data['prof-name']
                        profile.description = request.data['description']
                        profile.save()
                    elif user.sc_profile.exists():
                        profile = user.sc_profile.first()
                        profile.name = request.data['prof-name']
                        profile.description = request.data['description']
                        profile.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    try:
                        if user.cl_profile.exists():
                            user.cl_profile.first().delete()
                        elif user.sc_profile.exists():
                            user.sc_profile.first().delete()
                        if user.type == 'MFR':
                            user.save()
                        elif user.type == 'SVC':
                            user.save()
                            profile = ServiceCompanyProfile()
                            profile.user = user
                            profile.name = request.data['prof-name']
                            profile.description = request.data['description']
                            profile.save()
                        else:
                            user.save()
                            profile = ClientProfile()
                            profile.user = user
                            profile.name = request.data['prof-name']
                            profile.description = request.data['description']
                            profile.save()
                        return Response(status=status.HTTP_204_NO_CONTENT)
                    except ProtectedError:
                        return Response(
                            {'error': 'protected objects'},
                            status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs):
        if request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                user = User.objects.get(pk=kwargs['id'])
                try:
                    user.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ProtectedError:
                    return Response({'error': 'protected object'}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class MachineAPIView(APIView):
    def get(self, request, **kwargs):
        if request.user.is_authenticated:
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
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
                if request.data['client'] != '-----':
                    machine.client = ClientProfile.objects.get(name=request.data['client'])
                if request.data['company'] != '-----':
                    machine.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
                machine.save()
                return Response({'id': machine.pk}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
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
                if request.data['client'] != '-----':
                    machine.client = ClientProfile.objects.get(name=request.data['client'])
                else:
                    machine.client = None
                if request.data['company'] != '-----':
                    machine.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
                else:
                    machine.service_company = None
                machine.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                machine = Machine.objects.get(pk=kwargs['id'])
                machine.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class MachineSearchAPIView(APIView):
    def get(self, request, **kwargs):
        if request.user.is_authenticated:
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, **kwargs):
        try:
            machine = Machine.objects.get(factory_number=request.data['num'])
            data = MachineAnonymousUserSerializer(machine).data
            print(data)
            return Response(data)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class PersonalPageAPIView(APIView):
    def get(self, request, **kwargs):
        user = request.user
        if user.type == 'MFR':
            machines = Machine.objects.all().order_by('-dispatch_date')
            maintenance = Maintenance.objects.all().order_by('-date')
            reclamation = Reclamation.objects.all().order_by('-rejection_date')
            units = MachineDirectory.objects.all()
            repairs = RepairDirectory.objects.all()
            companies = ServiceCompanyProfile.objects.all()
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            unit_data = MachineDirectoryFormSerializer(units, many=True).data
            repair_data = RepairDirectoryFormSerializer(repairs, many=True).data
            company_data = ServiceCompanyProfileTableSerializer(companies, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
                'units': unit_data,
                'repairs': repair_data,
                'companies': company_data,
            })
        elif user.type == 'SVC':
            profile = ServiceCompanyProfile.objects.get(user=user)
            machines = Machine.objects.filter(service_company=profile).order_by('-dispatch_date')
            maintenance = Maintenance.objects.filter(service_company=profile).order_by('-date')
            reclamation = Reclamation.objects.filter(service_company=profile).order_by('-rejection_date')
            units = MachineDirectory.objects.all()
            repairs = RepairDirectory.objects.all()
            companies = ServiceCompanyProfile.objects.all()
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            unit_data = MachineDirectoryFormSerializer(units, many=True).data
            repair_data = RepairDirectoryFormSerializer(repairs, many=True).data
            company_data = ServiceCompanyProfileTableSerializer(companies, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
                'units': unit_data,
                'repairs': repair_data,
                'companies': company_data,
            })
        elif user.type == 'MNU':
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
            units = MachineDirectory.objects.all()
            repairs = RepairDirectory.objects.all()
            companies = ServiceCompanyProfile.objects.all()
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            unit_data = MachineDirectoryFormSerializer(units, many=True).data
            repair_data = RepairDirectoryFormSerializer(repairs, many=True).data
            company_data = ServiceCompanyProfileTableSerializer(companies, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
                'units': unit_data,
                'repairs': repair_data,
                'companies': company_data,
            })
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


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
            items = MachineDirectory.objects.all().order_by('type')
            data = MachineDirectoryFormSerializer(items, many=True).data
            return Response(data)

    def post(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                unit = MachineDirectory()
                for i in MACHINE_DIRECTORY_CHOICES:
                    if i[1] == request.data['unit']:
                        unit.type = i[0]
                        break
                unit.name = request.data['name']
                unit.description = request.data['description']
                unit.save()
                return Response({'id': unit.pk}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                unit = MachineDirectory.objects.get(pk=kwargs['id'])
                for i in MACHINE_DIRECTORY_CHOICES:
                    if i[1] == request.data['type']:
                        unit.type = i[0]
                        break
                unit.name = request.data['name']
                unit.description = request.data['description']
                unit.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                try:
                    unit = MachineDirectory.objects.get(pk=kwargs['id'])
                    unit.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ProtectedError:
                    return Response({'error': 'protected object'}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


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
            items = RepairDirectory.objects.all().order_by('type')
            data = RepairDirectoryFormSerializer(items, many=True).data
            return Response(data)

    def post(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                repair = RepairDirectory()
                for i in REPAIR_DIRECTORY_CHOICES:
                    if i[1] == request.data['repair']:
                        repair.type = i[0]
                        break
                repair.name = request.data['name']
                repair.description = request.data['description']
                repair.save()
                return Response({'id': repair.pk}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                repair = RepairDirectory.objects.get(pk=kwargs['id'])
                for i in REPAIR_DIRECTORY_CHOICES:
                    if i[1] == request.data['type']:
                        repair.type = i[0]
                        break
                repair.name = request.data['name']
                repair.description = request.data['description']
                repair.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                try:
                    repair = RepairDirectory.objects.get(pk=kwargs['id'])
                    repair.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ProtectedError:
                    return Response({'error': 'protected object'}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


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

    def patch(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                client = ClientProfile.objects.get(pk=kwargs['id'])
                client.name = request.data['name']
                client.description = request.data['description']
                client.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


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

    def patch(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                company = ServiceCompanyProfile.objects.get(pk=kwargs['id'])
                company.name = request.data['name']
                company.description = request.data['description']
                company.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class MaintenanceAPIView(APIView):
    def get(self, request, **kwargs):
        if request.user.is_authenticated:
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, **kwargs):
        if request.user.is_authenticated:
            if kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                maintenance = Maintenance()
                maintenance.type = RepairDirectory.objects.get(name=request.data['mt-type'])
                maintenance.date = request.data['mt-date']
                maintenance.operating_time = request.data['mt-time']
                maintenance.work_order_number = request.data['work-order-num']
                maintenance.work_order_date = request.data['work-order-date']
                maintenance.maintenance_holder = RepairDirectory.objects.get(name=request.data['mt-holder'])
                maintenance.machine = Machine.objects.get(factory_number=request.data['machine'])
                maintenance.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
                maintenance.save()
                return Response({'id': maintenance.pk}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, **kwargs):
        if request.user.is_authenticated:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                try:
                    maintenance = Maintenance.objects.get(pk=kwargs['id'])
                    maintenance.type = RepairDirectory.objects.get(name=request.data['mt-type'])
                    maintenance.date = request.data['mt-date']
                    maintenance.operating_time = request.data['mt-time']
                    maintenance.work_order_number = request.data['work-order-num']
                    maintenance.work_order_date = request.data['work-order-date']
                    maintenance.maintenance_holder = RepairDirectory.objects.get(name=request.data['mt-holder'])
                    maintenance.machine = Machine.objects.get(factory_number=request.data['machine'])
                    maintenance.service_company = ServiceCompanyProfile.objects.get(name=request.data['company'])
                    maintenance.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ObjectDoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs):
        if request.user.is_authenticated:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                try:
                    maintenance = Maintenance.objects.get(pk=kwargs['id'])
                    maintenance.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                except ObjectDoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class ReclamationAPIView(APIView):
    def get(self, request, **kwargs):
        if request.user.is_authenticated:
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.type == 'SVC' or request.user.is_superuser:
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.type == 'SVC' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                reclamation = Reclamation.objects.get(pk=kwargs['id'])
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
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, **kwargs):
        if request.user.type == 'MFR' or request.user.type == 'SVC' or request.user.is_superuser:
            if not kwargs:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
            else:
                reclamation = Reclamation.objects.get(pk=kwargs['id'])
                reclamation.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class DirectoryListAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs['instance'] == 'units':
            items = MachineDirectory.objects.all().order_by('type')
            data = MachineDirectorySerializer(items, many=True).data
            return Response(data)
        elif kwargs['instance'] == 'repairs':
            items = RepairDirectory.objects.all().order_by('type')
            data = RepairDirectorySerializer(items, many=True).data
            return Response(data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


class PasswordAPIView(APIView):
    def post(self, request, **kwargs):
        if request.user.is_superuser:
            user = User.objects.get(pk=kwargs['id'])
            user.set_password(request.data['password'])
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class FilteredItemsAPIView(APIView):
    def get(self, request, **kwargs):
        if kwargs['instance'] == 'machine':
            if request.user.type == 'MFR':
                machines = Machine.objects.all().order_by('-dispatch_date')
            elif request.user.type == 'SVC':
                profile = ServiceCompanyProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(service_company=profile).order_by('-dispatch_date')
            elif request.user.type == 'MNU':
                profile = ClientProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(service_company=profile).order_by('-dispatch_date')
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            data = MachineLoggedUserSerializer(machines, many=True).data
            return Response(data)
        elif kwargs['instance'] == 'maintenance':
            if request.user.type == 'MFR':
                maintenances = Maintenance.objects.all().order_by('-date')
            elif request.user.type == 'SVC':
                profile = ServiceCompanyProfile.objects.filter(user=request.user).last()
                maintenances = Maintenance.objects.filter(service_company=profile).order_by('-date')
            elif request.user.type == 'MNU':
                profile = ClientProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(client=profile)
                maintenances = Maintenance.objects.filter(machine__in=machines).order_by('-date')
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            data = MaintenanceSerializer(maintenances, many=True).data
            return Response(data)
        elif kwargs['instance'] == 'reclamation':
            if request.user.type == 'MFR':
                reclamations = Reclamation.objects.all().order_by('-rejection_date')
            elif request.user.type == 'SVC':
                profile = ServiceCompanyProfile.objects.filter(user=request.user).last()
                reclamations = Reclamation.objects.filter(service_company=profile).order_by('-rejection_date')
            elif request.user.type == 'MNU':
                profile = ClientProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(client=profile)
                reclamations = Reclamation.objects.filter(machine__in=machines).order_by('-rejection_date')
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            data = ReclamationSerializer(reclamations, many=True).data
            return Response(data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, **kwargs):
        if kwargs['instance'] == 'machine':
            if request.user.type == 'MFR':
                machines = Machine.objects.all().order_by('-dispatch_date')
            elif request.user.type == 'SVC':
                profile = ServiceCompanyProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(service_company=profile).order_by('-dispatch_date')
            elif request.user.type == 'MNU':
                profile = ClientProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(service_company=profile).order_by('-dispatch_date')
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            if request.data.__contains__('mcn-filter'):
                filter_item = MachineDirectory.objects.get(name=request.data['mcn-filter'])
                machines = machines.filter(machine_model=filter_item)
            if request.data.__contains__('eng-filter'):
                filter_item = MachineDirectory.objects.get(name=request.data['eng-filter'])
                machines = machines.filter(engine_model=filter_item)
            if request.data.__contains__('trm-filter'):
                filter_item = MachineDirectory.objects.get(name=request.data['trm-filter'])
                machines = machines.filter(transmission_model=filter_item)
            if request.data.__contains__('dra-filter'):
                filter_item = MachineDirectory.objects.get(name=request.data['dra-filter'])
                machines = machines.filter(drive_axle_model=filter_item)
            if request.data.__contains__('sta-filter'):
                filter_item = MachineDirectory.objects.get(name=request.data['sta-filter'])
                machines = machines.filter(steered_axle_model=filter_item)
            data = MachineLoggedUserSerializer(machines, many=True).data
            return Response(data)
        elif kwargs['instance'] == 'maintenance':
            if request.user.type == 'MFR':
                maintenances = Maintenance.objects.all().order_by('-date')
            elif request.user.type == 'SVC':
                profile = ServiceCompanyProfile.objects.filter(user=request.user).last()
                maintenances = Maintenance.objects.filter(service_company=profile).order_by('-date')
            elif request.user.type == 'MNU':
                profile = ClientProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(client=profile)
                maintenances = Maintenance.objects.filter(machine__in=machines).order_by('-date')
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            if request.data.__contains__('mnt-filter'):
                filter_item = RepairDirectory.objects.get(name=request.data['mnt-filter'])
                maintenances = maintenances.filter(type=filter_item)
            if request.data.__contains__('mt-machine-filter'):
                filter_item = Machine.objects.get(factory_number=request.data['mt-machine-filter'])
                maintenances = maintenances.filter(machine=filter_item)
            if request.data.__contains__('mt-sc-filter'):
                filter_item = ServiceCompanyProfile.objects.get(name=request.data['mt-sc-filter'])
                maintenances = maintenances.filter(service_company=filter_item)
            data = MaintenanceSerializer(maintenances, many=True).data
            return Response(data)
        elif kwargs['instance'] == 'reclamation':
            if request.user.type == 'MFR':
                reclamations = Reclamation.objects.all().order_by('-rejection_date')
            elif request.user.type == 'SVC':
                profile = ServiceCompanyProfile.objects.filter(user=request.user).last()
                reclamations = Reclamation.objects.filter(service_company=profile).order_by('-rejection_date')
            elif request.user.type == 'MNU':
                profile = ClientProfile.objects.filter(user=request.user).last()
                machines = Machine.objects.filter(client=profile)
                reclamations = Reclamation.objects.filter(machine__in=machines).order_by('-rejection_date')
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
            if request.data.__contains__('unt-filter'):
                filter_item = RepairDirectory.objects.get(name=request.data['unt-filter'])
                reclamations = reclamations.filter(unit=filter_item)
            if request.data.__contains__('rpt-filter'):
                filter_item = RepairDirectory.objects.get(name=request.data['rpt-filter'])
                reclamations = reclamations.filter(repair_method=filter_item)
            if request.data.__contains__('recl-sc-filter'):
                filter_item = ServiceCompanyProfile.objects.get(name=request.data['recl-sc-filter'])
                reclamations = reclamations.filter(service_company=filter_item)
            data = ReclamationSerializer(reclamations, many=True).data
            return Response(data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
