# Generated by Django 5.0 on 2024-01-25 22:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('emailuser', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'ordering': ['id']},
        ),
    ]