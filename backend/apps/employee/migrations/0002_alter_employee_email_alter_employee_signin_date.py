# Generated by Django 4.0 on 2023-02-08 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='email',
            field=models.EmailField(blank=True, max_length=60, null=True, verbose_name='employee email address'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='signin_date',
            field=models.DateField(blank=True, null=True, verbose_name='employee signed in date'),
        ),
    ]
