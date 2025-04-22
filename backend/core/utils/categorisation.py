import re, os, json

CONFIG_PATH = os.path.join(os.path.dirname((os.path.dirname(os.path.dirname(__file__)))),"config/insa_config.json")

def load_config():
    """Loads the configuration file from the project config folder."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

CONFIG = load_config()

def categorise(description):
    departements = re.findall("("+"|".join(CONFIG["department_list"])+")+", description)
    if len(departements) > 0 : 
        departement = departements[0]
    else:
        departement = "unspecified"
    year_and_semester = re.findall(r'[0-9]{2}', description)
    if (len(year_and_semester) > 0):
        year = year_and_semester[0][0]
        semester = year_and_semester[0][1]
    else :
        year = "unspecified"
        semester = "unspecified"

    return {"description" : description, "departement":departement, "year":year, "semester":semester}