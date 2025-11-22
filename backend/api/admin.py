from django.contrib import admin
from .models import CustomUser, Product, Fridge, FridgeItem

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(Fridge)
admin.site.register(FridgeItem)