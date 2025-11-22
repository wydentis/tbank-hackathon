from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from .models import CustomUser, Fridge, FridgeItem

# Create your views here.

@api_view(['POST'])
def signup(request):
  pass

# @api_view(['GET'])
# def get_fridge_product_weight(request):
#   permission_classes = (IsAuthenticated,)
#   access_token_obj = AccessToken(str(request.auth))

#   user = CustomUser.objects.get(id=access_token_obj['user_id'])

#   fridge = Fridge.objects.get(user=user)
#   itemsWeights = fridge.total_weight_by_product()
#   return Response(itemsWeights[request.GET.get('product_name')])

@api_view(['GET'])
def get_all_fridge_weights(request):
  permission_classes = (IsAuthenticated,)
  access_token_obj = AccessToken(str(request.auth))

  user = CustomUser.objects.get(id=access_token_obj['user_id'])

  fridge = Fridge.objects.get(user=user)
  itemsWeights = fridge.total_weight_by_product()

  return Response(itemsWeights)