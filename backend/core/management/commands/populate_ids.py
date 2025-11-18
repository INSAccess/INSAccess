from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Max
from core.models import (
    EnumType, EnumSector, EnumLanguage, EnumColorTheme,
    Association, GroupTD, Department, Teacher, Room, Title
)

class Command(BaseCommand):
    help = "Populate newly-added id fields for models that previously used `name` as primary key."

    MODELS = [
        EnumType,
        EnumSector,
        EnumLanguage,
        EnumColorTheme,
        Association,
        GroupTD,
        Department,
        Teacher,
        Room,
        Title,
    ]

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting ID population…"))

        for model in self.MODELS:
            self.populate_model_ids(model)

        self.stdout.write(self.style.SUCCESS("All missing IDs populated successfully."))

    @transaction.atomic
    def populate_model_ids(self, model):
        objects = model.objects.filter(id__isnull=True) 
        count = objects.count()

        if count == 0:
            self.stdout.write(f"{model.__name__}: OK (no missing IDs)")
            return

        max_id = model.objects.aggregate(max_id=Max('id'))['max_id'] or 0
        self.stdout.write(f"{model.__name__}: Populating {count} missing IDs…")

        for obj in objects:
            max_id += 1
            obj.id = max_id
            obj.save() 

        self.stdout.write(self.style.SUCCESS(f"{model.__name__}: Done"))