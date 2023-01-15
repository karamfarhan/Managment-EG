def get_certificate_image_filepath(self, filename):
    return f"employee_images/{self.name}-{self.id}/certificate/{self.certificate_image}.png"


def get_experience_image_filepath(self, filename):
    return f"employee_images/{self.name}-{self.id}/experience/{self.experience_image}.png"


def get_identity_image_filepath(self, filename):
    return f"employee_images/{self.name}-{self.id}/identity/{self.identity_image}.png"


def get_criminal_record_image_filepath(self, filename):
    return f"employee_images/{self.name}-{self.id}/criminal_record/{self.criminal_record_image}.png"
