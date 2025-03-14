import os
from turtle import update
from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils.translation import gettext_lazy as _

from api.managers import UserManager

def generate_invite_code():
    return str(os.urandom(15).hex()[:8]).upper()

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("Email"),unique=True)
    name = models.CharField(_("Name"),max_length=255)

    is_staff = models.BooleanField(_("Is staff account"),default=False)
    is_active = models.BooleanField(_("Is active account"),default=True)

    last_login = models.DateTimeField(_("Last Login"),null=True)

    created_at = models.DateTimeField(_("Created At"),auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"),auto_now=True)
    
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name
    
class Team(models.Model):
    name = models.CharField(_("Name"),max_length=255)
    admin = models.ForeignKey(User,on_delete=models.SET_NULL,related_name="owned_teams",null=True)
    invite_code = models.CharField(_("Invite Code"),max_length=31,default=generate_invite_code,unique=True)
    members = models.ManyToManyField(User,related_name="member_in_teams")

    created_at = models.DateTimeField(_("Created At"),auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"),auto_now=True)

    def __str__(self):
        return self.name

class Page(models.Model):
    title = models.CharField(_("Title"),max_length=255)
    description = models.TextField(_("Description"))
    team = models.ForeignKey(Team,on_delete=models.CASCADE,related_name="pages")

    created_at = models.DateTimeField(_("Created At"),auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"),auto_now=True)

    def __str__(self):
        return self.title

class Graph(models.Model):
    LINE_CHART = "LINE_CHART"
    BAR_CHART = "BAR_CHART"
    PIE_CHART = "PIE_CHART"

    NORMAL = "NORMAL"
    FULL = "FULL"

    SIZE_CHOICES = [
        (NORMAL,_("Normal")),
        (FULL,_("Full")),
    ]

    TYPE_CHOICES = [
        (LINE_CHART,_("Line Chart")),
        (BAR_CHART,_("Bar Chart")),
        (PIE_CHART,_("Pie Chart")),
    ]

    title = models.CharField(_("Title"),max_length=255)
    description = models.TextField(_("Description"))
    page = models.ForeignKey(Page,on_delete=models.CASCADE,related_name="graphs")
    is_enabled = models.BooleanField(_("Is Enabled"),default=True)
    type = models.CharField(_("Type"),max_length=31,choices=TYPE_CHOICES,default=LINE_CHART)
    size = models.CharField(_("Size"),max_length=31,choices=SIZE_CHOICES,default=NORMAL)
    order = models.IntegerField(_("Order"),default=0)
    meta = models.JSONField(_("Meta"),null=True,blank=True,default=dict)

    created_at = models.DateTimeField(_("Created At"),auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"),auto_now=True)

    def __str__(self):
        return self.title

class DataArray(models.Model):
    graph = models.ForeignKey(Graph,on_delete=models.CASCADE,related_name="data_arrays")

    created_at = models.DateTimeField(_("Created At"),auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"),auto_now=True)

    def __str__(self):
        return f"Data Array for {self.graph.title}"

class DataPoint(models.Model):
    data_array = models.ForeignKey(DataArray,on_delete=models.CASCADE,related_name="data_points")
    object = models.JSONField(_("Object"))

    created_at = models.DateTimeField(_("Created At"),auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"),auto_now=True)

    def __str__(self):
        return f"Data Point for {self.data_array.graph.title}"