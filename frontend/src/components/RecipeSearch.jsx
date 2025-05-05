import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import axios from 'axios';
import { debounce } from 'lodash';

export default function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search function
  const debouncedSearch = debounce(async (term) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        'http://localhost:8000/api/recipes/search/', 
        {
          params: { q: term },
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      setRecipes(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Find Recipes by Ingredient
      </Typography>
      
      {/* Search Form */}
      <Paper component="form" onSubmit={handleSearch} sx={{ 
        p: 2, 
        mb: 3,
        display: 'flex',
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. garlic, chicken, pasta"
          InputProps={{
            sx: { height: 56 }
          }}
        />
        <Button 
          type="submit"
          variant="contained" 
          color="primary"
          sx={{ 
            height: 56,
            ml: 2,
            px: 4
          }}
          disabled={loading || !searchTerm.trim()}
        >
          Search
        </Button>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {!loading && recipes.length > 0 ? (
        <List sx={{ mt: 2 }}>
          {recipes.map(recipe => (
            <ListItem 
              key={recipe.id} 
              component={Paper} 
              sx={{ 
                mb: 2,
                p: 3,
                borderRadius: 2
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h5" component="div">
                    {recipe.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                      {recipe.instructions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Cooking time: {recipe.cooking_time} minutes
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        !loading && !error && searchTerm && (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 4,
            p: 4,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom>
              No recipes found
            </Typography>
            <Typography variant="body1">
              Try searching for "pasta", "chicken", or "salad"
            </Typography>
          </Box>
        )
      )}

      {/* Initial empty state */}
      {!loading && !error && !searchTerm && (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 4,
          p: 4
        }}>
          <Typography variant="h6" gutterBottom>
            Search for recipes by ingredient
          </Typography>
          <Typography variant="body1">
            What's in your pantry today?
          </Typography>
        </Box>
      )}
    </Box>
  );
}