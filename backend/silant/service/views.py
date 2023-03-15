from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAPIView(APIView):
    def get(self, request, **kwargs):
        user = User.objects.all()
        data = UserSerializer(user, many=True).data
        return Response(data)


class MachineAPIView(APIView):
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
            machines = Machine.objects.all()
            maintenance = Maintenance.objects.all()
            reclamation = Reclamation.objects.all()
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
            machines = Machine.objects.filter(service_company=profile)
            maintenance = Maintenance.objects.filter(service_company=profile)
            reclamation = Reclamation.objects.filter(service_company=profile)
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
            machines = Machine.objects.filter(client=profile)
            if not machines.exists():
                return Response({
                    'machines': None,
                    'maintenance': None,
                    'reclamation': None,
                })
            maintenance = []
            reclamation = []
            for i in machines:
                maintenance.extend(Maintenance.objects.filter(machine=i))
                reclamation.extend(Reclamation.objects.filter(machine=i))
            machine_data = MachineLoggedUserSerializer(machines, many=True).data
            maintenance_data = MaintenanceSerializer(maintenance, many=True).data
            reclamation_data = ReclamationSerializer(reclamation, many=True).data
            return Response({
                'machines': machine_data,
                'maintenance': maintenance_data,
                'reclamation': reclamation_data,
            })

