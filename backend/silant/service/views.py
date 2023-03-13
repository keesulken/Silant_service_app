from django.shortcuts import render, redirect
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

