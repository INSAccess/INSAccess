from django.http import HttpResponse
from django.views.decorators.http import require_GET, require_POST
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import datetime

from apis.serializers import GroupTDSerializer, InsaClassSerializer
from apis.utils import db_insertion, fetch
from apis.models import * 


@require_GET
def test(request):
    list_of_records = fetch.fetch_entire_year("2024", "ITI", "3")
    db_insertion.insert_list_record(list_of_records)
    
    return HttpResponse("Hello, world. You're at the test page.")


class GetDayAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, day):
        """Returns the Json for the given day (of the format YYYY-MM-DD)"""
        try:
            day_date = datetime.datetime.strptime(day, "%Y-%m-%d").date()
        except ValueError :
            return Response({"error": "Invalid date format"}, status = 400)

        user_tds = request.user.userprofile.link_td.all()
        if not user_tds:
            return Response({"error": "there is no user_tds associated with the user"}, status = 400)
        
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
        if not user_tds:
            return Response({"error": "there is no user_tds associated with the user"}, status = 400)
        
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
        if not user_tds:
            return Response({"error": "there is no user_tds associated with the user"}, status = 400)
        
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
        if not user_tds:
            return Response({"error": "there is no user_tds associated with the user"}, status = 400)
        
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
        # if not user_tds:
        #     return Response({"error": "there is no user_tds associated with the user"}, status = 400)
        
        serializer_user_tds= GroupTDSerializer(user_tds, many = True)

        department_obj = Department.objects.filter(name = department).first()
        if not department_obj:
            tds = GroupTD.objects.all()
            serializer_tds= GroupTDSerializer(department_tds, many = True)
            return Response({"user_tds" : serializer_user_tds.data, "all_tds" : serializer_tds.data})
        
        department_tds = GroupTD.objects.filter(
            classlinktd__insa_class__link_depart=department_obj
        ).distinct()
                      
        serializer_tds= GroupTDSerializer(department_tds, many = True)
        
        return Response({"user_tds" : serializer_user_tds.data, "department_tds" : serializer_tds.data})
        
class PostTdsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save the selected tds into the database for the current user
        """
        selected_tds = request.data.get('selected_tds', [])

        UserLinkTD.objects.filter(user=request.user).delete()#remove previous selection

        user_link_tds = []
        
        for td_name in selected_tds:
            try:
                td = GroupTD.objects.get(name=td_name)
                user_link_tds.append(UserLinkTD(user=request.user, name_td=td))
            except GroupTD.DoesNotExist:
                continue  # Skip if GroupTD with this name doesn't exist

        UserLinkTD.objects.bulk_create(user_link_tds)

        return Response({"success": "Selections updated successfully."})
    

class GetIsConnectedAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        """returns True if the user is authenticated else False"""
        return Response(request.user.is_authenticated)
