import datetime
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import mail_admins

from core.serializers import (
    InsaClassSerializer,
    InsaEvenementSerializer,
    UserColoredEventSerializer,
    AssociationColoredEventSerializer,
)
from core.models import (
    InsaClass,
    Department,
    GroupTD,
    UserLinkTD,
    InsaEvenement,
    EnumColorTheme,
    Association,
    AssociationPublisher,
    Title,
    UserColoredEvent,
    EnumLanguage,
    UserRelationship,
    UserLinkAssociation,
    Room,
)
from core.utils.fetch_ics import load_config
from core.permissions import IsAssociationPublisher
from django.db.models import Q
from django.http import HttpResponse
from django.contrib.auth.models import User
from config.settings import HOST_IP
import re


import logging

logger = logging.getLogger(__name__)


def sanitize_log_input(value: str, max_length: int = 100) -> str:
    if value is None:
        return ""

    safe_value = str(value).strip()
    safe_value = re.sub(r"[\n\r\t]", "_", safe_value)
    safe_value = re.sub(r"[^0-9a-zA-Z]+", "_", safe_value)
    safe_value = re.sub(r"_+", "_", safe_value)
    safe_value = safe_value.strip("_")
    if len(safe_value) > max_length:
        safe_value = safe_value[:max_length] + "..."

    return safe_value


class GetCalendarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            start_date = (datetime.date.today() - relativedelta(months=1)).replace(
                day=1
            )
            end_date = (
                (datetime.date.today() + relativedelta(months=5)).replace(day=1)
                + relativedelta(months=1)
                - datetime.timedelta(days=1)
            )

            # Prefetch user's TDs to reduce queries
            user_tds_qs = request.user.userprofile.link_td.all()

            # Prefetch related objects to avoid N+1 queries
            classes_qs = (
                InsaClass.objects.filter(
                    link_td__in=user_tds_qs, date__range=[start_date, end_date]
                )
                .distinct()
                .prefetch_related(
                    "link_td", "link_teacher", "link_room", "link_depart", "desc"
                )
            )

            # Prefetch user-colored events with related title
            user_events_qs = UserColoredEvent.objects.filter(
                user=request.user
            ).select_related("title")

            serializer = InsaClassSerializer(
                classes_qs, context={"request": request}, many=True
            )
            colors_serializer = UserColoredEventSerializer(
                user_events_qs, context={"request": request}, many=False
            )

            response = Response(
                {"events": serializer.data, "colors": colors_serializer.data}
            )
            logger.info(
                "User fetched events for custom month range",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_calendar: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetTdsAPIView(APIView):
    """Returns TDs for a user, department, or all departments."""

    permission_classes = [IsAuthenticated]

    def get(self, request, department):
        """
        Get TDs for a specific department or all departments if 'all' is passed.
        """
        try:
            user_profile = request.user.userprofile
            user_tds_qs = user_profile.link_td.all()
            user_tds = [td.name for td in user_tds_qs]

            if department.lower() == "all":
                all_departments = Department.objects.all()
                all_tds_data = {}

                for dept in all_departments:
                    department_tds_qs = GroupTD.objects.filter(
                        classlinktd__insa_class__classlinkdepart__depart=dept
                    ).distinct()

                    serialized_tds = [td.name for td in department_tds_qs]
                    dept_tds = sorted(
                        [td for td in serialized_tds if td.startswith(dept.name)]
                    )
                    other_tds = sorted(
                        [td for td in serialized_tds if not td.startswith(dept.name)]
                    )

                    all_tds_data[dept.name] = {
                        "department_tds": dept_tds,
                        "other_tds": other_tds,
                    }

                response = Response({"user_tds": user_tds, "departments": all_tds_data})
                logger.info(
                    "All TDs fetched",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
            dept_obj = Department.objects.filter(name=department).first()
            if not dept_obj:
                all_tds = GroupTD.objects.all()
                serialized_tds = [td.name for td in all_tds]
                response = Response({"user_tds": user_tds, "all_tds": serialized_tds})
                logger.warning(
                    f"Department not found {sanitize_log_input(department)}, defaulting to all TDs",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response

            department_tds_qs = GroupTD.objects.filter(
                classlinktd__insa_class__link_depart__depart=dept_obj
            ).distinct()
            serialized_tds = [td.name for td in department_tds_qs]
            department_tds = sorted(
                [td for td in serialized_tds if td.startswith(department)]
            )
            other_tds = sorted(
                [td for td in serialized_tds if not td.startswith(department)]
            )

            response = Response(
                {
                    "user_tds": user_tds,
                    "department_tds": department_tds,
                    "other_tds": other_tds,
                }
            )
            logger.info(
                f"Department {department} TDs fetched",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_tds: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetAssociationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returns the existing associations
        """
        try:
            user_profile = request.user.userprofile
            user_assos_qs = user_profile.link_assos.all()
            user_assos = [asso.name for asso in user_assos_qs]
            all_associations = [asso.name for asso in Association.objects.all()]
            response = Response(
                {
                    "user_associations": user_assos,
                    "all_associations": all_associations,
                }
            )
            logger.info(
                "Returned list of available association and user's subscribed associations",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_association: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class PostAssociationAPIView(APIView):
    """
    API route for saving the selected Association of the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save the selected Associations for the user.
        Expects JSON payload: { "selected_assos": [<td_name>, ...] }
        """
        user = request.user
        try:
            selected_assos = request.data.get("selected_assos")

            if not isinstance(selected_assos, list):
                response = Response(
                    {"error": "selected_assos must be a list"}, status=400
                )
                logger.error(
                    "Invalid payload type for selected_assos",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response

            valid_assos = Association.objects.filter(name__in=selected_assos)
            valid_names = set(td.name for td in valid_assos)

            invalid_assos = set(selected_assos) - valid_names
            if invalid_assos:
                logger.error(
                    f"User submitted invalid TDs: {list(invalid_assos)}",
                    extra={"request": request, "status_code": 400},
                )

            UserLinkAssociation.objects.filter(user=user.userprofile).delete()

            user_link_assos = [
                UserLinkAssociation(user=user.userprofile, name_assos=asso)
                for asso in valid_assos
            ]
            if user_link_assos:
                UserLinkAssociation.objects.bulk_create(user_link_assos)

            response = Response({"success": "Sélection actualisée !"})
            logger.info(
                f"User updated Assos selection: {len(user_link_assos)} valid, {len(invalid_assos)} invalid",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at post_assos: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class PostTdsAPIView(APIView):
    """
    API route for saving the selected TDs of the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save the selected TDs for the user.
        Expects JSON payload: { "selected_tds": [<td_name>, ...] }
        """
        user = request.user
        try:
            selected_tds = request.data.get("selected_tds")

            if not isinstance(selected_tds, list):
                response = Response(
                    {"error": "selected_tds must be a list"}, status=400
                )
                logger.error(
                    "Invalid payload type for selected_tds",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response

            MAX_TDS = 100
            if len(selected_tds) > MAX_TDS:
                response = Response(
                    {"error": f"Too many TDs selected (max {MAX_TDS})"}, status=400
                )
                logger.error(
                    f"User attempted to select {len(selected_tds)} TDs (limit {MAX_TDS})",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response

            valid_tds = GroupTD.objects.filter(name__in=selected_tds)
            valid_names = set(td.name for td in valid_tds)

            invalid_tds = set(selected_tds) - valid_names
            if invalid_tds:
                logger.error(
                    f"User submitted invalid TDs: {list(invalid_tds)}",
                    extra={"request": request, "status_code": 400},
                )

            UserLinkTD.objects.filter(user=user.userprofile).delete()

            user_link_tds = [
                UserLinkTD(user=user.userprofile, name_td=td) for td in valid_tds
            ]
            if user_link_tds:
                UserLinkTD.objects.bulk_create(user_link_tds)

            response = Response({"success": "Sélection actualisée !"})
            logger.info(
                f"User updated TD selection: {len(user_link_tds)} valid, {len(invalid_tds)} invalid",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at post_tds: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetEvenementsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_assos_qs = request.user.userprofile.link_assos.all()
            evenements = InsaEvenement.objects.filter(
                association__in=user_assos_qs
            ).distinct()
            serializer = InsaEvenementSerializer(
                evenements, context={"request": request}, many=True
            )
            color_serializer = AssociationColoredEventSerializer(
                Association.objects.all(), context={"request": request}, many=False
            )
            response = Response(
                {"events": serializer.data, "colors": color_serializer.data}
            )
            logger.info(
                "Fetched INSA events and association colors",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_evenements: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetIsConnectedAPIView(APIView):
    """A small api route for the temporary solution
    for knowing if the user is connected or not

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized boolean
    """

    def get(self, request):
        """returns True if the user is authenticated else False"""
        try:
            response = Response(request.user.is_authenticated)
            logger.info(
                "Checked user authentication",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_is_connected {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetIsAssociationPublisherAPIView(APIView):
    """A small api route for the temporary solution
    for knowing if the user is connected or not

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized boolean
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """returns True if the user is authenticated else False"""
        try:
            asso_publisher = AssociationPublisher.objects.filter(
                user=request.user
            ).first()
            if not asso_publisher:
                response = Response({"is_asso": False, "asso": None})
            else:
                asso = asso_publisher.association.name
                response = Response({"is_asso": True, "asso": asso})
            logger.info(
                "Checked if user is an association publisher",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_is_association_publisher : {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class DeleteEventAPIView(APIView):
    """change the user associated theme"""

    permission_classes = [IsAuthenticated, IsAssociationPublisher]

    def delete(self, request, uid):
        """"""
        try:
            associations = Association.objects.filter(
                associationpublisher__user=request.user
            )
            event = InsaEvenement.objects.filter(
                uid=uid, association__in=associations
            ).first()
            if event:
                event.delete()
                response = Response({"success": "Evenement deleted"})
                logger.info(
                    "User deleted association event",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
            else:
                response = Response({"error": "Event doesn't exists"}, status=400)
                logger.error(
                    f"User tried to delete with a non-existent event : {sanitize_log_input(uid)}",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at post_delete_evenement: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetUserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        def safe_get(key, func):
            try:
                value = func()

                return value
            except Exception as e:
                logger.error(
                    f"Internal server error at {key}: {str(e)}",
                    extra={"request": request, "status_code": 500},
                )
                return None

        profile = {
            "ics_url": safe_get(
                "get_ics_url",
                lambda: f"https://{HOST_IP}/ics/{request.user.userprofile.ics_uid}",
            ),
            "theme": safe_get(
                "get_user_theme", lambda: request.user.userprofile.color_theme.name
            ),
            "language": safe_get(
                "get_user_language", lambda: request.user.userprofile.language.name
            ),
            "username": safe_get("get_profile_username", lambda: request.user.username),
            "displayName": safe_get(
                "get_profile_displayName",
                lambda: request.session.get("attributes", {}).get("first_name", ""),
            ),
            "cas_autosync": safe_get(
                "get_user_cas_autosync", lambda: request.user.userprofile.cas_auto_sync
            ),
            "departement_name": safe_get(
                "get_user_departement_name",
                lambda: request.user.userprofile.departement_name,
            ),
            "departement_year": safe_get(
                "get_user_departement_year",
                lambda: request.user.userprofile.departement_year,
            ),
        }

        def association_info():
            asso_publisher = AssociationPublisher.objects.filter(
                user=request.user
            ).first()
            if asso_publisher:
                return {"is_asso": True, "asso": asso_publisher.association.name}
            return {"is_asso": False, "asso": None}

        profile.update(
            safe_get("get_is_association_publisher", association_info)
            or {"is_asso": None, "asso": None}
        )

        return Response(profile)


class PostUserThemeAPIView(APIView):
    """change the user associated theme"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """"""
        try:
            theme_name = request.data
            theme = EnumColorTheme.objects.filter(name=theme_name).first()
            if theme:
                request.user.userprofile.color_theme = theme
                request.user.userprofile.save()
                response = Response({"success": "Theme actualisé !"})
                logger.info(
                    "User updated color theme",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
            else:
                response = Response({"error": "Theme n'existe pas"}, status=400)
                logger.error(
                    f"User tried to update with a non-existent theme : {sanitize_log_input(theme_name)}",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at post_user_theme: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class PostUserDepartementAPIView(APIView):
    """change the user associated theme"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """"""
        try:
            departement_name = request.data["departement_name"]
            departement_year = request.data["departement_year"]
            if departement_name and departement_year:
                request.user.userprofile.departement_name = departement_name
                request.user.userprofile.departement_year = departement_year
                request.user.userprofile.save()
                response = Response({"success": "Département actualisé !"})
                logger.info(
                    "User updated departement",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
            else:
                response = Response(
                    {"error": "Département ou année malformée"}, status=400
                )
                logger.error(
                    f"User tried to update with a malformed departement name or year : {sanitize_log_input(departement_name)}, {sanitize_log_input(departement_year)}",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at post_user_departement: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class PostUserLanguageAPIView(APIView):
    """change the user associated theme"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """"""
        try:
            language_name = request.data
            language = EnumLanguage.objects.filter(name=language_name).first()
            if language:
                request.user.userprofile.language = language
                request.user.userprofile.save()
                response = Response({"success": "Language actualisé !"})
                logger.info(
                    "User updated language",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
            else:
                response = Response({"error": "Language doesnt exist"}, status=400)
                logger.error(
                    f"User tried to update with a non-existent language : {sanitize_log_input(language_name)}",
                    extra={"request": request, "status_code": response.status_code},
                )
                return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at post_user_language: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetEnumThemeAPIView(APIView):
    """return the themes"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            themes = [theme.name for theme in EnumColorTheme.objects.all()]
            themes.sort()
            response = Response(themes)
            logger.info(
                "Returned list of available color themes",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_enum_theme: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetEnumLanguageAPIView(APIView):
    """return the themes"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            languages = [lang.name for lang in EnumLanguage.objects.all()]
            response = Response(languages)
            logger.info(
                "Returned list of available languages",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_enum_language: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class GetConfigFileAPIView(APIView):
    """API route for returning the list of available departments in the DB"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            CONFIG = load_config()
            response = Response(CONFIG)
            logger.info(
                "Returned configuration data",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_config_file: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class PostUserColorAPIView(APIView):
    """Api view for posting the prefered color for an event title"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """"""
        try:
            data = request.data
            field = UserColoredEvent.objects.get_or_create(
                user=request.user,
                title=Title.objects.filter(name=data["title"]).first(),
            )[0]
            field.color = data["color"]
            field.save()
            response = Response({"status": "success"})
            logger.info(
                "User colored event updated successfully",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Error updating user colored event: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class PostInsaEvenementAPIView(APIView):
    """post route for creating evenement"""

    permission_classes = [IsAuthenticated, IsAssociationPublisher]

    def post(self, request):
        """"""
        try:
            data = request.data

            date = datetime.datetime.strptime(data["date"], "%Y-%m-%d").date()
            start_hour = datetime.datetime.combine(
                date, datetime.datetime.strptime(data["start_hour"], "%H:%M").time()
            )
            end_hour = datetime.datetime.combine(
                date, datetime.datetime.strptime(data["end_hour"], "%H:%M").time()
            )
            time_stamp = timezone.now()

            association = Association.objects.get(
                pk=(
                    AssociationPublisher.objects.filter(user=request.user)
                    .first()
                    .association
                )
            )

            InsaEvenement.objects.create(
                date=date,
                time_stamp=time_stamp,
                start_hour=start_hour,
                end_hour=end_hour,
                desc=Title.objects.get_or_create(name=data.get("title", ""))[0],
                associated_link=data.get("associated_link", ""),
                association=association,
                location=data.get("location", ""),
                info=data.get("info", ""),
            )

            response = Response({"status": "success"})
            logger.info(
                "Operation successful",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Error occurred: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class UsersAPIView(APIView):
    """return the users"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            users = [
                {"username": user.username, "displayName": user.first_name}
                for user in User.objects.all()
            ]
            response = Response(users)
            logger.info(
                "Returned list of the users",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get users: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class RoomsAPIView(APIView):
    """return the rooms"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """"""
        try:
            rooms = [room.name for room in Room.objects.all()]
            response = Response(rooms)
            logger.info(
                "Returned list of the rooms",
                extra={"request": request, "status_code": response.status_code},
            )
            return response
        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get rooms: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class FriendsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Get the other users, who the request user has a relationship with
        sorted by relationship type
        """
        user = request.user
        try:
            relationships = UserRelationship.objects.filter(
                Q(first_user=user) | Q(second_user=user)
            ).all()

            result = {"friends": [], "sent": [], "received": []}

            for rel in relationships:
                if rel.first_user == user:
                    pending_type = "sent"
                    other_user = rel.second_user
                else:
                    pending_type = "received"
                    other_user = rel.first_user

                if rel.type == UserRelationship.RelationshipType.FRIEND:
                    result["friends"].append(other_user.username)
                else:
                    result[pending_type].append(other_user.username)
            logger.info("Fetched list of friends")
            return Response(result)

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at GET /friends: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

    def delete(self, request):
        """
        Delete a relationship between request.user and another user.
        Expects JSON payload: {"other_user": <username>}
        """
        user = request.user
        data = request.data

        other_username = data.get("other_user")
        if not other_username:
            return Response(
                {"error": "Provide a other_user in the delete request"}, status=400
            )
        try:
            other_user = User.objects.get(username=other_username)
        except User.DoesNotExist:
            logger.error(
                f"User tried to delete a relation with non existing user : {sanitize_log_input(other_username)}"
            )
            return Response({"error": "User not found"}, status=404)

        try:
            relationship = UserRelationship.objects.filter(
                (Q(first_user=user) & Q(second_user=other_user))
                | (Q(first_user=other_user) & Q(second_user=user))
            ).first()

            if relationship:
                relationship.delete()
                logger.info(
                    f"User removed his relationship with {sanitize_log_input(other_username)}"
                )
                return Response(
                    {"success": f"Relationship with {other_username} deleted"}
                )
            else:
                logger.error(
                    f"User tried to delete a non existing relation with {sanitize_log_input(other_username)}"
                )
                return Response({"error": "No such relationship found"}, status=404)

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at DELETE /friends: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

    def post(self, request):
        """
        Send a friend request or accept an existing request.
        Expects JSON payload: {"other_user": <username>}

        Logic:
        - If no relationship exists: create one with PENDING12 (request.user → other_user)
        - If a PENDING21 exists: turn it into FRIEND
        - Otherwise: return 400 Bad Request
        """
        user = request.user
        data = request.data

        other_username = data.get("other_user")
        if not other_username:
            return Response({"error": "Provide other_user username"}, status=400)

        try:
            other_user = User.objects.get(username=other_username)
        except User.DoesNotExist:
            logger.error(
                f"User tried to add a relation with non existing user : {sanitize_log_input(other_username)}"
            )
            return Response({"error": "User not found"}, status=404)
        if other_user == user:
            logger.error("User tried to add a relation with itself")
            return Response({"error": "You can't add yourself as a friend"}, status=400)
        try:
            relationship = UserRelationship.objects.filter(
                (Q(first_user=user) & Q(second_user=other_user))
                | (Q(first_user=other_user) & Q(second_user=user))
            ).first()

            if not relationship:
                UserRelationship.objects.create(
                    first_user=user,
                    second_user=other_user,
                    type=UserRelationship.RelationshipType.PENDING,
                )
                logger.info(
                    f"User sent a friend request with {sanitize_log_input(other_username)}"
                )
                return Response({"success": f"Friend request sent to {other_username}"})

            elif (
                relationship.type == UserRelationship.RelationshipType.PENDING
                and relationship.second_user == user
            ):
                relationship.type = UserRelationship.RelationshipType.FRIEND
                relationship.save()
                logger.info(
                    f"User accepted the friend request of {sanitize_log_input(other_username)}"
                )
                return Response(
                    {"success": f"You are now friends with {other_username}"}
                )

            else:
                # Any other case (already FRIEND, or PENDING in the other way)
                return Response({"error": "Invalid friend request"}, status=400)

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error in POST /friends: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class RoomCalendarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, roomname):
        try:
            start_date = (datetime.date.today() - relativedelta(months=1)).replace(
                day=1
            )
            end_date = (
                (datetime.date.today() + relativedelta(months=5)).replace(day=1)
                + relativedelta(months=1)
                - datetime.timedelta(days=1)
            )

            room = Room.objects.filter(name__iexact=roomname).first()

            if not room:
                return Response({"error": "Room not found"}, status=404)

            classes_qs = (
                InsaClass.objects.filter(
                    classlinkroom__room=room,
                    date__range=[start_date, end_date],
                )
                .distinct()
                .prefetch_related(
                    "link_room", "link_td", "link_teacher", "link_depart", "desc"
                )
            )

            serializer = InsaClassSerializer(
                classes_qs, context={"request": request}, many=True
            )

            response = Response({"events": serializer.data, "colors": []})
            logger.info(
                "User fetched room events",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_room_calendar: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class FriendCalendarAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = request.user
        try:
            # Fetch user with related TDs to avoid extra queries later
            other_user = User.objects.prefetch_related("userprofile__link_td").get(
                username=username
            )
        except User.DoesNotExist:
            logger.error(
                f"User tried to add a relation with non existing user: {sanitize_log_input(username)}"
            )
            return Response({"error": "User not found"}, status=404)

        if not UserRelationship.objects.filter(
            (
                (Q(first_user=user) & Q(second_user=other_user))
                | (Q(first_user=other_user) & Q(second_user=user))
            )
            & Q(type=UserRelationship.RelationshipType.FRIEND)
        ).exists():
            logger.error(
                f"User tried to view non-friend calendar of: {sanitize_log_input(username)}"
            )
            return Response(
                {"error": "You are not friend with this person"}, status=400
            )

        try:
            start_date = (datetime.date.today() - relativedelta(months=1)).replace(
                day=1
            )
            end_date = (
                (datetime.date.today() + relativedelta(months=5)).replace(day=1)
                + relativedelta(months=1)
                - datetime.timedelta(days=1)
            )

            # Prefetch classes with all related objects to avoid N+1 queries
            classes_qs = (
                InsaClass.objects.filter(
                    link_td__in=other_user.userprofile.link_td.all(),
                    date__range=[start_date, end_date],
                )
                .distinct()
                .prefetch_related(
                    "link_td", "link_teacher", "link_room", "link_depart", "desc"
                )
            )

            # Prefetch user-colored events
            user_events_qs = UserColoredEvent.objects.filter(
                user=other_user
            ).select_related("title")

            serializer = InsaClassSerializer(
                classes_qs, context={"request": request}, many=True
            )
            colors_serializer = UserColoredEventSerializer(
                user_events_qs, context={"request": request}, many=False
            )

            response = Response(
                {"events": serializer.data, "colors": colors_serializer.data}
            )
            logger.info(
                "User fetched friend's events",
                extra={"request": request, "status_code": response.status_code},
            )
            return response

        except Exception as e:
            response = Response({"error": "Internal server error"}, status=500)
            logger.error(
                f"Internal server error at get_friend_calendar: {str(e)}",
                extra={"request": request, "status_code": response.status_code},
            )
            return response


class BugReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    """
    API endpoint to receive bug reports from frontend.
    Expects JSON with `title` and `details`.
    Sends an email to all ADMINS in settings.ADMINS.
    """

    def post(self, request):
        data = request.data
        user = request.user

        title = data.get("title", "").strip()
        details = data.get("details", "").strip()

        if not title or not details:
            logger.warning(
                f"User {user.username} submitted incomplete bug report: "
                f"title='{sanitize_log_input(title)}', details='{sanitize_log_input(details)}'"
            )
            return Response({"error": "Title and details are required."}, status=400)

        subject = f"Bug Report: {title} by {user.username}"
        message = (
            f"Bug Details:\n{details}\n\nReported by: {user.username} ({user.email})"
        )

        try:
            mail_admins(subject=subject, message=message, fail_silently=False)
            logger.info(
                f"User {user.username} submitted bug report successfully: "
                f"title='{sanitize_log_input(title)}'"
            )
            return Response({"success": "Bug report sent successfully."}, status=200)
        except Exception as e:
            logger.error(
                f"Failed to send bug report email from user {user.username}: {str(e)}",
                extra={"request": request.data},
            )
            return Response({"error": f"Failed to send email: {str(e)}"}, status=500)


class ChangeCasSyncAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, enable):
        try:
            user_profile = request.user.userprofile
            enabled = enable == "true"
            user_profile.cas_auto_sync = enabled
            user_profile.save()
            logger.info(
                f"User {request.user.id} cas_auto_sync updated successfully to {enabled}"
            )
            return Response({"success": "Preferences saved successfully"}, status=200)
        except Exception as e:
            logger.error(
                f"Failed to update user cas_autosync: {str(e)}",
                extra={"request": request.data},
            )
            return Response(
                {"error": f"Failed to update cas preferences: {str(e)}"}, status=500
            )


class UpdateUsingCasTDAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_profile = request.user.userprofile
            subscribed_tds = (
                request.session.get("attributes", {}).get("supannAffectation", []) or []
            )

            normalized_cas_tds = [td.strip().lower() for td in subscribed_tds]

            tds_in_db = [
                td
                for td in GroupTD.objects.all()
                if td.name.strip().lower() in normalized_cas_tds
            ]

            user_profile.link_td.add(*tds_in_db)
            user_profile.save()

            logger.info(f"User {request.user.id} successfully synced TDs: {tds_in_db}")

            return Response(
                {"synced_tds": [td.name for td in user_profile.link_td.all()]},
                status=200,
            )
        except Exception as e:
            logger.error(
                f"Failed to update user cas_autosync: {str(e)}",
                extra={"request": request.data},
            )
            return Response(
                {"error": f"Failed to update cas preferences: {str(e)}"}, status=500
            )


class ChangeICSLinkAPIView(APIView):
    def post(self, request):
        try:
            user_profile = request.user.userprofile
            user_profile.regenerate_ics_uid()
            logger.info("ICS feed uid regenerated successfully")
            return HttpResponse(f"https://{HOST_IP}/ics/{user_profile.ics_uid}")
        except Exception as e:
            logger.error(
                f"Failed to regenerate ICS UID: {str(e)}",
                extra={"request": request.data},
            )
            return Response(
                {"error": f"Failed to regenerate ICS UID: {str(e)}"}, status=500
            )
