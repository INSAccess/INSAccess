import datetime
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.serializers import InsaClassSerializer, InsaEvenementSerializer, \
    UserColoredEventSerializer, AssociationColoredEventSerializer
from core.models import InsaClass, Department, GroupTD, UserLinkTD,InsaEvenement\
    ,EnumColorTheme,Association,AssociationPublisher, Title, UserColoredEvent
from core.utils.categorisation import categorise
from core.utils.fetch_ics import load_config
from core.permissions import IsAssociationPublisher

import logging
logger = logging.getLogger(__name__)

class GetDayAPIView(APIView):
    """The api that returns the event class
    of the request user for the day

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, day):
        """Returns the Json for the given day (of the format YYYY-MM-DD)"""
        try:
            day_date = datetime.datetime.strptime(day, "%Y-%m-%d").date()
        except ValueError :
            response = Response({"error": "Invalid date format"}, status = 400)
            logger.error(f"User tried to input this {day} as a date" ,extra={"request": request, "status_code": response.status_code})
            return response

        try:
            user_tds = request.user.userprofile.link_td.all()

            classes = InsaClass.objects.filter(link_td__in=user_tds, date = day_date).distinct()
            serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
            colors_serializer = UserColoredEventSerializer(UserColoredEvent.objects.filter(user = request.user).distinct(),
                                                        context={'request': request}, many=False)
            response = Response({"events" : serializer.data, "colors" : colors_serializer.data})
            logger.info("User fetched events",extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_day" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetWeekAPIView(APIView):
    """The api that returns the event class
    of the request user for the week

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, day):
        """Returns the Json for the week of the given day
        (of the format YYYY-MM-DD)"""
        try:
            day_date = datetime.datetime.strptime(day, "%Y-%m-%d").date()
        except ValueError :
            response = Response({"error": "Invalid date format"}, status = 400)
            logger.error(f"User tried to input this {day} as a date" ,extra={"request": request, "status_code": response.status_code})
            return response

        try:
            start_of_week = day_date - datetime.timedelta(days=day_date.weekday())  # Monday
            end_of_week = start_of_week + datetime.timedelta(days=6)  # Sunday

            user_tds = request.user.userprofile.link_td.all()

            classes = InsaClass.objects.filter(link_td__in=user_tds,
                                            date__range =[start_of_week, end_of_week]).distinct()
            serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
            colors_serializer = UserColoredEventSerializer(UserColoredEvent.objects.filter(user = request.user).distinct(),
                                                        context={'request': request}, many=False)
            response = Response({"events" : serializer.data, "colors" : colors_serializer.data})
            logger.info("User fetched events",extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_week" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetMonthAPIView(APIView):
    """The api that returns the event class
    of the request user for the month

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, day):
        """Returns the Json for the month of the given day
        (of the format YYYY-MM-DD)"""
        try:
            day_date = datetime.datetime.strptime(day, "%Y-%m-%d").date()
        except ValueError :
            response = Response({"error": "Invalid date format"}, status = 400)
            logger.error(f"User tried to input this {day} as a date" ,extra={"request": request, "status_code": response.status_code})
            return response

        try:
            start_of_month = day_date.replace(day=1)  # First day of the month
            end_of_month = (start_of_month + datetime.timedelta(days=32)).replace(day=1)\
                                        - datetime.timedelta(days=1)  # Last day of the month


            user_tds = request.user.userprofile.link_td.all()

            classes = InsaClass.objects.filter(link_td__in=user_tds,
                                            date__range =[start_of_month, end_of_month]).distinct()
            serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
            colors_serializer = UserColoredEventSerializer(UserColoredEvent.objects.filter(user = request.user).distinct(),
                                                        context={'request': request}, many=False)
            response = Response({"events" : serializer.data, "colors" : colors_serializer.data})
            logger.info("User fetched events",extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_month" ,extra={"request": request, "status_code": response.status_code})
            return response


class GetYearAPIView(APIView):
    """The api that returns the event class
    of the request user for the year

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, day):
        """Returns the Json for the year of the given day
        (of the format YYYY-MM-DD)"""
        try:
            day_date = datetime.datetime.strptime(day, "%Y-%m-%d").date()
        except ValueError :
            response = Response({"error": "Invalid date format"}, status = 400)
            logger.error(f"User tried to input this {day} as a date" ,extra={"request": request, "status_code": response.status_code})
            return response

        try:
            start_of_year = day_date.replace(month=1,day=1)  # First day of the year
            end_of_year = (start_of_year + datetime.timedelta(days=400)).replace(day=1,month=1)\
                                        - datetime.timedelta(days=1)  # Last day of the year


            user_tds = request.user.userprofile.link_td.all()
            classes = InsaClass.objects.filter(link_td__in=user_tds,
                                            date__range =[start_of_year, end_of_year]).distinct()
            serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
            colors_serializer = UserColoredEventSerializer(UserColoredEvent.objects.filter(user = request.user).distinct(),
                                                        context={'request': request}, many=False)
            response = Response({"events" : serializer.data, "colors" : colors_serializer.data})
            logger.info("User fetched events",extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_year" ,extra={"request": request, "status_code": response.status_code})
            return response


class GetTdsAPIView(APIView):
    """Returns the Json of the request user's td and the department td's
        (or all of them if no department is found)

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized data
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, department):
        """provide the serialized tds of the given department
        return all tds if the given department doesnt match our database's department

        Args:
            request : the request associated with the call of this api
            department (String): the department given in the get method

        Returns:
        response: the serialized data
        """
        try:
            user_tds = request.user.userprofile.link_td.all()
            serialized_user_tds= [td.name for td in user_tds]

            department_obj = Department.objects.filter(name = department).first()
            if not department_obj:
                tds = GroupTD.objects.all()
                serialized_tds= [td.name for td in tds]
                response = Response({"user_tds" : serialized_user_tds, "all_tds" : serialized_tds})
                logger.warning(f"Department not found {department}, defaulting to all tds", extra={"request": request, "status_code": response.status_code})
                return response

            department_tds = GroupTD.objects.filter(
                classlinktd__insa_class__link_depart=department_obj
            ).distinct()

            serialized_tds= [td.name for td in department_tds]
            department_tds = [tds for tds in serialized_tds if tds.startswith(department)]
            other_tds = [tds for tds in serialized_tds if not tds.startswith(department)]

            department_tds.sort()
            other_tds.sort()
            response = Response({"user_tds" : serialized_user_tds, "department_tds" : department_tds, "other_tds":other_tds})
            logger.info(f"Department {department} TDs fetched", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_tds" ,extra={"request": request, "status_code": response.status_code})
            return response

class PostTdsAPIView(APIView):
    """the api route class for saving the selected tds
    of the request user

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized data
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """the post route for saving the selected tds
        of the request user

        Args:
            request : the request associated with the call of this api

        Returns:
        response: the serialized success or failure
        """
        try:
            selected_tds = request.data.get('selected_tds', [])

            UserLinkTD.objects.filter(user=request.user.userprofile).delete()#remove previous selection

            user_link_tds = []

            for td_name in selected_tds:
                try:
                    td = GroupTD.objects.get(name=td_name)
                    user_link_tds.append(UserLinkTD(user=request.user.userprofile, name_td=td))
                except GroupTD.DoesNotExist:
                    continue  # Skip if GroupTD with this name doesn't exist

            UserLinkTD.objects.bulk_create(user_link_tds)

            response = Response({"success": "Sélection actualisée !"})
            logger.info("User updated TD selection", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at post_tds" ,extra={"request": request, "status_code": response.status_code})
            return response


class GetEvenementsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            evenements = InsaEvenement.objects.distinct()
            serializer = InsaEvenementSerializer(evenements, context={'request': request}, many=True)
            color_serializer = AssociationColoredEventSerializer(Association.objects.all(), context={'request': request}, many=False)
            response = Response({"events" : serializer.data, "colors" : color_serializer.data})
            logger.info("Fetched INSA events and association colors", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_evenements" ,extra={"request": request, "status_code": response.status_code})
            return response


class GetIsConnectedAPIView(APIView):
    """A small api route for the temporary solution
    for knowing if the user is connected or not

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized boolean
    """

    def get(self,request):
        """returns True if the user is authenticated else False"""
        try:
            response = Response(request.user.is_authenticated)
            logger.info("Checked user authentication", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_is_connected" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetIsAssociationPublisherAPIView(APIView):
    """A small api route for the temporary solution
    for knowing if the user is connected or not

    Args:
        APIView (class): the api class that is inherited by this route

    Returns:
        response: the serialized boolean
    """

    def get(self,request):
        """returns True if the user is authenticated else False"""
        try:
            response = Response(AssociationPublisher.objects.filter(user = request.user).exists())
            logger.info("Checked if user is an association publisher", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_is_association_publisher" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetEventsAPIView(APIView):
    """API route for visualizing the description of the events"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """returns a list of event descriptions"""
        try:
            events = [categorise(e.desc.name) for e in InsaClass.objects.all()]

            response = Response({"events" : events})
            logger.info("Categorised and returned INSA class events", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_events" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetIcsUrlAPIView(APIView):
    """Simple api route for returning the associated ics url of the user
    for calendars
    """
    def get(self, request):
        """"""
        try:
            response = Response(f"{request.get_host()}/ics/{request.user.userprofile.ics_uid}")
            logger.info("Returned ICS URL for user", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_ics_url" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetUserThemeAPIView(APIView):
    """return the user associated theme"""
    permission_classes = [IsAuthenticated]

    def get(self,request):
        """"""
        try:
            response = Response(request.user.userprofile.color_theme.name)
            logger.info("Returned user color theme", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_user_theme" ,extra={"request": request, "status_code": response.status_code})
            return response

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
                logger.info("User updated color theme", extra={"request": request, "status_code": response.status_code})
                return response
            else:
                response = Response({"error": "Theme n'existe pas"}, status = 400)
                logger.error(f"User tried to update with a non-existent theme : {theme}", extra={"request": request, "status_code": response.status_code})
                return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at post_user_theme" ,extra={"request": request, "status_code": response.status_code})
            return response

class GetEnumThemeAPIView(APIView):
    """return the themes"""
    permission_classes = [IsAuthenticated]

    def get(self,request):
        """"""
        try:
            themes = [theme.name for theme in EnumColorTheme.objects.all()]
            response = Response(themes)
            logger.info("Returned list of available color themes", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_enum_theme" ,extra={"request": request, "status_code": response.status_code})
            return response


class GetConfigFileAPIView(APIView):
    """API route for returning the list of available departments in the DB"""
    def get(self, request):
        """"""
        try:
            CONFIG = load_config()
            response = Response(CONFIG)
            logger.info("Returned configuration data", extra={"request": request, "status_code": response.status_code})
            return response
        except:
            response = Response({"error": "Internal server error"}, status = 500)
            logger.error("Internal server error at get_config_file" ,extra={"request": request, "status_code": response.status_code})
            return response


class PostUserColor(APIView):
    """Api view for posting the prefered color for an event title"""
    def post(self,request):
        """"""
        try:
            data = request.data
            field = UserColoredEvent.objects.get_or_create(user = request.user, title = Title.objects.filter(name = data["title"]).first())[0]
            field.color = data["color"]
            field.save()
            response = Response({'status': 'success'})
            logger.info("User colored event updated successfully", extra={"request": request, "status_code": response.status_code})
            return response
        except Exception as e:
            response = Response({'status': 'error', 'message': str(e)}, status=400)
            logger.error(f"Error updating user colored event: {str(e)}", extra={"request": request, "status_code": response.status_code})
            return response




class PostInsaEvenement(APIView):
    """post route for creating evenement"""
    permission_classes = [IsAuthenticated,IsAssociationPublisher]

    def post(self, request):
        """"""
        try:
            data = request.data

            # Récupération et conversion des données
            date = datetime.datetime.strptime(data['date'], '%Y-%m-%d').date()
            start_hour = datetime.datetime.combine(date, datetime.datetime.strptime(data['start_hour'], '%H:%M').time())
            end_hour = datetime.datetime.combine(date, datetime.datetime.strptime(data['end_hour'], '%H:%M').time())
            time_stamp = timezone.now()

            association = Association.objects.get(pk=(AssociationPublisher.objects.filter(user=request.user).first().association))

            InsaEvenement.objects.create(
                date=date,
                time_stamp=time_stamp,
                start_hour=start_hour,
                end_hour=end_hour,
                desc=Title.objects.get_or_create(name=data.get('title', ''))[0],
                associated_link=data.get('associated_link', ''),
                association=association,
                location=data.get('location', ''),
                info=data.get('info', ''),
            )

            response = Response({'status': 'success'})
            logger.info("Operation successful", extra={"request": request, "status_code": response.status_code})
            return response
        except Exception as e:
            response = Response({'status': 'error', 'message': str(e)}, status=400)
            logger.error(f"Error occurred: {str(e)}", extra={"request": request, "status_code": response.status_code})
            return response
