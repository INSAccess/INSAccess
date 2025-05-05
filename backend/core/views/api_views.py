import datetime
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core import signing

from core.serializers import InsaClassSerializer, InsaEvenementSerializer
from core.models import InsaClass, Department, GroupTD, UserLinkTD,InsaEvenement\
    ,EnumColorTheme,Association,AssociationPublisher
from core.utils.categorisation import categorise
from core.utils.fetch_ics import load_config
from core.permissions import IsAssociationPublisher

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
            return Response({"error": "Invalid date format"}, status = 400)

        user_tds = request.user.userprofile.link_td.all()

        classes = InsaClass.objects.filter(link_td__in=user_tds, date = day_date).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)

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
            return Response({"error": "Invalid date format"}, status = 400)

        start_of_week = day_date - datetime.timedelta(days=day_date.weekday())  # Monday
        end_of_week = start_of_week + datetime.timedelta(days=6)  # Sunday


        user_tds = request.user.userprofile.link_td.all()

        classes = InsaClass.objects.filter(link_td__in=user_tds,
                                           date__range =[start_of_week, end_of_week]).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)


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
            return Response({"error": "Invalid date format"}, status = 400)

        start_of_month = day_date.replace(day=1)  # First day of the month
        end_of_month = (start_of_month + datetime.timedelta(days=32)).replace(day=1)\
                                    - datetime.timedelta(days=1)  # Last day of the month


        user_tds = request.user.userprofile.link_td.all()

        classes = InsaClass.objects.filter(link_td__in=user_tds,
                                           date__range =[start_of_month, end_of_month]).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)


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
            return Response({"error": "Invalid date format"}, status = 400)

        start_of_year = day_date.replace(month=1,day=1)  # First day of the year
        end_of_year = (start_of_year + datetime.timedelta(days=400)).replace(day=1,month=1)\
                                    - datetime.timedelta(days=1)  # Last day of the year


        user_tds = request.user.userprofile.link_td.all()
        classes = InsaClass.objects.filter(link_td__in=user_tds,
                                           date__range =[start_of_year, end_of_year]).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)


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
        user_tds = request.user.userprofile.link_td.all()

        serialized_user_tds= [td.name for td in user_tds]

        department_obj = Department.objects.filter(name = department).first()
        if not department_obj:
            tds = GroupTD.objects.all()
            serialized_tds= [td.name for td in tds]
            return Response({"user_tds" : serialized_user_tds, "all_tds" : serialized_tds})

        department_tds = GroupTD.objects.filter(
            classlinktd__insa_class__link_depart=department_obj
        ).distinct()

        serialized_tds= [td.name for td in department_tds]
        department_tds = [tds for tds in serialized_tds if tds.startswith(department)]
        other_tds = [tds for tds in serialized_tds if not tds.startswith(department)]
        
        department_tds.sort()
        other_tds.sort()
        return Response({"user_tds" : serialized_user_tds, "department_tds" : department_tds, "other_tds":other_tds})

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

        return Response({"success": "Sélection actualisée !"})

class GetEvenementsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        evenements = InsaEvenement.objects.distinct()
        serializer = InsaEvenementSerializer(evenements, context={'request': request}, many=True)
        return Response(serializer.data)

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
        return Response(request.user.is_authenticated)

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
        return Response(AssociationPublisher.objects.filter(user = request.user).exists())

class GetEventsAPIView(APIView):
    """API route for visualizing the description of the events"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """returns a list of event descriptions"""
        events = [categorise(e.desc) for e in InsaClass.objects.all()]

        return Response({"events" : events})

class GetIcsUrlAPIView(APIView):
    """Simple api route for returning the associated ics url of the user 
    for calendars
    """
    def get(self, request):
        """"""
        return Response(f"{request.get_host()}/ics/{signing.dumps(request.user.id)}")

class GetUserThemeAPIView(APIView):
    """return the user associated theme"""
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        """"""
        return Response(request.user.userprofile.color_theme.name)
    
class PostUserThemeAPIView(APIView):
    """change the user associated theme"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """"""
        theme_name = request.data
        theme = EnumColorTheme.objects.filter(name=theme_name).first()
        if theme:
            request.user.userprofile.color_theme = theme
            request.user.userprofile.save()
            return Response({"success": "Theme actualisé !"})
        else:
            return Response({"error": "Theme n'existe pas"})

class GetEnumThemeAPIView(APIView):
    """return the themes"""
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        """"""
        return Response([theme.name for theme in EnumColorTheme.objects.all()])

class GetConfigFileAPIView(APIView):
    """API route for returning the list of available departments in the DB"""
    def get(self, request):
        """"""
        CONFIG = load_config()
        return Response(CONFIG)


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

            event = InsaEvenement.objects.create(
                date=date,
                time_stamp=time_stamp,
                start_hour=start_hour,
                end_hour=end_hour,
                desc=data.get('title', ''),
                associated_link=data.get('associated_link', ''),
                association=association,
                location=data.get('location', ''),
                info=data.get('info', ''),
            )

            return Response({'status': 'success', 'uid': event.uid})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)
