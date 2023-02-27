def get_store_images_filepath(self, filename):
    return f"store_images/{self.media_pack.store.name}/{self.media_pack.created_at.strftime('%Y')}/{self.media_pack.created_at.strftime('%m')}/{self.media_pack.created_at.strftime('%d')}/{self.image}.png"
