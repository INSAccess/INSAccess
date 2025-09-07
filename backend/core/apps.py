from django.apps import AppConfig
import os


class AppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        if os.environ.get("RUN_MAIN") == "true":
            from . import scheduler

            scheduler.start()
