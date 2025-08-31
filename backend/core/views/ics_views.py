from icalendar import Calendar, Event
from django.contrib.auth.models import User
from core.models import UserProfile
from django.http import HttpResponse, JsonResponse
from core.models import InsaClass

import logging
logger = logging.getLogger(__name__)


def generate_ics(request, ics_uid):
    """The api route for obtaining the ics of the
    associated user of the given ics uid

    Keyword arguments:
    ics_uid -- the ics uid of the user
    Return: a ics file with all the event of the user
    """
    try:
        userprofile = UserProfile.objects.get(ics_uid=ics_uid)
    except UserProfile.DoesNotExist:
        response = JsonResponse({'error': 'Invalid token'}, status=400)
        logger.error("User not found for ICS generation", extra={"request": request, "status_code": response.status_code})
        return response

    user_tds = userprofile.link_td.all()
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
    logger.info("ICS calendar generated successfully", extra={"request": request, "status_code": response.status_code})
    return response

