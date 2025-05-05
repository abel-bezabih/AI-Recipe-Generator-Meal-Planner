from django.core.management.base import BaseCommand
from core.models import Recipe

SAMPLE_RECIPES = [
    {
        "title": "Vegetable Stir Fry",
        "ingredients": [
            {"name": "carrot", "quantity": "2 units"},
            {"name": "broccoli", "quantity": "1 head"},
            {"name": "soy sauce", "quantity": "50 ml"},
            {"name": "garlic", "quantity": "3 cloves"}
        ],
        "instructions": "1. Chop vegetables\n2. Stir fry in hot pan\n3. Add sauce",
        "cooking_time": 20
    },
    {
        "title": "Tomato Pasta",
        "ingredients": [
            {"name": "tomato", "quantity": "4 units"},
            {"name": "pasta", "quantity": "300 grams"},
            {"name": "garlic", "quantity": "2 cloves"},
            {"name": "olive oil", "quantity": "2 tbsp"}
        ],
        "instructions": "1. Cook pasta\n2. Make tomato sauce\n3. Combine",
        "cooking_time": 25
    },
    {
        "title": "Cheese Omelette",
        "ingredients": [
            {"name": "eggs", "quantity": "3 units"},
            {"name": "cheese", "quantity": "100 grams"},
            {"name": "butter", "quantity": "1 tbsp"}
        ],
        "instructions": "1. Beat eggs\n2. Melt butter in pan\n3. Cook eggs with cheese",
        "cooking_time": 10
    },
    {
        "title": "Pasta Carbonara",
        "ingredients": [
            {"name": "pasta", "quantity": "200 grams"},
            {"name": "eggs", "quantity": "2 units"},
            {"name": "cheese", "quantity": "50 grams"},
            {"name": "garlic", "quantity": "2 cloves"}
        ],
        "instructions": "1. Cook pasta\n2. Mix eggs and cheese\n3. Combine with hot pasta",
        "cooking_time": 30
    }
]

class Command(BaseCommand):
    help = 'Load sample recipes into database'

    def handle(self, *args, **options):
        for recipe_data in SAMPLE_RECIPES:
            Recipe.objects.get_or_create(
                title=recipe_data['title'],
                defaults=recipe_data
            )
        self.stdout.write(self.style.SUCCESS('Recipes loaded/verified'))