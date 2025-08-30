import requests, sys, os, json, itertools, logging
from datetime import datetime
from icalendar import Calendar

CONFIG_PATH = os.path.join(os.path.dirname((os.path.dirname(os.path.dirname(__file__)))),"config/insa_config.json")
def load_config():
    """Loads the configuration file from the project config folder."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


CONFIG = load_config()
DEPARTMENTS = set(list(map(''.join, itertools.product(CONFIG["department_list"], CONFIG["years_for_department"]))) +
                    list(map(''.join, itertools.product(CONFIG["prepa_name"], CONFIG["years_for_prepa"]))))

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def ics_to_list(url : str) -> list:
    """
    Returns a list of dictionnary of each event
    present in the ics file of the given url
    """

    response = requests.get(url, timeout = 5)# in sec
    logger.info(f"reponse trying to get ics : {response.status_code}")
    if response.status_code == 200: #request is successful

        ical = Calendar.from_ical(response.content)
        list_of_events = []
        for event in ical.walk("VEVENT"):
            teachers, departments, td_tags = description_parsing(str(event.get("DESCRIPTION")))
            list_of_events.append({
                        "time_stamp" : event.get("DTSTAMP").dt,#.dt converts vdd to datetime
                        "time_start" : event.get("DTSTART").dt,
                        "time_end" : event.get("DTEND").dt,
                        "desc" : event.get("SUMMARY"),
                        "locations" :list(filter(lambda e: e != '', str(event.get("LOCATION")).split(','))),
                        "teachers" : teachers,
                        "departments" : departments,
                        "td_tags" : td_tags,
                        "uid" : event.get("UID"),
                        "date" : event.get("DTSTART").dt.date(),
                        "time_created" : event.get("CREATED").dt,
                        "time_last_modified" : event.get("LAST-MODIFIED").dt,
                        "sequence" : event.get("SEQUENCE")
            })
        return list_of_events
    return []

def description_parsing(desc : str):
    """parse the given description into 3 subsets :
    the teachers names, the departments names and
    the td_tags"""
    elements = [e for e in desc.split('\n') if e and not (e.startswith('(') or e.isdigit() or e in CONFIG["misc_item_in_description"])]# remove empty elements and date of submission
    teachers, departments, td_tags = [], [], []

    for e in elements:
        if len(e.split()) > 1:
            teachers.append(e)
        elif e in DEPARTMENTS:
            departments.append(e)
        else:
            td_tags.append(e)

    return teachers, departments, td_tags

def fetch_department(department : str, depart_year : str) -> list:
    """returns an array of dict of the components of each event,
    take the department name ("EP","ITI","MECA"...)
    and the department_year ("1","2","3","4","5"...)"""
    if department in CONFIG["department_list"] and depart_year in CONFIG["years_for_department"] or \
        department == CONFIG["prepa_name"] and depart_year in CONFIG["years_for_prepa"]:
        return ics_to_list(f"{CONFIG['ics_url_prefix']}{get_academic_year()}-{department}{depart_year}")

def get_academic_year():
    """returns the current academic year
    for instance if the academic years are 2024-2025 then it returns
    2024"""
    current_date = datetime.now()
    if current_date.month > 7:# if the summer vacations are over
        return current_date.year
    return current_date.year -1

if __name__ == '__main__':
    events = fetch_department(sys.argv[1], sys.argv[2])
    for e in events:
        print(e["locations"])
    # print(events)