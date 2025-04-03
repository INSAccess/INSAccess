from django.test import TestCase
from apis.utils import db_insertion
from apis.models import InsaClass
from backend.apis.utils import fetch_rss

class TestInsertion(TestCase):

    def test_insertion(self):
        """ Test inserting records into the database """
        list_of_records = fetch_rss.get_calendar_data("2024", "ITI", "3", "2025-03-13","day")
        db_insertion.insert_list_record(list_of_records)
        assert InsaClass.objects.exists()
