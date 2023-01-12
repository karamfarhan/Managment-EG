from apps.account.serializers import AccountRedSerializer
from apps.store.models import Image, MediaPack, Store
from rest_framework import serializers


class StoreSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ("name", "pk")
        read_only_fields = fields


class StoreSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField("get_username")

    class Meta:
        model = Store
        fields = ["id", "name", "created_by", "address", "description", "active_status", "start_at", "created_at"]
        read_only_fields = ["id", "created_by", "creatd_at"]

    def get_username(self, store):
        return store.created_by.username

    # def validate_name(self, value):
    #     if len(value) <= 1:
    #         raise serializers.ValidationError("name must be more than 2 letters")
    #     return value


class MediaPackSerializer(serializers.ModelSerializer):

    images = serializers.ListField(
        write_only=True, child=serializers.FileField(max_length=10000000, allow_empty_file=True, use_url=False)
    )
    store_name = serializers.SerializerMethodField("get_store_name")
    created_by = serializers.SerializerMethodField("get_username")

    class Meta:
        model = MediaPack
        # write_only_fields = ('store',)
        fields = ("store", "alt_text", "created_at", "created_by", "images", "store_name")
        read_only_fields = ["created_by", "creatd_at", "store_name"]

    def create(self, validated_data):
        images = validated_data.pop("images")
        media_pack = MediaPack.objects.create(**validated_data)
        for img in images:
            Image.objects.create(media_pack=media_pack, image=img)
        return media_pack

    def get_store_name(self, mediapack):
        return mediapack.store.address

    def get_username(self, mediapack):
        return mediapack.created_by.username


class ImageSerializer(serializers.ModelSerializer):
    media_pack = MediaPackSerializer()

    class Meta:
        model = Image
        fields = ("id", "image", "media_pack")
        read_only_fields = ("id",)
