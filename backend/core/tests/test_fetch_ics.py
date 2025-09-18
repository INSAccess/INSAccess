import os
import json
import itertools
from datetime import datetime
from unittest.mock import patch
from icalendar import Calendar, Event
from django.test import TestCase
from core.utils.fetch_ics import (
    ics_to_list,
    description_parsing,
    fetch_department,
    get_academic_year,
)

# Load the CONFIG file from the specified path
CONFIG_PATH = os.path.join(
    os.path.dirname((os.path.dirname(os.path.dirname(__file__)))),
    "config/insa_config.json",
)


def load_config():
    """Loads the configuration file from the project config folder."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


CONFIG = load_config()
DEPARTMENTS = set(
    list(
        map(
            "".join,
            itertools.product(
                CONFIG["department_list"], CONFIG["years_for_department"]
            ),
        )
    )
    + list(
        map("".join, itertools.product(CONFIG["prepa_name"], CONFIG["years_for_prepa"]))
    )
)


class ICSFetcherTests(TestCase):
    @patch("core.utils.fetch_ics.requests.get")
    def test_ics_to_list_parses_events_correctly(self, mock_get):
        # Build a fake ICS event
        event = Event()
        event.add("SUMMARY", "Algebra")
        event.add("UID", "event-uid-1")
        event.add("DTSTAMP", datetime(2024, 5, 12, 12, 0))
        event.add("DTSTART", datetime(2024, 5, 13, 10, 0))
        event.add("DTEND", datetime(2024, 5, 13, 12, 0))
        event.add("CREATED", datetime(2024, 5, 1, 9, 0))
        event.add("LAST-MODIFIED", datetime(2024, 5, 10, 9, 0))
        event.add("SEQUENCE", 1)
        event.add("LOCATION", "B202,A303")
        event.add("DESCRIPTION", "John Doe\nEP3\nTD1")

        # Create a Calendar object and add the event
        cal = Calendar()
        cal.add_component(event)

        # Mock HTTP response
        mock_get.return_value.status_code = 200
        mock_get.return_value.content = cal.to_ical()

        # Call the function to test
        events = ics_to_list("http://fake-url.com")

        # Assert that the event list is parsed correctly
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["desc"], "Algebra")
        self.assertIn("John Doe", events[0]["teachers"])
        self.assertIn("EP3", events[0]["departments"])
        self.assertIn("TD1", events[0]["td_tags"])
        self.assertEqual(events[0]["uid"], "event-uid-1")
        self.assertIn("A303", events[0]["locations"])

    def test_description_parsing_splits_fields_correctly(self):
        desc = "John Doe\nMECA2\nTD3\n2025\n(Année scolaire)"

        # Mock the necessary CONFIG and DEPARTMENTS
        with (
            patch(
                "core.utils.fetch_ics.CONFIG",
                {"misc_item_in_description": ["Année scolaire"]},
            ),
            patch("core.utils.fetch_ics.DEPARTMENTS", {"MECA2"}),
        ):
            teachers, departments, td_tags = description_parsing(desc)

        # Check if parsing works as expected
        self.assertIn("John Doe", teachers)
        self.assertIn("MECA2", departments)
        self.assertIn("TD3", td_tags)

    @patch(
        "core.utils.fetch_ics.CONFIG",
        {
            "ics_url_prefix": "http://dummy.url/",
            "department_list": ["EP"],
            "years_for_department": ["1"],
            "prepa_name": "PC",
            "years_for_prepa": ["1", "2"],
        },
    )
    @patch("core.utils.fetch_ics.ics_to_list")
    def test_fetch_department_calls_ics_to_list(self, mock_ics):
        # Mocking the return value of ics_to_list
        mock_ics.return_value = [{"desc": "Fake"}]

        # Call the function to test
        result = fetch_department("EP", "1")

        # Assert the expected result
        self.assertEqual(result[0]["desc"], "Fake")

    def test_get_academic_year_logic(self):
        # Mocking datetime to control the current date
        with patch("core.utils.fetch_ics.datetime.datetime") as mock_datetime:
            # Mock the return value for a date after August (2025)
            mock_datetime.now.return_value = datetime(2025, 9, 1)
            self.assertEqual(get_academic_year(), 2025)

            # Mock the return value for a date before September (2025)
            mock_datetime.now.return_value = datetime(2025, 6, 1)
            self.assertEqual(get_academic_year(), 2024)
