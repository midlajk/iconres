import { Link, Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box, 
  Typography,
  CssBaseline,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  RestaurantMenu,
  History,
  AddCircleOutline,
  LocalDining
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  fontWeight: 600,
  fontSize: '0.9rem',
  textTransform: 'capitalize',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(4),
  cursor: 'pointer',
  '&:hover': {
    '& .logo-icon': {
      transform: 'rotate(15deg)',
    }
  },
}));

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <CssBaseline />
      <StyledAppBar position="sticky">
        <Toolbar>
          <Logo component={Link} to="/">
            <LocalDining 
              className="logo-icon"
              sx={{ 
                fontSize: 32,
                mr: 1,
                color: theme.palette.common.white,
                transition: 'transform 0.3s ease'
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                color: theme.palette.common.white,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Gourmet POS
            </Typography>
          </Logo>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <NavButton 
              color="inherit" 
              component={Link} 
              to="/" 
              startIcon={<RestaurantMenu />}
            >
              {isMobile ? 'New' : 'New Order'}
            </NavButton>
            <NavButton 
              color="inherit" 
              component={Link} 
              to="/history" 
              startIcon={<History />}
            >
              {isMobile ? 'History' : 'Order History'}
            </NavButton>
            <NavButton 
              color="inherit" 
              component={Link} 
              to="/newproduct" 
              startIcon={<AddCircleOutline />}
            >
              {isMobile ? 'Product' : 'New Product'}
            </NavButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      <Container 
        maxWidth={false}   
    
      >
        {/* <Box
          sx={{
            minHeight: 'calc(100vh - 120px)',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
          }}
        > */}
          <Outlet />
        {/* </Box> */}
      </Container>
    </>
  );
}