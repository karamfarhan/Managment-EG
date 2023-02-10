from django.contrib import admin

from .models import Employee, EmployeeActivity, Insurance

# Register your models here.
admin.site.register(Employee)
admin.site.register(Insurance)
admin.site.register(EmployeeActivity)
