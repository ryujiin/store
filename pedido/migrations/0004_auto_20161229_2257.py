# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-12-29 22:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pedido', '0003_auto_20161229_2255'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pedido',
            name='fecha_finalizado',
        ),
        migrations.AddField(
            model_name='pedido',
            name='fecha_final',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]