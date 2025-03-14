from django.contrib import admin
from api.models import DataArray, DataPoint, Graph, Page, Team, User

# Register your models here.
admin.site.register(DataArray)
admin.site.register(DataPoint)
admin.site.register(Graph)
admin.site.register(Page)
admin.site.register(Team)
admin.site.register(User)
