import { 
    List, 
    ListItem, 
    ListItemText, 
    ListSubheader,
    Chip,
    Box
} from '@mui/material';

// Update the rendering part:
<List dense={false}>
    {groceryList.map((categoryGroup) => (
        <li key={categoryGroup.category}>
            <ul style={{ padding: 0 }}>
                <ListSubheader sx={{ 
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    color: 'primary.main',
                    borderRadius: 1,
                    mb: 1
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 1
                    }}>
                        {categoryGroup.category.toUpperCase()}
                        <Chip 
                            label={categoryGroup.items.length} 
                            size="small" 
                            color="primary"
                        />
                    </Box>
                </ListSubheader>
                
                {categoryGroup.items.map((item, index) => (
                    <ListItem key={index} sx={{ pl: 4 }}>
                        <ListItemText
                            primary={item.name}
                            secondary={`Quantity Needed: ${item.quantity}`}
                        />
                    </ListItem>
                ))}
            </ul>
        </li>
    ))}
</List>