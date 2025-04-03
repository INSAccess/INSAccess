import requests, sys, os, json, itertools
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

def ics_to_list(url : str) -> list:
    response = requests.get(url, timeout = 5)# in sec

    if response.status_code == 200: #request is successful
    
        ical = Calendar.from_ical(response.content)
        list_of_events = []
        for event in ical.walk("VEVENT"):
            teachers, departments, td_tags = description_parsing(str(event.get("DESCRIPTION")))
            list_of_events.append({
                        "time_stamp" : event.get("DTSTAMP").dt,
                        "time_start" : event.get("DTSTART").dt,
                        "time_end" : event.get("DTEND").dt,
                        "name" : event.get("SUMMARY"),
                        "location" : event.get("LOCATION"),
                        "teachers" : teachers,
                        "departments" : departments,
                        "td_tags" : td_tags,
                        "uid" : event.get("UID"),
                        "time_created" : event.get("CREATED").dt,
                        "time_last_modified" : event.get("LAST-MODIFIED").dt,
                        "sequence" : event.get("SEQUENCE")
            })
        return list_of_events
    return []


def description_parsing(desc : str):
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


def list_print(list : list):
    for e in list:
        print(e)

def dict_print(dict :dict):
    for k,v in dict.items():
        print(f"{k} : {v}")

def fetch_department(department : str, year : str) -> list:
    if department in CONFIG["department_list"] and year in CONFIG["years_for_department"] or \
        department == CONFIG["prepa_name"] and year in CONFIG["years_for_prepa"]:
        return ics_to_list(f"{CONFIG['ics_url_prefix']}{get_academic_year()}-{department}{year}")


def get_academic_year():
    """returns the current academic year 
    for instance if the academic years are 2024-2025 then it returns
    2024"""
    current_date = datetime.now()
    if current_date.month > 8:# if the summer vacations are over
        return current_date.year
    return current_date.year -1
    

if __name__ == '__main__':
    events = fetch_department(sys.argv[1], sys.argv[2])
    set = set()
    for e in events:
         set.update(e.get("td_tags"))
    print(set)