# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-12-29 22:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pedido', '0002_pedido_fecha_finalizado'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pedido',
            name='fecha_finalizado',
            field=models.DateTimeField(blank=True),
        ),
    ]
