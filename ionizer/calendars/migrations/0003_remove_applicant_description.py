# Generated by Django 5.0 on 2024-02-02 14:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0002_recruit_status_applicant'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='applicant',
            name='description',
        ),
    ]
