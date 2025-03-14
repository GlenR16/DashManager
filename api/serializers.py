from rest_framework import serializers

from api.models import DataArray, DataPoint, Graph, Page, User, Team

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','name','password','is_staff','is_active','is_superuser','last_login','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'password': {'write_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'is_superuser': {'read_only': True},
            'last_login': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        _ = validated_data.pop('email', None)
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        instance.name = validated_data.pop('name', instance.name)
        instance.save()
        return instance

class TeamSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id','name','admin','invite_code','members','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'admin': {'read_only': True},
            'invite_code': {'read_only': True},
            'members': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

class DataPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPoint
        fields = ['id','data_array','object','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    
    
class DataArraySerializer(serializers.ModelSerializer):
    data_points = DataPointSerializer(many=True, read_only=True)

    class Meta:
        model = DataArray
        fields = ['id','graph','data_points','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        return instance

class GraphSerializer(serializers.ModelSerializer):
    data_arrays = DataArraySerializer(many=True, read_only=True)

    class Meta:
        model = Graph
        fields = ['id','title','description','page','is_enabled','type','size','order','meta','data_arrays','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def update(self, instance, validated_data):
        _ = validated_data.pop('page', None)
        return super().update(instance, validated_data)

class PageSerializerShort(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id','title','description','team','graphs','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def update(self, instance, validated_data):
        _ = validated_data.pop('team', None)
        instance.title = validated_data.pop('title', instance.title)
        instance.description = validated_data.pop('description', instance.description)
        instance.save()
        return instance


class PageSerializer(serializers.ModelSerializer):
    graphs = GraphSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = ['id','title','description','team','graphs','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        _ = validated_data.pop('team', None)
        instance.title = validated_data.pop('title', instance.title)
        instance.description = validated_data.pop('description', instance.description)
        instance.save()
        return instance
    