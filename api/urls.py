from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import DataArrayViewSet, DataPointViewSet, GraphViewSet, UserViewSet, UserPasswordUpdateView , TeamViewSet, TeamKeyFunctionalView, PageViewSet, TeamAdminsView, TeamMembersView

from api.views import StaticGraphSizeView, StaticGraphTypeView

urlpatterns = [
    # Token URLs
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    # User URLs
    path('user', UserViewSet.as_view({'post': 'create', 'get': 'retrieve', 'put': 'partial_update', 'delete': 'destroy'}), name='user'),
    path('user/password', UserPasswordUpdateView.as_view({'put': 'update'}), name='user_password'),
    # Team URLs
    path('team', TeamViewSet.as_view({'post': 'create', 'get': 'list'}), name='team'),
    path('team/<int:pk>', TeamViewSet.as_view({'get': 'retrieve', 'put': 'partial_update', 'delete': 'destroy'}), name='team_detail'),
    path('team/admins', TeamAdminsView.as_view(), name='team_admins'),
    path('team/members', TeamMembersView.as_view(), name='team_members'),
    path('team/key/functions', TeamKeyFunctionalView.as_view(), name='team_key_functions'),
    # Page URLs
    path('page', PageViewSet.as_view({'post': 'create'}), name='page'),
    path('team/<int:pk>/pages', PageViewSet.as_view({'get': 'list'}), name='team_pages'),
    path('page/<int:pk>', PageViewSet.as_view({'get': 'retrieve', 'put': 'partial_update', 'delete': 'destroy'}), name='page_detail'),
    # Graph URLs
    path('graph', GraphViewSet.as_view({'post': 'create'}), name='graph'),
    path('graph/<int:pk>', GraphViewSet.as_view({'get': 'retrieve', 'put': 'partial_update', 'delete': 'destroy'}), name='graph_detail'),
    # DataArray URLs
    path('data_array', DataArrayViewSet.as_view({'post': 'create'}), name='graph_data_arrays'),
    path('data_array/<int:pk>', DataArrayViewSet.as_view({'put': 'partial_update', 'delete': 'destroy'}), name='data_array_detail'),
    # DataPoint URLs
    path('data_point', DataPointViewSet.as_view({'post': 'create'}), name='data_array_data_points'),
    path('data_point/<int:pk>', DataPointViewSet.as_view({'put': 'partial_update', 'delete': 'destroy'}), name='data_point_detail'),

    # Static views
    path('meta/graph/types', StaticGraphTypeView.as_view(), name='static_graph_types'),
    path('meta/graph/sizes', StaticGraphSizeView.as_view(), name='static_graph_sizes'),
]
