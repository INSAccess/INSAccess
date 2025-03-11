from django.test import TestCase
from backend.utils import db_insertion, fetch

class TestInsertion(TestCase):

    def test_insertion(self):
        """ Test inserting records into the database """
        list_of_records = fetch.fetch_entire_year("2024", "ITI", "3")
        db_insertion.insert_list_record(list_of_records)
