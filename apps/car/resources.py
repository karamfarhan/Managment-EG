from itertools import chain

from import_export import resources
from import_export.fields import Field
from import_export.widgets import ForeignKeyWidget

from .models import Car, CarActivity, CarActivityRide


class CarResource(resources.ModelResource):
    driver = Field(attribute="driver__name", column_name="driver")

    class Meta:
        model = Car
        fields = ("id", "car_model", "car_type", "car_number", "driver", "last_maintain", "maintain_place", "note")
        export_order = fields


class CarActivityResource(resources.ModelResource):
    id = Field(attribute="id", column_name="Activity id")
    driver = Field(attribute="driver__name", column_name="driver")
    car = Field(attribute="car__car_model", column_name="car")
    rides = Field(column_name="rides")
    created_by = Field(attribute="created_by__username", column_name="created_by")

    class Meta:
        model = CarActivity
        fields = (
            "id",
            "car",
            "driver",
            "activity_date",
            "rides",
            "distance",
            "description",
            "created_by",
        )
        export_order = fields

    def dehydrate_rides(self, car_activity):
        rides = self.get_items_data(car_activity.rides.all())
        return str(rides)

    def get_items_data(self, items):
        data = []
        for item in items:
            data.append([item.place_from, item.place_to])
        return data
