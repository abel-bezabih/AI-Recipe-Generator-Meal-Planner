import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Button, MenuItem, Select, Typography, Box } from '@mui/material';
import axios from 'axios';

export default function MealPlanner() {
    const [events, setEvents] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMealType, setSelectedMealType] = useState('lunch');
    const [selectedRecipe, setSelectedRecipe] = useState('');

    // Load existing meal plans
    useEffect(() => {
        axios.get('http://localhost:8000/api/meal-plans/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }).then(res => {
            const formattedEvents = res.data.map(plan => ({
                title: plan.recipe.title,
                start: plan.date,
                extendedProps: {
                    mealType: plan.meal_type,
                    recipeId: plan.recipe.id
                }
            }));
            setEvents(formattedEvents);
        });
    }, []);

    // Load all recipes
    useEffect(() => {
        axios.get('http://localhost:8000/api/recipes/search/')
            .then(res => setRecipes(res.data));
    }, []);

    const handleDateSelect = (selectInfo) => {
        setSelectedDate(selectInfo.startStr);
    };

    const handleSubmit = async () => {
        await axios.post('http://localhost:8000/api/meal-plans/', {
            date: selectedDate,
            meal_type: selectedMealType,
            recipe_id: selectedRecipe
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });

        // Refresh events
        const newEvent = {
            title: recipes.find(r => r.id === selectedRecipe).title,
            start: selectedDate,
            extendedProps: {
                mealType: selectedMealType,
                recipeId: selectedRecipe
            }
        };
        setEvents([...events, newEvent]);
        setSelectedDate(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Meal Planner</Typography>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                selectable={true}
                select={handleDateSelect}
                height={650}
            />

            <Dialog open={Boolean(selectedDate)} onClose={() => setSelectedDate(null)}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Plan Meal for {new Date(selectedDate).toLocaleDateString()}
                    </Typography>
                    
                    <Select
                        value={selectedMealType}
                        onChange={(e) => setSelectedMealType(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="breakfast">Breakfast</MenuItem>
                        <MenuItem value="lunch">Lunch</MenuItem>
                        <MenuItem value="dinner">Dinner</MenuItem>
                    </Select>

                    <Select
                        value={selectedRecipe}
                        onChange={(e) => setSelectedRecipe(e.target.value)}
                        fullWidth
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>Select Recipe</MenuItem>
                        {recipes.map(recipe => (
                            <MenuItem key={recipe.id} value={recipe.id}>
                                {recipe.title}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button 
                        variant="contained" 
                        onClick={handleSubmit}
                        disabled={!selectedRecipe}
                    >
                        Add to Plan
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}