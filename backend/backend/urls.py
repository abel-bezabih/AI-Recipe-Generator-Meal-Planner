from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'api/meal-plans', views.MealPlanViewSet, basename='mealplan')

urlpatterns = [
    path('api/auth/register/', views.UserCreate.as_view()),
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/pantry/', views.PantryItemList.as_view()),
    path('api/recipes/search/', views.recipe_search),
    path('', include(router.urls)),
]