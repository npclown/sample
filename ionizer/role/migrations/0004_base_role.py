# Generated by Django 5.0 on 2024-01-23 10:57

from django.db import migrations


def create_base_role(apps, schema_editor):
    Role = apps.get_model("role", "Role")
    Role.objects.filter(id=1).update(id="0000000000000")


def create_base_role_reverse(apps, schema_editor):
    Role = apps.get_model("role", "Role")
    Role.objects.filter(id="0000000000000").update(id=1)


class Migration(migrations.Migration):
    dependencies = [
        ("role", "0003_alter_permission_id_alter_permission_object_id_and_more"),
    ]

    operations = [
        migrations.RunPython(create_base_role, create_base_role_reverse),
    ]
