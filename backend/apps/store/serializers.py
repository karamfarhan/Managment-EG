from apps.account.serializers import AccountRedSerializer
from apps.store.models import Image, MediaPack, Store
from rest_framework import serializers


# from account.serializers import AccountProfileSerilizers
class StoreReadSerializer(serializers.ModelSerializer):
    # avatar = serializers.SerializerMethodField("validate_avatar_url")
    # author = AccountProfileSerilizers(read_only=True)
    created_by = AccountRedSerializer()

    class Meta:
        model = Store
        fields = ["id", "name", "created_by", "address",
                  "description", "active_status", "start_at", "created_at"]
        read_only_fields = fields

    # def validate_avatar_url(self, company):
    #     request = self.context["request"]
    #     avatar = company.avatar.url
    #     return request.build_absolute_uri(avatar)


class StoreSelectBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ("name", "pk")
        read_only_fields = fields


class StoreWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ["name", "address", "description",
                  "active_status", "start_at"]
        # read_only_fields = ['id','slug','creatd_at','updated_at']

    def validate_name(self, value):
        if len(value) <= 1:
            raise serializers.ValidationError(
                "name must be more than 2 letters")
        return value

    def create(self, validated_data):
        try:
            store = Store.objects.create(
                **validated_data
                # created_by=validated_data["created_by"],
                # name=validated_data["name"],
                # address=validated_data["address"],
                # is_active=validated_data.get("is_active"),
                # description=validated_data.get("description", "No description"),
                # start_at=validated_data.get("start_at"),
            )
        except serializers.ValidationError:
            raise serializers.ValidationError("Invalid data")

        return store

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.address = validated_data.get("address", instance.address)
        instance.description = validated_data.get(
            "description", instance.description)
        instance.active_status = validated_data.get(
            "active_status", instance.active_status)
        instance.start_at = validated_data.get("start_at", instance.start_at)
        instance.save()
        return instance


class MediaPackReadSerializer(serializers.ModelSerializer):
    # images = ImageSerializer(many=True)
    # company = serializers.SlugRelatedField(slug_field="slug", queryset=Company.objects.all())
    store = serializers.SerializerMethodField('get_store_name')
    created_by = serializers.SerializerMethodField('get_username')

    class Meta:
        model = MediaPack
        fields = (
            "store",
            "alt_text",
            "created_at",
            "created_by",
        )
        read_only_fields = fields

    def get_store_name(self, mediapack):
        return mediapack.store.address

    def get_username(self, mediapack):
        return mediapack.created_by.username

    # def get_modified_by_username(self, invoice):
    #     return invoice.modified_by.username

    # def get_created_at_date_formatted(self, invoice):
    #     return invoice.created_at.strftime("%d.%m.%Y")

    # def get_updated_at_date_formatted(self, invoice):
    #     return invoice.updated_at.strftime("%d.%m.%Y")

    # def get_net_amount(self, invoice):
    #     return invoice.get_gross_amount() - invoice.discount_amount


class ImageSerializer(serializers.ModelSerializer):
    media_pack = MediaPackReadSerializer()

    class Meta:
        model = Image
        fields = ("id", "image", "media_pack")
        read_only_fields = ("id",)


class MediaPackWriteSerializer(serializers.ModelSerializer):

    images = serializers.ListField(
        write_only=True, child=serializers.FileField(max_length=10000000, allow_empty_file=True, use_url=False)
    )

    class Meta:
        model = MediaPack
        fields = ("store", "alt_text", "created_at", "created_by", "images")

    def create(self, validated_data):
        images = validated_data.pop("images")
        media_pack = MediaPack.objects.create(**validated_data)
        for img in images:
            Image.objects.create(media_pack=media_pack, image=img)
        return media_pack
