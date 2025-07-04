# Generated by Django 5.2.1 on 2025-06-15 04:26

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("auctions", "0015_rename_comments_comments_comment"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="auctionlisting",
            name="current_bid",
        ),
        migrations.CreateModel(
            name="Bid",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "bid",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
                ),
                (
                    "listing",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="bids",
                        to="auctions.auctionlisting",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="bids_placed",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
