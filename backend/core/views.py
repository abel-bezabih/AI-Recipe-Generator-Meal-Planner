from django.utils import timezone
from rest_framework import generics, permissions, viewsets
from django.contrib.auth.models import User
from .models import PantryItem, Recipe, MealPlan
from .serializers import UserSerializer, PantryItemSerializer, RecipeSerializer, MealPlanSerializer
from django.contrib.postgres.search import SearchVector
from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from .utils import get_category, parse_quantity
from django.contrib.postgres.search import SearchVector, SearchQuery
from django.db.models import Q, F, TextField
from django.db.models.expressions import Value
from django.db.models.functions import Cast

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class PantryItemList(generics.ListCreateAPIView):
    serializer_class = PantryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PantryItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def recipe_search(request):
    search_term = request.query_params.get('q', '').lower()
    
    # Simple and effective JSON field query
    recipes = Recipe.objects.filter(
        ingredients__contains=[{'name': search_term}]
    ).distinct()
    
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


class MealPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
def generate_grocery_list(request):
    # Get date range from query params
    start_date = request.query_params.get('start', timezone.now().date().isoformat())
    end_date = request.query_params.get('end', (timezone.now() + timezone.timedelta(days=7)).isoformat())
    
    # 1. Get meal plans in date range
    meal_plans = MealPlan.objects.filter(
        user=request.user,
        date__gte=start_date,
        date__lte=end_date
    ).select_related('recipe')
    
    # 2. Aggregate ingredients from recipes
    ingredient_map = defaultdict(float)
    for plan in meal_plans:
        for ingredient in plan.recipe.ingredients:
            # Convert "2 cups" → 2, "100g" → 100
            quantity = parse_quantity(ingredient.get('quantity', '1'))
            ingredient_name = ingredient['name'].lower()
            ingredient_map[ingredient_name] += quantity
    
    # 3. Subtract pantry items
    pantry_items = PantryItem.objects.filter(user=request.user)
    for item in pantry_items:
        item_name = item.name.lower()
        if item_name in ingredient_map:
            # Don't need more than what's already in pantry
            ingredient_map[item_name] = max(
                0, 
                ingredient_map[item_name] - item.quantity
            )
    
    # 4. Remove zero-quantity items
    ingredient_map = {
        k: v for k, v in ingredient_map.items() 
        if v > 0
    }
    
    # 5. Categorize ingredients (NEW CODE)
    categorized_list = defaultdict(list)
    for name, quantity in ingredient_map.items():
        category = get_category(name)
        categorized_list[category].append({
            "name": name.title(),
            "quantity": f"{quantity} units"
        })
    
    # 6. Order categories
    category_order = ['produce', 'dairy', 'protein', 'pantry', 'bakery', 'other']
    ordered_list = [
        {"category": cat, "items": categorized_list[cat]} 
        for cat in category_order if categorized_list[cat]
    ]
    
    return Response({"grocery_list": ordered_list})