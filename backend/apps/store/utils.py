def get_store_images_filepath(self, filename):
    return f"store_images/{str(self.media_pack.store.pk)}/{self.media_pack.created_at}.png"
