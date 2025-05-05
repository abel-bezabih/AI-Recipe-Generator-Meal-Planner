from django.db import models
from django.contrib.auth.models import User

class PantryItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    expiry_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.quantity})"
    
class Recipe(models.Model):
    title = models.CharField(max_length=200, unique=True)
    ingredients = models.JSONField()
    instructions = models.TextField()
    cooking_time = models.PositiveIntegerField(help_text="Time in minutes")
    dietary_tags = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.title

class MealPlan(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'date', 'meal_type')

