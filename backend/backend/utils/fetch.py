"""
Module Name: fetch.py

Description:
    The script for fetching and parsing the raw
    data from the calendar of insa rouen.

Author:
    Raphael Senellart

Date Created:
    January 15, 2025

Version:
    1.0.0

License:
    No License

Usage:
    Can be ran using :
    python3 fetch.py current_year department depart_year date period
    or if you want to fetch the entire year :
    python3 fetch.py year_of_start department depart_year

Dependencies:


Notes:
    This tool is specialized for the agenda.insa-rouen.fr
    website, but some methods are generic and can be implemented
    else where.

"""


from xml.etree import ElementTree
import sys, os, re, html, itertools, \
    requests, calendar, logging, json

from datetime import datetime, timedelta


CONFIG_PATH = os.path.join(os.path.dirname((os.path.dirname(os.path.dirname(__file__)))),"config/insa_config.json")

def load_config():
    """Loads the configuration file from the project config folder."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

CONFIG = load_config()  

def xml_to_list(url : str) -> list:
    """
    Parses an INSA Rouen agenda URL and extracts useful schedule components.

    This function takes a URL from the INSA Rouen agenda (agenda.insa-rouen.fr),
    fetches the schedule data, and extracts relevant details into a structured format.

    Parameters:
        url (str): The URL of the agenda to fetch and parse.

    Returns:
       list of tuples: A list where each tuple represents an event with the following fields:
            - uid (str): Unique identifier of the event.
            - date (str): Date of the event in 'YYYY-MM-DD' format.
            - start_hour (str): Start time of the event (e.g., 'HH:MM').
            - end_hour (str): End time of the event (e.g., 'HH:MM').
            - title (str): Title or subject of the event.
            - locations (list of str): List of locations where the event takes place.
            - teacher_list (list of str): List of teachers associated with the event.
            - group_td (list of str): List of TD (tutorial) groups attending.
            - group_depart (list of str): List of department groups attending.
    """

    response = requests.get(url, timeout = 5)

    if response.status_code == 200: #request is successful
        response.encoding = 'utf-8'
        xml_data = get_clean_xml(response.text)

        try:
            root = ElementTree.fromstring(xml_data)
        except ElementTree.ParseError as err:
            logging.error(f"XML parsing error: {err}")
            return []


        # namespaces = {k: v for k, v in root.attrib.items() if k.startswith("xmlns")}
        namespaces = {"ev" : "http://purl.org/rss/1.0/modules/event/"}
        
        output = []

        for item in root.findall("./channel/item"):
            uid = item_to_string(item.find("guid", namespaces))
            title = item_to_string(item.find("title", namespaces))
            date, start_hour = item_to_string(item.find("ev:startdate", namespaces)).split('T')
            _, end_hour = item_to_string(item.find("ev:enddate", namespaces)).split('T')
            description = item_to_string(item.find("description", namespaces))
            locations = item_to_string(item.find("ev:location", namespaces)).split('%2C')

            uid = extract_uid(uid)
            title = clean_title(title)


            group_td, teacher_list, group_depart =  parse_description(description)

            output.append((uid, date, start_hour, end_hour, title, locations,\
                            teacher_list, group_td, group_depart))

        return output

    logging.error(f"Failed to fetch XML data. HTTP Status Code: {response.status_code}")
    
    return []


def get_calendar_data(current_year :str, department : str ,\
                       depart_year : str, date : str, period :str) -> list :
    """
    Fetches and processes calendar data from INSA for a given school year, department, and period.

    This function retrieves schedule information for a specified department, year, 
    and time period from the INSA calendar system.

    Parameters:
        current_year (str): The current academic year (e.g., "2024" for the 2024-2025 school year).
        department (str): The department code (e.g., "CGC", "EP", "GCU", "GM", "GPGR", 
                        "ITI", "MECA", "PERF-E", "PERF-II", "PERF-ISP", "PERF-NI", etc.).
        depart_year (str): The year in the department (e.g., "ITI3" for the third year in ITI).
        date (str): The specific date to fetch data for. If fetching data for a week or month, 
                    provide a date within that period.
        period (str): The period to fetch data for (e.g., "day", "week", "month").

    Returns:
        list of tuples: A list where each tuple represents an event with the following structure:
            - uid (str): Unique identifier of the event.
            - date (str): Date of the event in 'YYYY-MM-DD' format.
            - start_hour (str): Start time of the event (e.g., 'HH:MM').
            - end_hour (str): End time of the event (e.g., 'HH:MM').
            - title (str): Title or subject of the event.
            - locations (list of str): List of locations where the event takes place.
            - teacher_list (list of str): List of teachers associated with the event.
            - group_td (list of str): List of TD (tutorial) groups attending.
            - group_depart (list of str): List of department groups attending.
    """
    
    depart_list = CONFIG["department_list"]
    depart_years = CONFIG["years_for_department"]
    prepa_name = CONFIG["prepa_name"]
    prepa_years = CONFIG["years_for_prepa"]
    list_of_period = CONFIG["periods_list"]
    

    if period in list_of_period:
        if (department in depart_list and depart_year in depart_years)\
            or (department == prepa_name and depart_year in prepa_years):
            
            url = ''.join(["http://agendas.insa-rouen.fr/rss/rss2.0.php?cal=", current_year, "-",
                        department, depart_year, "&cpath=&rssview=", period, "&getdate=", date])

            return xml_to_list(url)
        
        logging.error(f"Wrong department or depart_year given, got {department} and {depart_year}, expected\
            {depart_list} or {prepa_name} and {depart_years} or {prepa_years}")
        
    logging.error(f"Wrong period was given, expected one of those :{list_of_period} but got {period}")

    return []


def extract_uid(uid):
    """ extract the uid from url"""
    return re.findall(r'.*uid=(.*)', uid)[0]

def clean_title(title):
    """ parse the title of the fetched xml"""
    class_name = title.split(': ')[1]
    class_name = class_name.replace('-', ' ')
    return class_name


def parse_description(description):
    """I am fully aware that this part of the code isnt great because it is fitted
    for very specific type of data but couldnt do better
    because of the specific XML structure of Insa"""

    #pre-treatement of the description
    try :
        desc_string = re.findall(r'(?<=<br/>).*', description )[0]
    except IndexError as err:
        logging.error(f"List Index error when regex: {err}")
        return [],"" ,[]

    desc_item_list = desc_string.split(r'<br/>')[1:-2]
    # 1 to -2 because the last and first are empty and the -2 is just the date of submission


    #get and remove the name if there is one
    list_of_indexes = get_name_indexes(desc_item_list)
    name_list, desc_item_list = pop_multiple_element(desc_item_list, list_of_indexes)


    # Divide the department and tdgroup from the description into 2 list
    department_set = set(list(map(''.join, itertools.product(CONFIG["department_list"], CONFIG["years_for_department"]))) + 
                         list(map(''.join, itertools.product(CONFIG["prepa_name"], CONFIG["years_for_prepa"]))))

    depart_in_desc, td_group_in_desc = [],[]
    for item in desc_item_list:
        if item in department_set:
            depart_in_desc.append(item)
        else:
            td_group_in_desc.append(item)


    #Remove weird specific string that can appear in the td group
    list_of_indexes_filter=[]
    for index, item in enumerate(td_group_in_desc):
        if item in CONFIG["misc_item_in_description"]:
            list_of_indexes_filter.append(index)

    _, td_group_in_desc = pop_multiple_element(td_group_in_desc,list_of_indexes_filter)


    return td_group_in_desc, name_list, depart_in_desc

def get_name_indexes(list_of_items : list) -> list[int]:
    """returns a list of index where names are"""
    list_of_indexes=[]
    for index, item in enumerate(list_of_items):
        if len(item.split(' ')) >1 :
            list_of_indexes.append(index)
    return list_of_indexes


def item_to_string(item):
    """transform the item to a string if possible"""
    return item.text if item is not None else ""

def get_last_week_start(year, month):
    """Return the date string (YYYYMMDD) for the start of the last week of the given month."""
    last_day = calendar.monthrange(year, int(month))[1]  # Get last day of the month
    last_day_date = datetime(year, int(month), last_day)
    start_of_last_week = last_day_date - timedelta(days = 6)  # Start of the last week
    return start_of_last_week.strftime("%Y%m%d")

def get_yearly_calendar_data(year, department, depart_year, months, remove_one_to_year):
    data_list = []
    start_year = year -1 if remove_one_to_year else year
    for month in months:
        # Fetch the entire month
        data_list += get_calendar_data(
            str(start_year), department, depart_year, f"{year}{month}01", CONFIG["periods_list"][2]
        )
        # Fetch the last week of the month because the last few days are sometimes not in the xml given
        data_list += get_calendar_data(
            str(start_year), department, depart_year, get_last_week_start(year, month), CONFIG["periods_list"][1]
        )
    return data_list

def fetch_entire_year(year_of_start, department, depart_year):
    """ a crude but working method to fetch the entire year of
    year_of_start, department, depart_year"""

    year_of_start_int = int(year_of_start)
    sequence_1st_year = ["08", "09", "10", "11", "12"]
    sequence_2nd_year = ["01", "02", "03", "04", "05", "06", "07", "08"]

    total_list = (
        get_yearly_calendar_data(year_of_start_int, department, depart_year, sequence_1st_year, False)
        + get_yearly_calendar_data(year_of_start_int + 1, department, depart_year, sequence_2nd_year, True)
    )
    return total_list



#--------------------XML PROCESSING UTILS--------------------------#

def get_clean_xml(xml_data :str ) -> str :
    """take a xml tree and recode it in UTF8
    replacing potential corrupted character
    """

    entity_replacements = {
    '&eacute;': 'é',
    '&Eacute;': 'É',
    '&agrave;': 'à',
    '&Agrave;': 'À',
    '&ocirc;': 'ô',
    '&ucirc;': 'û',
    '&icirc;': 'î',
    '&ccedil;': 'ç',
    '&nbsp;': ' ',
    '&': '&amp;'
    }

    content = replace_entities(xml_data, entity_replacements)
    content = html.unescape(content)
    content = remove_invalid_chars(content)

    return content

def remove_invalid_chars(content):
    """delete any invalid xml character
        part of the xml cleaning function
    """

    # Valid XML characters (see XML spec)
    valid_xml_characters = (
        r"[\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]"
    )
    return re.sub(f"[^{valid_xml_characters}]+", "", content)


def replace_entities(content, replacements):
    """replace the keys in the replacements dict by there values"""
    for entity, replacement in replacements.items():
        content = content.replace(entity, replacement)

    return content



#---------------LIST PROCESSING UTILS-------------------------#

def pop_multiple_element(list_of_items : list, list_of_indexes : list):
    """pop all the indexes of the list_of_indexes at the same time in l"""
    deleted_element = [list_of_items[i] for i in list_of_indexes]
    filtered_list = [list_of_items[i] for i in range(len(list_of_items))\
                     if i not in list_of_indexes]
    return deleted_element, filtered_list



#---------------DEBUGGING TOOLS-------------------------#

def print_unique_td(output):
    """ prints all the unique group td in output
    in a sorted manner"""
    unique = set()
    for item in output :
        for element in item[6]:
            unique.add(element)
    for i in sorted(unique):
        print(i)


def print_unique_date(output):
    """ prints all the unique dates in output"""
    unique = set()
    for item in output :
        unique.add(item[0])
    for i in sorted(unique,reverse=True):
        print(i)


def print_all(output):
    """ print all the tuples from the output"""
    for item in output :
        print(item)

#----------------------------------------------------#


if __name__== "__main__" :
    if len(sys.argv)==6:
        out = get_calendar_data(sys.argv[1], sys.argv[2],\
                                             sys.argv[3], sys.argv[4], sys.argv[5])
        # print("-"*150)
        if len(out) == 0 :
            print("Nothing found with those parameters")
        else :
            # print(f"Error code : {error_code}")
            # print("-"*150)
            print_all(out)

        # print("-"*150)
    elif len(sys.argv)==4:
        out = fetch_entire_year(sys.argv[1], sys.argv[2], sys.argv[3])
        print_all(out)
    else:
        print(f"ERROR : wrong number of arguments : must be 5 arguments\
            , were given {len(sys.argv)-1}")
