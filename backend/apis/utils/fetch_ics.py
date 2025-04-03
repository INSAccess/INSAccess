import requests, sys, os, json, itertools
from icalendar import Calendar

CONFIG_PATH = os.path.join(os.path.dirname((os.path.dirname(os.path.dirname(__file__)))),"config/insa_config.json")

def load_config():
    """Loads the configuration file from the project config folder."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

CONFIG = load_config()  
def ics_to_list(url : str) -> list:
    response = requests.get(url, timeout = 5)# corresponds to 5 sec

    if response.status_code == 200: #request is successful
    
        ical = Calendar.from_ical(response.content)
        list_of_events = []
        for event in ical.walk("VEVENT"):
            list_of_events.append((
                        event.get("DTSTAMP"),
                        event.get("DTSTART"),
                        event.get("DTEND"),
                        event.get("SUMMARY"),
                        event.get("LOCATION"),
                        event.get("DESCRIPTION"),
                        event.get("UID"),
                        event.get("CREATED"),
                        event.get("LAST-MODIFIED"),
                        event.get("SEQUENCE"),
            ))
        return list_of_events
    return []


def description_parsing(desc : str):

    elements = desc.split(r'\n')[2:-2]# remove empty elements and date of submission
    
    department_set = set(list(map(''.join, itertools.product(CONFIG["department_list"], CONFIG["years_for_department"]))) + 
                    list(map(''.join, itertools.product(CONFIG["prepa_name"], CONFIG["years_for_prepa"]))))
    teachers, departments, td_tags = [], [], []
    
    for e in elements:
        if len(e.split()) > 1:
            teachers.append(e)
        elif e in department_set:
            departments.append(e)
        else:
            td_tags.append(e)
    
    return teachers, departments, td_tags


def list_print(list : list):
    for e in list:
        print(e)





if __name__ == '__main__':
    desc = b'\\n\\nCGC32-FLE-TD-01\\nEP32-FLE-TD-01\\nGM32-FLE-TD-01\\nGPGR32-FLE-TD-01\\nITI32-FLE-TD-01\\nMECA32-FLE-TD-01\\nGAILLARD Laurent\\nCGC3\\nEP3\\nGM3\\nGPGR3\\nITI3\\nMECA3\\n(Export\xc3\xa9 le:03/04/2025 19:11)\\n'
    # list_of_events = ics_to_list(sys.argv[1])
    # print(list_of_events[0])
    for res in description_parsing(desc.decode('utf-8')):
        list_print(res)


