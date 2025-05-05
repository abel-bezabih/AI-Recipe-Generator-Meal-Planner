import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    RecipeAI
                </Typography>
                
                {user && (
                    <>
                        <Button color="inherit" component={Link} to="/">
                            Pantry
                        </Button>
                        <Button color="inherit" component={Link} to="/recipes">
                            Recipes
                        </Button>
                        <Button color="inherit" component={Link} to="/meal-planner">
                            Meal Planner
                        </Button>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}