import datetime

from django.http import HttpResponse


class ModelViewSetExportBase:
    resource_class = None
    actions = ["export"]

    def export(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        resource = self.resource_class()
        dataset = resource.export(queryset)
        file_format = request.GET.get("file_format", "xls")
        ds = self.get_dataset_formatted(file_format=file_format, dataset=dataset)
        response = HttpResponse(ds, content_type=f"{file_format}")
        file_name = self.get_file_name()
        response["Content-Disposition"] = f"attachment; filename={file_name}.{file_format}"
        return response

    def get_dataset_formatted(self, *args, **kwargs):
        """
        This method will decide in what format will be the exported file

        right now it support (xls,csv,json)
        """
        dataset = kwargs.get("dataset")
        file_format = kwargs.get("file_format")
        print(file_format)
        if file_format == "xls":
            ds = dataset.xls
        elif file_format == "csv":
            ds = dataset.csv
        elif file_format == "json":
            ds = dataset.json
        else:
            ds = dataset.xls
        return ds

    # TODO customize the file name so that i can overwrite it from the viewset class
    def get_file_name(self, *args, **kwargs):
        """
        This method will return a recomended file name,

        based on the model name an other things
        """
        model = self.queryset.model
        verbose_name = model._meta.verbose_name
        return f"{verbose_name}-{datetime.date.today()}"
