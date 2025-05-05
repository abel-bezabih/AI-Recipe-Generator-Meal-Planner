import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { TextField, Button, List, ListItem, Typography, Box } from '@mui/material'

export default function Pantry() {
  const { user } = useAuth()
  const [pantryItems, setPantryItems] = useState([])
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:8000/api/pantry/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }).then(res => setPantryItems(res.data))
    }
  }, [user])

  const addItem = () => {
    axios.post('http://localhost:8000/api/pantry/', {
      name: newItem,
      quantity: 1
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then(res => setPantryItems([...pantryItems, res.data]))
    setNewItem('')
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>My Pantry</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="New Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={addItem}>Add</Button>
      </Box>
      <List>
        {pantryItems.map(item => (
          <ListItem key={item.id}>
            <Typography>{item.name} (Qty: {item.quantity})</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}