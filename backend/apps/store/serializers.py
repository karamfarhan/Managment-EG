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
        fields = ["id", "name", "created_by", "address", "description", "active_status", "start_at", "created_at"]
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
        fields = ["name", "address", "description", "active_status", "start_at"]
        # read_only_fields = ['id','slug','creatd_at','updated_at']

    def validate_name(self, value):
        if len(value) <= 1:
            raise serializers.ValidationError("name must be more than 2 letters")
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
        instance.description = validated_data.get("description", instance.description)
        instance.active_status = validated_data.get("active_status", instance.active_status)
        instance.start_at = validated_data.get("start_at", instance.start_at)
        instance.save()
        return instance


class MediaPackReadSerializer(serializers.ModelSerializer):
    # images = ImageSerializer(many=True)
    # company = serializers.SlugRelatedField(slug_field="slug", queryset=Company.objects.all())

    class Meta:
        model = MediaPack
        fields = (
            "store",
            "alt_text",
            "created_at",
            "created_by",
        )
        read_only_fields = fields

    # def get_created_by_username(self, invoice):
    #     return invoice.created_by.username

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

    # def update(self, instance, validated_data):
    #     instance.client_name = validated_data.get("client_name", instance.client_name)
    #     instance.client_email = validated_data.get("client_email", instance.client_email)
    #     instance.client_number = validated_data.get("client_number", instance.client_number)
    #     instance.client_address = validated_data.get("client_address", instance.client_address)
    #     instance.client_zipcode = validated_data.get("client_zipcode", instance.client_zipcode)

    #     instance.client_country = validated_data.get("client_country", instance.client_country)
    #     instance.client_city = validated_data.get("client_city", instance.client_city)
    #     instance.due_after = validated_data.get("due_after", instance.due_after)
    #     instance.email_is_sent = validated_data.get("email_is_sent", instance.email_is_sent)
    #     instance.status = validated_data.get("status", instance.status)
    #     instance.description = validated_data.get("description", instance.description)
    #     instance.discount_amount = validated_data.get("discount_amount", instance.discount_amount)
    #     instance.save()
    #     items_data = self.context["items"]
    #     if items_data:
    #         for item in items_data:
    #             item_id = item.get("id", None)
    #             if item_id:
    #                 item_obj = Item.objects.get(id=item_id)
    #                 delete_order = item.get("delete", False)
    #                 if delete_order:
    #                     item_obj.delete()
    #                 else:
    #                     item_obj.title = item.get("title", item_obj.title)
    #                     item_obj.quantity = item.get("quantity", item_obj.quantity)
    #                     item_obj.unit_price = item.get("unit_price", item_obj.unit_price)
    #                     item_obj.tax_rate = item.get("tax_rate", item_obj.tax_rate)
    #                     item_obj.net_amount = item.get("net_amount", item_obj.net_amount)
    #                     item_obj.save()
    #             else:
    #                 Item.objects.create(invoice=instance, **item)
    #     return instance
