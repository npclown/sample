# Generated by Django 5.0 on 2024-02-09 04:27

import tsid_pk.fields
import tsid_pk.utils
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('points', '0002_pointhistory_content_type_pointhistory_object_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pointhistory',
            name='id',
            field=tsid_pk.fields.TSIDField(db_index=True, default=tsid_pk.utils.generate_tsid, max_length=13, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='pointhistory',
            name='object_id',
            field=tsid_pk.fields.TSIDField(db_index=True, default=tsid_pk.utils.generate_tsid, max_length=13, null=True),
        ),
    ]
