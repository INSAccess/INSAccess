from django.http import HttpResponse
from ics import Calendar, Event
from django.contrib.auth.models import User
import datetime

from apis.models import InsaClass

def generate_ics(request, user_id):
    #user = User.objects.get(id=user_id)
    user = request.user
    start_of_year =  datetime.datetime.today().replace(month=1,day=1)  # First day of the year
    end_of_year = (start_of_year + datetime.timedelta(days=400)).replace(day=1,month=1)\
                                - datetime.timedelta(days=1)  # Last day of the year

    user_tds = user.userprofile.link_td.all()
    classes = InsaClass.objects.filter(link_td__in=user_tds,
                                       date__range =[start_of_year, end_of_year]).distinct()

    cal = Calendar()

    for event in classes:
        e = Event()
        e.name = event.desc
        e.begin = datetime.datetime.combine(event.date, event.start_hour).strftime("%Y%m%dT%H%M%SZ")
        e.end = datetime.datetime.combine(event.date, event.end_hour).strftime("%Y%m%dT%H%M%SZ")
        rooms = [room.name for room in event.link_room.all()]
        e.location = ",".join(rooms)
        
        departments = [depart.name for depart in event.link_depart.all()]
        teachers = [teacher.name for teacher in event.link_teacher.all()]
        final_description = [event.desc] + teachers + departments
        nl = "\n"
        e.description = f"{nl}{nl}{nl.join(final_description)}{nl}"
        cal.events.add(e)

    # Générer le fichier ICS en tant que réponse HTTP
    response = HttpResponse(str(cal), content_type="text/calendar")
    response['Content-Disposition'] = f'attachment; filename="calendar_{user_id}.ics"'
    
    return response




DESCRIPTION:\\n\\nITI32 AUTO TD 3\\nLAGHMARA HACHEMI Hind\\nITI3\\n
DTEND:2025 02 25 T111500Z
LOCATION:MA-G-RC-05
DTSTART:20250225T094500Z
SUMMARY:ITI32 AUTO TD 3
UID:4e39606f-06f1-434c-986a-af69a46b1f55@4e39.org


# DTSTAMP:2025 03 26 T073629Z
# DTSTART:20250115T173000Z
# DTEND:20250115T190000Z
# SUMMARY:H-32-ALL-DEB1-TD-1
# DESCRIPTION:\n\nH-32-ALLEMAND-DEB1-TD-01\nDEVIGNE Julie\nCGC3\nEP3\nGM3\n
#  GPGR3\nITI3\nMECA3\n(Exporté le:26/03/2025 08:36)\n
# UID:ADE60616e6e65652d323032342d323032352d373031382d302d30
# CREATED:19700101T000000Z
# LAST-MODIFIED:20250326T073629Z
# SEQUENCE:2141699716
