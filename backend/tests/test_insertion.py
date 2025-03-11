import os
import django
from django.test import TestCase
from backend.utils import db_insertion, fetch
from backend.models import * 

# Set up Django environment for standalone scripts (not needed in actual Django tests)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

class TestInsertion(TestCase):
    def setUp(self):
        """ Set up test environment, like creating a test database """
        # You might need to create objects in your test DB if required

    def test_insertion(self):
        """ Test inserting records into the database """
        list_of_records = fetch.fetch_entire_year("2024", "ITI", "3")
        
        # Get Django’s ORM session (Django handles transactions automatically)
        from django.db import connection
        with connection.cursor() as session:
            db_insertion.insert_list_record(session, list_of_records)
        
        # Check if data was inserted properly
        self.assertTrue(InsaClass.objects.exists())

if __name__ == "__main__":
    import pytest
    pytest.main()
