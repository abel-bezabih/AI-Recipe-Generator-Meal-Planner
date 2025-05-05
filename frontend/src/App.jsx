import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Register from './components/Register'
import Login from './components/Login'
import Pantry from './components/Pantry'
import RecipeSearch from './components/RecipeSearch'
import MealPlanner from './components/CalendarComponent'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Pantry />} />
          <Route path="/recipes" element={<RecipeSearch />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App