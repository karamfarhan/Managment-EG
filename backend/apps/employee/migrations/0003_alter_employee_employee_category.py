# Generated by Django 4.0 on 2023-02-23 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0002_employee_employee_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='employee_category',
            field=models.CharField(choices=[('مهندس', 'مهندس'), ('سائق', 'سائق')], default='No category Selected', max_length=20, verbose_name='employee category'),
        ),
    ]