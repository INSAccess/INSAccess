from icalendar import Calendar, Event
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.core import signing


from core.models import InsaClass

def generate_ics(request, encrypted_id):
    """The api route for obtaining the ics of the 
    associated user of the given id
    
    Keyword arguments:
    user_id -- the id of the user
    Return: a ics file with all the event of the user
    """
    try:
        user_id = signing.loads(encrypted_id)
        user = User.objects.get(id=user_id)
    except signing.BadSignature:
        return JsonResponse({'error': 'Invalid token'}, status=400)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    user_tds = user.userprofile.link_td.all()
    classes = InsaClass.objects.filter(link_td__in=user_tds).distinct()

    cal = Calendar()

    cal.add("method", "REQUEST")
    cal.add("prodid", "-//INSAccess/version 1.0")
    cal.add("x-wr-calname;value=text", "personnal_calendar")
    cal.add("calscale", "GREGORIAN")
    cal.add("version", "1.0")
    for event in classes:
        e = Event()
        e.add("dtstamp", event.time_stamp)
        e.add("dtstart", event.start_hour)
        e.add("dtend", event.end_hour)
        e.add("summary", event.desc)
        
        rooms = [room.name for room in event.link_room.all()]
        e.add("location", ",".join(rooms))
        
        td_tags = [td.name for td in event.link_td.all()]
        departments = [depart.name for depart in event.link_depart.all()]
        teachers = [teacher.name for teacher in event.link_teacher.all()]
        final_description = td_tags + teachers + departments
        nl = "\n"
        e.add("description", f"{nl}{nl}{nl.join(final_description)}{nl}")
        
        e.add('uid', event.uid)
        e.add("created", event.time_created)
        e.add("last-modified", event.time_last_modified)
        e.add("sequence", event.sequence)

        cal.add_component(e)

    response = HttpResponse(cal.to_ical().decode('utf-8'), content_type="text/calendar")
    response['Content-Disposition'] = 'inline; filename=personnal_calendar.ics'

    return response
