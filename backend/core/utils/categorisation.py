import re

def categorise(description):
    departements = re.findall(r'(ITI|H|EP|GM|GPGR|GC|CGC|CFI|MECA)+', description)
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