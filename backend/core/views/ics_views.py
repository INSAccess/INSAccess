from icalendar import Calendar, Event, vText
from django.http import HttpResponse, JsonResponse
from core.models import UserProfile, InsaClass, InsaEvenement
from config.settings import UID_SUFFIX
import logging

logger = logging.getLogger(__name__)


def ics_feed(request, ics_uid):
    """The API route for obtaining a live ICS feed for the user
    associated with the given ICS UID.
    """
    try:
        userprofile = UserProfile.objects.get(ics_uid=ics_uid)
    except UserProfile.DoesNotExist:
        response = JsonResponse({"error": "Invalid token"}, status=400)
        logger.error(
            "User not found for ICS feed generation",
            extra={"request": request, "status_code": response.status_code},
        )
        return response

    user_tds = userprofile.link_td.all()
    classes = InsaClass.objects.filter(link_td__in=user_tds).distinct()
    associations = userprofile.link_assos.all()
    asso_events = InsaEvenement.objects.filter(association__in=associations).distinct()

    cal = Calendar()
    cal.add("method", "PUBLISH")
    cal.add("prodid", "-//Edt/version 1.0")
    cal.add("X-WR-CALNAME", "personal_calendar")
    cal.add("calscale", "GREGORIAN")
    cal.add("version", "2.0")
    cal.add("X-WR-TIMEZONE", "Europe/Paris")

    for event in classes:
        e = Event()
        e.add("uid", f"{event.uid}@{UID_SUFFIX}")
        e.add("dtstamp", event.time_stamp)
        e.add("dtstart", event.start_hour)
        e.add("dtend", event.end_hour)

        summary_text = str(event.desc) if event.desc else "No title"
        e.add("summary", vText(summary_text))

        rooms = [room.name for room in event.link_room.all()]
        e.add("location", vText(",".join(rooms)))

        td_tags = [td.name for td in event.link_td.all()]
        departments = [depart.name for depart in event.link_depart.all()]
        teachers = [teacher.name for teacher in event.link_teacher.all()]
        final_description = td_tags + teachers + departments
        nl = "\n"
        e.add("description", vText(f"{nl}{nl}{nl.join(final_description)}{nl}"))

        e.add("created", event.time_created)
        e.add("last-modified", event.time_last_modified)
        e.add("sequence", event.sequence)

        cal.add_component(e)
    
    for event in asso_events:
        e = Event()
        e.add("uid", f"{event.uid}@{UID_SUFFIX}")
        e.add("dtstamp", event.time_stamp)
        e.add("dtstart", event.start_hour)
        e.add("dtend", event.end_hour)

        summary_text = str(event.desc) if event.desc else "No title"
        e.add("summary", vText(summary_text))

        e.add("location", vText(event.location))

        final_description = [event.association.name, event.info, event.associated_link]
        nl = "\n"
        e.add("description", vText(f"{nl}{nl}{nl.join(final_description)}{nl}"))

        e.add("created", event.time_created)
        e.add("last-modified", event.time_last_modified)
        e.add("sequence", event.sequence)

        cal.add_component(e)

    response = HttpResponse(cal.to_ical(), content_type="text/calendar; charset=utf-8")

    logger.info(
        "ICS feed generated successfully",
        extra={"request": request, "status_code": response.status_code},
    )
    return response
