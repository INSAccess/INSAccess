from django.http import HttpResponse
from ics import Calendar, Event
from django.contrib.auth.models import User
import datetime

from apis.models import InsaClass

def generate_ics(request, user_id):
    """The api route for obtaining the ics of the 
    associated user of the given id
    
    Keyword arguments:
    user_id -- the id of the user
    Return: a ics file with all the event of the user
    """
    
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
        
    response = HttpResponse(str(cal), content_type="text/calendar")
    response['Content-Disposition'] = 'inline; filename=calendar.ics'
    
    return response
