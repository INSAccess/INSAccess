from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required

from apis.utils import db_insertion, fetch
from apis.models import * 


@require_GET
@login_required
def get_tds(request):
    tds = GroupTD.objects.all()
    list_tds = [str(e.name) for e in tds]
    return JsonResponse({'tds': list_tds}, status = 200)

@require_GET
def test(request):
    list_of_records = fetch.fetch_entire_year("2024", "ITI", "3")
    db_insertion.insert_list_record(list_of_records)
    
    return HttpResponse("Hello, world. You're at the test page.")

