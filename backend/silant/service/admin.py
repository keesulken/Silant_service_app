from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(Machine)
admin.site.register(Maintenance)
admin.site.register(Reclamation)
admin.site.register(MachineDirectory)
admin.site.register(RepairDirectory)
admin.site.register(ClientProfile)
admin.site.register(ServiceCompanyProfile)
