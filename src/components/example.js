import { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
  Box,
  Chip
} from '@mui/material';
import { Add, Remove, Delete, Save, Person, TableRestaurant } from '@mui/icons-material';
import localforage from 'localforage';

export default function EnhancedOrderSystem() {
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Sample categories
  const categories = ['All', 'Main Course', 'Appetizers', 'Beverages'];

  useEffect(() => {
    // Load menu items from storage
    localforage.getItem('menuItems').then(items => {
      if (!items) {
        // Default menu items with images
        const defaultItems = [
          { id: 1, name: 'Chicken Biryani', price: 25, category: 'Main Course', image: 'https://t4.ftcdn.net/jpg/05/17/96/89/360_F_517968988_hFHjQT6Flfksjx8n0KxfvMtP2tqlmGKk.jpg' },
          { id: 2, name: 'Beef Shawarma', price: 15, category: 'Main Course', image: 'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.jpg?s=2048x2048&w=is&k=20&c=uU0uuti6KOvpQhXuu6VMpgi021o1vZXfOhpMrJXSn1o=' },
          { id: 3, name: 'Falafel Plate', price: 18, category: 'Main Course', image: 'https://source.unsplash.com/random/300x300/?falafel' },
          { id: 4, name: 'Hummus', price: 10, category: 'Appetizers', image: 'https://source.unsplash.com/random/300x300/?hummus' },
          { id: 5, name: 'Mineral Water', price: 3, category: 'Beverages', image: 'https://source.unsplash.com/random/300x300/?water,bottle' },
          { id: 6, name: 'Fresh Juice', price: 12, category: 'Beverages', image: 'https://source.unsplash.com/random/300x300/?juice' },
        ];
        localforage.setItem('menuItems', defaultItems);
        setMenuItems(defaultItems);
      } else {
        setMenuItems(items);
      }
    });
  }, []);

  const filteredMenuItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const addToOrder = (item) => {
    setOrderItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromOrder = (id) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, change) => {
    setOrderItems(prev => 
      prev.map(item => {
        if (item.id !== id) return item;
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      })
    );
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.05; // UAE VAT is 5%
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const saveOrder = async () => {
    if (orderItems.length === 0) return;
    
    const order = {
      id: Date.now(),
      customerName,
      tableNumber,
      items: orderItems,
      date: new Date().toISOString(),
      ...calculateTotal()
    };

    // Save to history
    const history = await localforage.getItem('orderHistory') || [];
    await localforage.setItem('orderHistory', [...history, order]);
    
    // Reset current order
    setOrderItems([]);
    setCustomerName('');
    setTableNumber('');
    
    alert('Order saved successfully!');
  };

  const { subtotal, vat, total } = calculateTotal();

  return (
    <Box sx={{ p: 3 }}>

      <Grid container spacing={4}>
        {/* Menu Section */}
        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                Menu
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  {categories.map(category => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => setActiveCategory(category)}
                      variant={activeCategory === category ? 'filled' : 'outlined'}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {filteredMenuItems.map(item => (
                  <Grid item xs={12} sm={6} key={item.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}
                      elevation={2}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = `https://source.unsplash.com/random/300x300/?${item.name.split(' ').join(',')}`;
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.category}
                        </Typography>
                      </CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        bgcolor: 'background.paper'
                      }}>
                        <Typography variant="h6" color="primary">
                          AED {item.price.toFixed(2)}
                        </Typography>
                        <Button 
                          size="small" 
                          variant="contained"
                          onClick={() => addToOrder(item)}
                          startIcon={<Add />}
                        >
                          Add
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Order Section */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Current Order
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Table Number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  margin="normal"
                  InputProps={{
                    startAdornment: <TableRestaurant sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />
              </Box>
              
              {orderItems.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Your order is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add items from the menu
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">AED {item.price.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IconButton 
                                size="small" 
                                onClick={() => updateQuantity(item.id, -1)}
                                color="primary"
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <Typography variant="body1" sx={{ mx: 1 }}>
                                {item.quantity}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => updateQuantity(item.id, 1)}
                                color="primary"
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">AED {(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              onClick={() => removeFromOrder(item.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
            
            {/* Order Summary */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">AED {subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">VAT (5%):</Typography>
                  <Typography variant="body1">AED {vat.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">AED {total.toFixed(2)}</Typography>
                </Box>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={saveOrder}
                disabled={orderItems.length === 0}
                startIcon={<Save />}
                sx={{ 
                  py: 1.5,
                  fontWeight: 'bold',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4 }
                }}
              >
                Save Order
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}