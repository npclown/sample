# Generated by Django 5.0 on 2024-02-13 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0003_alter_award_id_alter_bounty_id_alter_challenge_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='experience',
            name='type',
            field=models.CharField(default='work', max_length=8),
            preserve_default=False,
        ),
    ]