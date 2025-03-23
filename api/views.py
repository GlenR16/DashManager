from rest_framework.viewsets import GenericViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import  AllowAny,IsAuthenticated
from rest_framework import mixins

from api.models import Comment, DataArray, DataPoint, Graph, Page, Team, generate_invite_code
from api.permissions import IsDataArrayAdmin, IsDataPointAdmin, IsGraphAdmin, IsPageAdmin, IsTeamAdmin
from api.serializers import CommentSerializer, DataArraySerializer, DataPointSerializer, GraphSerializer, PageSerializer, PageSerializerShort, TeamSerializer, UserSerializer, UserCreateSerializer, UserPasswordUpdateSerializer

# Create your views here.
class UserViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'options' :
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_object(self):
        return self.request.user
    
class UserPasswordUpdateView(mixins.UpdateModelMixin,GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserPasswordUpdateSerializer

    def get_object(self):
        return self.request.user

class TeamViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,mixins.ListModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = TeamSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'list' or self.action == 'retrieve' or self.action == 'options' :
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeamAdmin() ]

    def get_queryset(self):
        return Team.objects.filter(members=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(admins=[self.request.user], members=[self.request.user])


class TeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.all()
    
    def post(self, request, *args, **kwargs):
        if 'invite_code' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"invite_code": ["This field is required"]})
        invite_code = request.data.get('invite_code')
        team = self.get_queryset().filter(invite_code=invite_code).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"invite_code": ["Invalid invite code."]})
        team.members.add(request.user)
        return Response(status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        if 'team' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"team": ["This field is required"]})
        pk = request.data.get('team')
        team = self.get_queryset().filter(pk=pk).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"team": ["Invalid team id."]})
        if team.members.filter(pk=request.user.pk).exists():
            team.members.remove(request.user)
        if team.admins.filter(pk=request.user.pk).exists():
            team.admins.remove(request.user)
        return Response(status=status.HTTP_200_OK)
            
class TeamAdminsView(APIView):
    permission_classes = [IsAuthenticated, IsTeamAdmin]

    def get_queryset(self):
        return Team.objects.filter(admins=self.request.user)
    
    def post(self, request, *args, **kwargs):
        if 'user' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"user": ["This field is required"]})
        if 'team' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"team": ["This field is required"]})
        team_pk = request.data.get('team')
        team = self.get_queryset().filter(pk=team_pk).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"team": ["Invalid team id."]})
        user_pk = request.data.get('user')
        user = team.members.filter(pk=user_pk).first()
        if user is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"user": ["Invalid user id."]})
        team.admins.add(user)
        return Response(status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        if 'user' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"user": ["This field is required"]})
        if 'team' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"team": ["This field is required"]})
        team_pk = request.data.get('team')
        team = self.get_queryset().filter(pk=team_pk).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"team": ["Invalid team id."]})
        user_pk = request.data.get('user')
        user = team.admins.filter(pk=user_pk).first()
        if user is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"user": ["Invalid user id."]})
        team.admins.remove(user)
        return Response(status=status.HTTP_200_OK)

class TeamKeyFunctionalView(APIView):
    permission_classes = [IsAuthenticated, IsTeamAdmin]

    def get_queryset(self):
        return Team.objects.filter(admins=self.request.user)
        
    def post(self, request, *args, **kwargs):
        if 'id' not in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"id": ["This field is required"]})
        pk = request.data.get('id')
        team = self.get_queryset().filter(pk=pk).first()
        if team is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"id": ["Invalid team id."]})
        team.invite_code = generate_invite_code()
        team.save()
        return Response(status=status.HTTP_200_OK)


class PageViewSet(mixins.CreateModelMixin,mixins.RetrieveModelMixin,mixins.ListModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = PageSerializer

    def get_queryset(self):
        return Page.objects.filter(team__members=self.request.user)
    
    def get_permissions(self):
        if self.action == 'create' or self.action == 'list' or self.action == 'options' :
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsPageAdmin()]
    
    def list(self, request, *args, **kwargs):
        team_pk = kwargs.get('pk')
        pages = self.get_queryset().filter(team__pk=team_pk)
        serializer = self.get_serializer(pages, many=True)
        return Response(serializer.data)
    
class GraphViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin, mixins.RetrieveModelMixin,GenericViewSet):
    serializer_class = GraphSerializer

    def get_queryset(self):
        return Graph.objects.filter(page__team__members=self.request.user)
    
    def get_permissions(self):
        if self.action == 'create' or self.action == 'options' :
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsGraphAdmin() ]
    
class DataArrayViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = DataArraySerializer
    permission_classes = [IsAuthenticated, IsDataArrayAdmin]

    def get_queryset(self):
        return DataArray.objects.filter(graph__page__team__members=self.request.user)
    
class DataPointViewSet(mixins.CreateModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = DataPointSerializer
    permission_classes = [IsAuthenticated, IsDataPointAdmin]

    def get_queryset(self):
        return DataPoint.objects.filter(data_array__graph__page__team__members=self.request.user)
    
class CommentViewSet(mixins.CreateModelMixin,mixins.DestroyModelMixin,GenericViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(graph__page__team__members=self.request.user, user=self.request.user)
    
    def perform_create(self, serializer):
        graph = Graph.objects.filter(pk=self.kwargs.get('pk', None)).first()
        if graph is None or not graph.page.team.members.filter(pk=self.request.user.pk).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"graph": ["Invalid graph id."]})
        serializer.save(user=self.request.user, graph=graph)

    def get_object(self):
        return self.get_queryset().filter(pk=self.kwargs.get('pk', None)).first()

class StaticGraphTypeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK, data=Graph.TYPE_CHOICES)
    
class StaticGraphSizeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(status=status.HTTP_200_OK, data=Graph.SIZE_CHOICES)
