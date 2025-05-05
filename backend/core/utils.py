# backend/core/utils.py
CATEGORY_MAPPING = {
    'produce': ['apple', 'banana', 'carrot', 'broccoli', 'tomato', 'garlic', 'onion'],
    'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
    'protein': ['chicken', 'beef', 'eggs', 'tofu'],
    'pantry': ['flour', 'sugar', 'salt', 'olive oil', 'soy sauce'],
    'bakery': ['bread', 'pasta', 'rice'],
    'other': []
}

def get_category(ingredient_name):
    ingredient = ingredient_name.lower()
    for category, items in CATEGORY_MAPPING.items():
        if ingredient in items:
            return category
    return 'other'

def parse_quantity(qty_str):
    """Convert quantity strings to numerical values"""
    try:
        cleaned = ''.join([c for c in str(qty_str) 
                          if c.isdigit() or c in ('.', ',')])
        cleaned = cleaned.replace(',', '.', 1)
        return float(cleaned) if cleaned else 1.0
    except (ValueError, TypeError):
        return 1.0