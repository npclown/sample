# Generated by Django 5.0 on 2024-02-27 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0008_alter_award_options_alter_bounty_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='skill',
            name='deleted_at',
            field=models.DateTimeField(default=None, null=True),
        ),
    ]
