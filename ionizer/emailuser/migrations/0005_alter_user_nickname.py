# Generated by Django 5.0 on 2024-02-16 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emailuser', '0004_user_is_email_verified'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nickname',
            field=models.CharField(max_length=12),
        ),
    ]