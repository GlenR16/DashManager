from rest_framework import serializers

from api.models import Comment, DataArray, DataPoint, Graph, Page, User, Team

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','name','password']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','name','is_staff','is_active','is_superuser','last_login','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'is_superuser': {'read_only': True},
            'last_login': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

class UserPasswordUpdateSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def update(self, instance, validated_data):
        if not instance.check_password(validated_data['old_password']):
            raise serializers.ValidationError("Old password is incorrect.")
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance

class TeamSerializer(serializers.ModelSerializer):
    admins = UserSerializer(many=True, read_only=True)
    members = UserSerializer(many=True, read_only=True)
    is_admin = serializers.SerializerMethodField()

    def get_is_admin(self, obj):
        return obj.admins.filter(pk=self.context['request'].user.pk).exists()

    class Meta:
        model = Team
        fields = ['id','name','admins','members','is_admin','invite_code','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'admins': {'read_only': True},
            'members': {'read_only': True},
            'invite_code': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id','user','graph','content','created_at','updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'user': {'read_only': True},
            'graph': {'read_only': True},
            'content': {'required': True},
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
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Graph
        fields = ['id','title','description','page','is_enabled','type','size','order','meta','data_arrays','comments','created_at','updated_at']
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
    