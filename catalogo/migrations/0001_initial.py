# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-30 21:30
from __future__ import unicode_literals

import catalogo.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120)),
                ('full_name', models.CharField(db_index=True, editable=False, max_length=255)),
                ('seccion', models.CharField(blank=True, choices=[(b'genero', b'Genero'), (b'categoria', b'Categoria'), (b'estilo', b'Estilo')], max_length=100, null=True)),
                ('slug', models.SlugField(editable=False, max_length=120, unique=True)),
                ('titulo_seo', models.CharField(blank=True, max_length=100, null=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('activo', models.BooleanField(default=True)),
                ('imagen', models.ImageField(blank=True, max_length=250, null=True, upload_to=b'categorias')),
                ('padre', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='catalogo.Categoria')),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(blank=True, max_length=120, null=True)),
                ('full_name', models.CharField(blank=True, editable=False, max_length=120, null=True, unique=True)),
                ('slug', models.CharField(editable=False, max_length=120, unique=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('creado', models.DateTimeField(auto_now_add=True)),
                ('actualizado', models.DateTimeField(auto_now=True)),
                ('video', models.CharField(blank=True, max_length=120, null=True)),
                ('categorias', models.ManyToManyField(blank=True, related_name='categorias_producto', to='catalogo.Categoria')),
            ],
        ),
        migrations.CreateModel(
            name='ProductoImagen',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('foto', models.ImageField(upload_to=catalogo.models.url_imagen_pr)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('creado', models.DateTimeField(auto_now_add=True)),
                ('actualizado', models.DateTimeField(auto_now=True)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='imagenes_producto', to='catalogo.Producto')),
            ],
            options={
                'ordering': ['orden'],
            },
        ),
        migrations.CreateModel(
            name='ProductoVariacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('precio', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('stock', models.PositiveIntegerField(default=0)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variaciones', to='catalogo.Producto')),
            ],
        ),
        migrations.CreateModel(
            name='Variacion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(blank=True, max_length=100)),
                ('grupo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='catalogo.Variacion')),
            ],
        ),
        migrations.AddField(
            model_name='productovariacion',
            name='variacion',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='catalogo.Variacion'),
        ),
    ]
