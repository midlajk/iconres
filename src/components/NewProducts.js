import { useState } from 'react';
import { 
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Divider,
  Alert,
  Fade,
  Zoom,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  alpha,
  styled
} from '@mui/material';
import { 
  Upload as UploadIcon,
  Restaurant as RestaurantIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import localforage from 'localforage';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePreviewBox = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: alpha(theme.palette.primary.main, 0.3),
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: 50,
  fontWeight: 'bold',
  textTransform: 'none',
  paddingLeft: 16,
  paddingRight: 16,
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: `0px 6px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
    transform: 'translateY(-2px)',
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s',
  height: '100%',
  boxShadow: theme.shadows[3],
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const steps = ['Product Details', 'Upload Image', 'Preview & Save'];

export default function ProductUploadScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });

  const categories = ['Main Course', 'Appetizers', 'Beverages', 'Desserts'];

  useState(() => {
    // Load recently added items
    localforage.getItem('menuItems').then((items) => {
      if (items && items.length > 0) {
        setRecentlyAdded(items.slice(-4).reverse());
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handlePriceChange = (e) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFormData({
      ...formData,
      price: value,
    });
    
    if (errors.price) {
      setErrors({
        ...errors,
        price: '',
      });
    }
  };

  const handleImageChange = (e) => {
    setImageError('');
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      setImageError('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }
    
    setImageFile(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateImage = () => {
    if (!imageFile || !imagePreview) {
      setImageError('Please upload an image');
      return false;
    }
    return true;
  };
  
  const handleNext = () => {
    if (activeStep === 0 && !validateForm()) return;
    if (activeStep === 1 && !validateImage()) return;
    
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
    });
    setImagePreview(null);
    setImageFile(null);
    setImageError('');
    setErrors({
      name: '',
      price: '',
      category: '',
      description: '',
    });
  };
  
  const handleSave = async () => {
    try {
      // Get existing menu items
      const existingItems = await localforage.getItem('menuItems') || [];
      
      // Create new item
      const newItem = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: imagePreview, // Base64 image
      };
      
      // Add new item to menu
      const updatedItems = [...existingItems, newItem];
      await localforage.setItem('menuItems', updatedItems);
      
      // Update recently added
      setRecentlyAdded([newItem, ...recentlyAdded.slice(0, 3)]);
      
      // Show success dialog
      setOpenSuccess(true);
      
      // Reset form
      handleReset();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  
  const closeSuccessDialog = () => {
    setOpenSuccess(false);
  };

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f3 100%)',
      minHeight: '100vh',
    }}>
    
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Fade in timeout={500}>
            <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Box sx={{ 
                backgroundColor: 'primary.main', 
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <UploadIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Add New Menu Item
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                {activeStep === 0 && (
                  <Fade in timeout={500}>
                    <Box>
                      <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 500, mb: 3 }}>
                        Enter Product Details
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <InventoryIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Price (AED)"
                            name="price"
                            value={formData.price}
                            onChange={handlePriceChange}
                            error={!!errors.price}
                            helperText={errors.price}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MoneyIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!errors.category}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                              labelId="category-label"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              startAdornment={
                                <InputAdornment position="start">
                                  <CategoryIcon color="primary" />
                                </InputAdornment>
                              }
                              sx={{ 
                                borderRadius: 2,
                              }}
                            >
                              {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                  {category}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.category && (
                              <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 2 }}>
                                {errors.category}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline
                            rows={4}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                                  <DescriptionIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}
                
                {activeStep === 1 && (
                  <Fade in timeout={500}>
                    <Box>
                      <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 500, mb: 3 }}>
                        Upload Product Image
                      </Typography>
                      
                      <ImagePreviewBox>
                        {imagePreview ? (
                          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img 
                              src={imagePreview} 
                              alt="Product preview" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                padding: '16px'
                              }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.95)',
                                }
                              }}
                              onClick={() => {
                                setImagePreview(null);
                                setImageFile(null);
                              }}
                              size="small"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', p: 4 }}>
                            <ImageIcon sx={{ fontSize: 60, color: alpha('#000', 0.2), mb: 2 }} />
                            <Typography variant="body1" gutterBottom color="text.secondary">
                              Drag & drop an image or click to browse
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              Recommended size: 800x600px (JPG, PNG)
                            </Typography>
                            <Button
                              component="label"
                              variant="contained"
                              startIcon={<CloudUploadIcon />}
                              sx={{ borderRadius: 8 }}
                            >
                              Select Image
                              <VisuallyHiddenInput type="file" onChange={handleImageChange} accept="image/*" />
                            </Button>
                          </Box>
                        )}
                      </ImagePreviewBox>
                      
                      {imageError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {imageError}
                        </Alert>
                      )}
                      
                      {imagePreview && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            sx={{ borderRadius: 8 }}
                          >
                            Change Image
                            <VisuallyHiddenInput type="file" onChange={handleImageChange} accept="image/*" />
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Fade>
                )}
                
                {activeStep === 2 && (
                  <Fade in timeout={500}>
                    <Box>
                      <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 500, mb: 3 }}>
                        Preview & Confirm
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <ImagePreviewBox sx={{ height: 250 }}>
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Product preview" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'contain' 
                                }}
                              />
                            ) : (
                              <Typography variant="body1" color="text.secondary">
                                No image uploaded
                              </Typography>
                            )}
                          </ImagePreviewBox>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Paper 
                            elevation={1} 
                            sx={{ 
                              p: 3, 
                              height: '100%', 
                              borderRadius: 3,
                              backgroundColor: alpha('#f5f5f5', 0.5),
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {formData.name || 'Product Name'}
                            </Typography>
                            
                            <Chip 
                              label={formData.category || 'Category'} 
                              size="small" 
                              sx={{ mb: 2, bgcolor: alpha('#1976d2', 0.1), color: 'primary.main' }} 
                            />
                            
                            <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                              AED {formData.price || '0.00'}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary">
                              {formData.description || 'No description provided.'}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      
                      <Alert severity="info" sx={{ mt: 3 }}>
                        Please review all details before saving the product to the menu.
                      </Alert>
                    </Box>
                  </Fade>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ borderRadius: 8 }}
                  >
                    Back
                  </Button>
                  
                  <Box>
                    {activeStep !== steps.length - 1 ? (
                      <GradientButton
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Next
                      </GradientButton>
                    ) : (
                      <GradientButton
                        variant="contained"
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                      >
                        Save Product
                      </GradientButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Fade in timeout={800}>
            <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Box sx={{ 
                backgroundColor: 'primary.main', 
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <InventoryIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recently Added
                </Typography>
              </Box>
              
              <CardContent sx={{ p: 2 }}>
                {recentlyAdded.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    px: 2,
                    border: '1px dashed',
                    borderColor: alpha('#000', 0.1),
                    borderRadius: 3,
                  }}>
                    <InventoryIcon sx={{ fontSize: 60, color: alpha('#000', 0.1), mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No products added yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      New products will appear here
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {recentlyAdded.map((item, index) => (
                      <Grid item xs={12} key={item.id}>
                        <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                          <ProductCard>
                            <Box sx={{ display: 'flex', height: 100 }}>
                              <Box sx={{ width: 100, flexShrink: 0 }}>
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                  }} 
                                  onError={(e) => {
                                    e.target.src = `https://source.unsplash.com/random/300x300/?${item.name.split(' ').join(',')}`;
                                  }}
                                />
                              </Box>
                              <Box sx={{ p: 1.5, width: 'calc(100% - 100px)' }}>
                                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 500 }}>
                                  {item.name}
                                </Typography>
                                <Chip 
                                  label={item.category} 
                                  size="small" 
                                  sx={{ 
                                    mb: 1, 
                                    mt: 0.5,
                                    fontSize: '0.7rem',
                                    height: 20,
                                    bgcolor: alpha('#1976d2', 0.1), 
                                    color: 'primary.main' 
                                  }} 
                                />
                                <Typography variant="body2" color="primary" fontWeight="bold">
                                  AED {item.price.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          </ProductCard>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                )}
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Need to manage all products?
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="small"
                    sx={{ borderRadius: 8, mt: 1 }}
                  >
                    View All Products
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
      
      {/* Success Dialog */}
      <Dialog
        open={openSuccess}
        onClose={closeSuccessDialog}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'success.light', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CheckIcon />
          Product Added Successfully
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Your new product "{formData.name}" has been successfully added to the menu.
          </DialogContentText>
          
          {imagePreview && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2, 
              mb: 1,
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <img 
                src={imagePreview} 
                alt={formData.name} 
                style={{ 
                  height: 120,
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={closeSuccessDialog} sx={{ borderRadius: 8 }}>
            Close
          </Button>
          <GradientButton
            onClick={() => {
              closeSuccessDialog();
              // Reset to step 0
              setActiveStep(0);
            }}
            startIcon={<AddIcon />}
          >
            Add Another Product
          </GradientButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}