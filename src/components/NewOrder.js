
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import at the top
import Invoice from './Invoice';

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
  Chip,
  Fade,
  Zoom,
  CircularProgress,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add, 
  Remove, 
  Delete, 
  Save, 
  Person, 
  TableRestaurant, 
  Restaurant, 
  ShoppingCart,
  Print as PrintIcon,
  Category, // Add this line

} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import localforage from 'localforage';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Receipt from '@mui/icons-material/Receipt';
// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10],
  },
  borderRadius: 12,
  overflow: 'hidden',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 50,
  fontWeight: 'bold',
  textTransform: 'none',
  paddingLeft: 16,
  paddingRight: 16,
  color:'#fff',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: `0px 6px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
    transform: 'translateY(-2px)',
  }
}));

const MenuContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundImage: 'linear-gradient(to bottom right, #f3f6f9, #ffffff)',
  borderRadius: 16,
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  height: '100%',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '4px',
  },
}));

const CategoryChip = styled(Chip)(({ theme, active }) => ({
  borderRadius: 8,
  fontWeight: 600,
  padding: '0 8px',
  transition: 'all 0.2s',
  ...(active && {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[2],
  })
}));

const PriceTag = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  borderRadius: 16,
  padding: '4px 12px',
  fontWeight: 'bold',
  display: 'inline-flex',
  alignItems: 'center',
}));

export default function EnhancedOrderSystem() {
  const [savedOrder, setSavedOrder] = useState(null);
const [showInvoice, setShowInvoice] = useState(false);
const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const categories = ['All', 'Main Course', 'Appetizers', 'Beverages', 'Desserts'];

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    setTimeout(() => {
      localforage.getItem('menuItems').then(items => {
        if (!items) {
          // const defaultItems = [
          //   { 
          //     id: 1, 
          //     name: 'Chicken Biryani', 
          //     price: 25, 
          //     category: 'Main Course', 
          //     image: 'https://t4.ftcdn.net/jpg/05/17/96/89/360_F_517968988_hFHjQT6Flfksjx8n0KxfvMtP2tqlmGKk.jpg',
          //     description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices'
          //   },
          //   { 
          //     id: 2, 
          //     name: 'Beef Shawarma', 
          //     price: 15, 
          //     category: 'Main Course', 
          //     image: 'https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.jpg?s=2048x2048&w=is&k=20&c=uU0uuti6KOvpQhXuu6VMpgi021o1vZXfOhpMrJXSn1o=',
          //     description: 'Thinly sliced marinated beef wrapped in fresh pita with tahini sauce'
          //   },
          //   { 
          //     id: 3, 
          //     name: 'Falafel Plate', 
          //     price: 18, 
          //     category: 'Main Course', 
          //     image: 'https://toriavey.com/images/2011/01/TOA109_18-1.jpeg',
          //     description: 'Crispy chickpea patties served with hummus, pita and fresh salad'
          //   },
          //   { 
          //     id: 4, 
          //     name: 'Hummus', 
          //     price: 10, 
          //     category: 'Appetizers', 
          //     image: 'https://www.inspiredtaste.net/wp-content/uploads/2019/07/The-Best-Homemade-Hummus-Recipe-1200.jpg',
          //     description: 'Creamy chickpea dip with tahini, olive oil and warm pita bread'
          //   },
          //   { 
          //     id: 5, 
          //     name: 'Mango Lassi', 
          //     price: 8, 
          //     category: 'Beverages', 
          //     image: 'https://www.cookwithmanali.com/wp-content/uploads/2014/09/Mango-Lassi-Recipe.jpg',
          //     description: 'Refreshing yogurt drink blended with sweet mango and cardamom'
          //   },
          //   { 
          //     id: 6, 
          //     name: 'Baklava', 
          //     price: 12, 
          //     category: 'Desserts', 
          //     image: 'https://www.thespruceeats.com/thmb/vJUFf6L4p8yvLesU00sEPPKUNA0=/4288x2848/filters:fill(auto,1)/baklava-recipe-with-walnuts-3377690-hero-01-7b0b782e549841b19de92b8c7a8a4450.jpg',
          //     description: 'Layers of flaky phyllo pastry filled with nuts and soaked in honey syrup'
          //   },
          //   { 
          //     id: 7, 
          //     name: 'Fattoush Salad', 
          //     price: 14, 
          //     category: 'Appetizers', 
          //     image: 'https://feelgoodfoodie.net/wp-content/uploads/2018/07/Fattoush-Salad-11.jpg',
          //     description: 'Fresh vegetables with toasted pita chips, sumac and pomegranate molasses'
          //   },
          //   { 
          //     id: 8, 
          //     name: 'Turkish Coffee', 
          //     price: 6, 
          //     category: 'Beverages', 
          //     image: 'https://peasandcrayons.com/wp-content/uploads/2020/10/homemade-turkish-coffee-recipe-5.jpg',
          //     description: 'Strong, unfiltered coffee with cardamom served in a traditional copper pot'
          //   }
          // ];
          // localforage.setItem('menuItems', defaultItems);
          // setMenuItems(defaultItems);
        } else {
          setMenuItems(items);
        }
        setLoading(false);
      });
    }, 800); // Artificial delay for loading effect
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
        setSnackbar({
          open: true,
          message: `${item.name} added to your order`,
          severity: 'success'
        });
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromOrder = (id) => {
    setOrderItems(prev => {
      const item = prev.find(i => i.id === id);
      setSnackbar({
        open: true,
        message: `${item.name} removed from your order`,
        severity: 'info'
      });
      return prev.filter(item => item.id !== id);
    });
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
    const vat = subtotal * 0.05;
    const serviceCharge = subtotal * 0.10;
    const total = subtotal + vat + serviceCharge;
    return { subtotal, vat, serviceCharge, total };
  };

  const saveOrder = async (viewInvoiceAfterSave = false) => {
    if (orderItems.length === 0) return;
    
    setLoading(true);
    
    const order = {
      id: Date.now(),
      customerName: customerName || 'Guest',
      tableNumber: tableNumber || 'Takeaway',
      items: orderItems,
      date: new Date().toISOString(),
      ...calculateTotal()
    };
  
    setTimeout(async () => {
      const history = await localforage.getItem('orderHistory') || [];
      await localforage.setItem('orderHistory', [...history, order]);
      
      setOrderItems([]);
      setCustomerName('');
      setTableNumber('');
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Order saved successfully!',
        severity: 'success'
      });
  
      setSavedOrder(order);
      if (viewInvoiceAfterSave) {
        setShowInvoice(true);
      }
    }, 1000);
  };
  const handlePrintInvoice = () => {
    navigate('/invoice', { state: { order: savedOrder } });
  };

  const { subtotal, vat, serviceCharge, total } = calculateTotal();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Box sx={{ 
      p: 2, 
      minHeight: '100vh',
      position: 'relative'
    }}>
     
      <Grid container spacing={3}>
        {/* Menu Section */}
        <Grid item sx={{ maxWidth: 1100 }} >
          <Fade in={!loading} >
            <Card elevation={3} sx={{ 
              borderRadius: 4, 
              height: 'calc(100vh - 150px)',
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ 
                flex: '0 0 auto', 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                backgroundColor: 'primary.main',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Category sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Menu
                  </Typography>
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {categories.map(category => (
                      <CategoryChip
                        key={category}
                        label={category}
                        onClick={() => setActiveCategory(category)}
                        active={activeCategory === category ? 1 : 0}
                        color="primary"
                        variant={activeCategory === category ? 'outlined' : 'outlined'}
                        sx={{ 
                          color: activeCategory === category ? 'white' : 'inherit',
                          backgroundColor: activeCategory === category ? 'primary.dark' : 'primary'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
              
              <MenuContainer>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {filteredMenuItems.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                          <StyledCard>
                            <CardMedia
                              component="img"
                              height="160"
                              image={item.image}
                              alt={item.name}
                              sx={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = `https://source.unsplash.com/random/300x300/?${item.name.split(' ').join(',')}`;
                              }}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                              <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                                {item.description}
                              </Typography>
                              <Chip 
                                label={item.category} 
                                size="small" 
                                sx={{ mb: 2, bgcolor: alpha('#1976d2', 0.1), color: 'primary.main' }} 
                              />
                            </CardContent>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              bgcolor: 'background.paper',
                              borderTop: '1px solid',
                              borderColor: alpha('#000', 0.06)
                            }}>
                              <PriceTag>
                                AED {item.price.toFixed(2)}
                              </PriceTag>
                              <GradientButton 
                                size="small" 
                                onClick={() => addToOrder(item)}
                                startIcon={<Add />}
                              >
                                Add
                              </GradientButton>
                            </Box>
                          </StyledCard>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </MenuContainer>
            </Card>
          </Fade>
        </Grid>
        
        {/* Order Section */}
        <Grid item sx={{ maxWidth: 470 }}>
          <Fade in={!loading} >
            <Card elevation={3} sx={{ 
              borderRadius: 4, 
              height: 'calc(100vh - 150px)',
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <CardContent sx={{ 
                flex: '0 0 auto',
                borderBottom: '1px solid', 
                borderColor: 'divider',
                backgroundColor: 'primary.main',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingCart sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Your Order
                  </Typography>
                  <Chip 
                    label={`${orderItems.length} item${orderItems.length !== 1 ? 's' : ''}`} 
                    size="small" 
                    color="secondary" 
                    sx={{ ml: 2 }}
                  />
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Table Number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TableRestaurant />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : orderItems.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    px: 2,
                    border: '1px dashed',
                    borderColor: alpha('#000', 0.1),
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100% - 120px)'
                  }}>
                    <ShoppingCart sx={{ fontSize: 60, color: alpha('#000', 0.1), mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Your order is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add items from the menu to start your order
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} elevation={0} sx={{ 
                    border: '1px solid', 
                    borderColor: alpha('#000', 0.1),
                    borderRadius: 2,
                  }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item, index) => (
                          <Fade in key={item.id} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                            <TableRow sx={{
                              '&:hover': {
                                backgroundColor: alpha('#1976d2', 0.04),
                              }
                            }}>
                              <TableCell sx={{ 
                                maxWidth: '120px', 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {item.name}
                              </TableCell>
                              <TableCell align="right">AED {item.price.toFixed(2)}</TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    color="primary"
                                    sx={{ 
                                      p: 0.5,
                                      backgroundColor: alpha('#1976d2', 0.1),
                                      '&:hover': {
                                        backgroundColor: alpha('#1976d2', 0.2),
                                      }
                                    }}
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <Typography variant="body2" sx={{ mx: 1, fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    color="primary"
                                    sx={{ 
                                      p: 0.5,
                                      backgroundColor: alpha('#1976d2', 0.1),
                                      '&:hover': {
                                        backgroundColor: alpha('#1976d2', 0.2),
                                      }
                                    }}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 500 }}>
                                AED {(item.price * item.quantity).toFixed(2)}
                              </TableCell>
                              <TableCell align="right" sx={{ p: 0.5 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => removeFromOrder(item.id)}
                                  color="error"
                                  sx={{ 
                                    p: 0.5,
                                    '&:hover': {
                                      backgroundColor: alpha('#f44336', 0.1),
                                    }
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          </Fade>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
              
              {/* Order Summary */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha('#f5f5f5', 0.5), 
                borderTop: '1px solid', 
                borderColor: 'divider' 
              }}>
                <Box sx={{ mb: 2, px: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                    <Typography variant="body2">AED {subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">VAT (5%):</Typography>
                    <Typography variant="body2">AED {vat.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Service Charge (10%):</Typography>
                    <Typography variant="body2">AED {serviceCharge.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}>
                      AED {total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
  <GradientButton
    fullWidth
    size="large"
    onClick={() => saveOrder(false)}
    disabled={orderItems.length === 0 || loading}
    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
    sx={{ 
      py: 1.5,
      fontWeight: 'bold',
    }}
  >
    {loading ? 'Processing...' : 'Save Order'}
  </GradientButton>
  
  <GradientButton
    fullWidth
    size="large"
    onClick={() => saveOrder(true)}
    disabled={orderItems.length === 0 || loading}
    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Receipt />}
    sx={{ 
      py: 1.5,
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #4CAF50, #81C784)',
    }}
  >
    {loading ? 'Processing...' : 'Save & View Invoice'}
  </GradientButton>
</Box>
                {/* <GradientButton
                  fullWidth
                  size="large"
                  onClick={saveOrder}
                  disabled={orderItems.length === 0 || loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{ 
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                </GradientButton> */}
              </Box>
            </Card>
          </Fade>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} elevation={6} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      {showInvoice && savedOrder && (
  <Dialog
    open={showInvoice}
    onClose={() => setShowInvoice(false)}
    maxWidth="md"
    fullWidth
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Order Invoice</Typography>
        <IconButton onClick={() => setShowInvoice(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Invoice order={savedOrder} />
    </DialogContent>
    <DialogActions>
      <Button 
        onClick={() => setShowInvoice(false)}
        color="primary"
      >
        Close
      </Button>
      <Button 
        onClick={handlePrintInvoice}
        variant="contained" 
        color="primary"
        startIcon={<PrintIcon />}
      >
        Print Invoice
      </Button>
    </DialogActions>
  </Dialog>
)}

    </Box>
  );
}