from django.shortcuts import get_object_or_404
from requests import delete
from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import  AllowAny,IsAuthenticated
from rest_framework import mixins

from api.models import DataArray, DataPoint, Graph, Page, Team, User, generate_invite_code
from api.serializers import DataArraySerializer, DataPointSerializer, GraphSerializer, PageSerializer, PageSerializerShort, TeamSerializer, UserSerializer

# Create your views here.
class UserViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'options' :
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_object(self):
        return self.request.user

class TeamViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,mixins.ListModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (self.request.user.owned_teams.all() | self.request.user.member_in_teams.all()).distinct()
    
    def perform_create(self, serializer):
        serializer.save(admin=self.request.user, members=[self.request.user])


class TeamFunctionalView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (self.request.user.owned_teams.all() | self.request.user.member_in_teams.all()).distinct()
    
    def post(self, request, *args, **kwargs):
        if 'invite_code' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"invite_code": ["This field is required."]})
        invite_code = request.data.get('invite_code')
        team = Team.objects.filter(invite_code=invite_code).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"invite_code": ["Invalid invite code."]})
        team.members.add(request.user)
        return Response(status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        if 'id' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"id": ["This field is required"]})
        pk = request.data.get('id')
        team = self.get_queryset().filter(pk=pk).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"id": ["Invalid team id."]})
        if team.admin != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if 'admin' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"admin": ["This field is required"]})
        admin = get_object_or_404(User, pk=request.data.get('admin'))
        team.admin = admin
        team.save()
        return Response(status=status.HTTP_200_OK)

class TeamKeyFunctionalView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (self.request.user.owned_teams.all() | self.request.user.member_in_teams.all()).distinct()
    
        
    def post(self, request, *args, **kwargs):
        if 'id' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"id": ["This field is required"]})
        pk = request.data.get('id')
        team = self.get_queryset().filter(pk=pk).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"id": ["Invalid team id."]})
        if team.admin != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        team.invite_code = generate_invite_code()
        team.save()
        return Response(status=status.HTTP_200_OK)


class PageViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,mixins.ListModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = PageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (Page.objects.filter(team__members=self.request.user) | Page.objects.filter(team__admin=self.request.user)).distinct()
    
    def list(self, request, *args, **kwargs):
        team_pk = kwargs.get('pk')
        pages = self.get_queryset().filter(team__pk=team_pk)
        serializer = self.get_serializer(pages, many=True)
        return Response(serializer.data)
    
class GraphViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin, mixins.RetrieveModelMixin,GenericViewSet):
    serializer_class = GraphSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (Graph.objects.filter(page__team__members=self.request.user) | Graph.objects.filter(page__team__admin=self.request.user)).distinct()
    
class DataArrayViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = DataArraySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (DataArray.objects.filter(graph__page__team__members=self.request.user) | DataArray.objects.filter(graph__page__team__admin=self.request.user)).distinct()
    
class DataPointViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = DataPointSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (DataPoint.objects.filter(data_array__graph__page__team__members=self.request.user) | DataPoint.objects.filter(data_array__graph__page__team__admin=self.request.user)).distinct()
    
class StaticGraphTypeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK, data=Graph.TYPE_CHOICES)
    
class StaticGraphSizeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK, data=Graph.SIZE_CHOICES)
