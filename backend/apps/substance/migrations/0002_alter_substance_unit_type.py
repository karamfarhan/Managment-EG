# Generated by Django 4.0 on 2023-03-02 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("substance", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="substance",
            name="unit_type",
            field=models.CharField(
                choices=[
                    ("KG", "كيلوجرام"),
                    ("L", "لتر"),
                    ("T", "طن"),
                    ("M", "متر طولي"),
                    ("M_2", "متر مربع"),
                    ("M_3", "متر مكعب"),
                    ("DHAN", "دهان"),
                    ("SH_20", "شكارة 20"),
                    ("SH_25", "شكارة 25"),
                    ("SH_50", "شكارة 50"),
                    ("SH_M", "شكارة معجون"),
                    ("PEASE", "قطعة"),
                ],
                max_length=20,
                verbose_name="Unit Type",
            ),
        ),
    ]