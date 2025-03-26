from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import datetime

from apis.serializers import InsaClassSerializer
from apis.models import InsaClass, Department, GroupTD, UserLinkTD

class GetDayAPIView(APIView):
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

        classes = InsaClass.objects.filter(link_td__in=user_tds, date__range =[start_of_week, end_of_week]).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)


class GetMonthAPIView(APIView):
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

        classes = InsaClass.objects.filter(link_td__in=user_tds, date__range =[start_of_month, end_of_month]).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)


class GetYearAPIView(APIView):
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
        classes = InsaClass.objects.filter(link_td__in=user_tds, date__range =[start_of_year, end_of_year]).distinct()
        serializer = InsaClassSerializer(classes, context={'request': request}, many=True)
        return Response(serializer.data)


class GetTdsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, department):
        """Returns the Json of the user's td and the department td's 
        (or all of them if no department)
        
        """
        user_tds = request.user.userprofile.link_td.all()
        
        serialized_user_tds= [td.name for td in user_tds]

        department_obj = Department.objects.filter(name = department).first()
        if not department_obj:
            tds = GroupTD.objects.all()
            serialized_tds= [td.name for td in department_tds]
            return Response({"user_tds" : serialized_user_tds, "all_tds" : serialized_tds})
        
        department_tds = GroupTD.objects.filter(
            classlinktd__insa_class__link_depart=department_obj
        ).distinct()
                      
        serialized_tds= [td.name for td in department_tds]
        
        return Response({"user_tds" : serialized_user_tds, "department_tds" : serialized_tds})
        
class PostTdsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save the selected tds into the database for the current user
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

        return Response({"success": "Selections updated successfully."})
    

class GetIsConnectedAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        """returns True if the user is authenticated else False"""
        return Response(request.user.is_authenticated)
