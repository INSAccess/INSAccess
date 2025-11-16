from django.core.management.base import BaseCommand
from django.db import transaction, connection
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

    def get_next_id(self, table_name):
        """
        Safely fetch the next auto-increment value from PostgreSQL.
        This avoids any collisions.
        """
        with connection.cursor() as cursor:
            cursor.execute(
                f"SELECT nextval(pg_get_serial_sequence('{table_name}', 'id'));"
            )
            return cursor.fetchone()[0]

    @transaction.atomic
    def populate_model_ids(self, model):
        table = model._meta.db_table

        objects = model.objects.filter(id__isnull=True)
        count = objects.count()

        if count == 0:
            self.stdout.write(f"{model.__name__}: OK (no missing IDs)")
            return

        self.stdout.write(f"{model.__name__}: Populating {count} missing IDs…")

        for obj in objects:
            next_id = self.get_next_id(table)
            obj.id = next_id
            obj.save(update_fields=["id"])

        self.stdout.write(self.style.SUCCESS(f"{model.__name__}: Done"))
