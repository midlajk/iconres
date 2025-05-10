
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Chip,
  Avatar,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { 
  Search, 
  FilterAlt, 
  Receipt, 
  RestaurantMenu,
  ClearAll,
  Restaurant,
  Download,
  FileDownload,
  GridOn,
  PictureAsPdf,
  AttachMoney,
  CalendarMonth
} from '@mui/icons-material';
import localforage from 'localforage';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    localforage.getItem('orderHistory').then(history => {
      if (history) {
        const sortedOrders = history.reverse(); // Show newest first
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFilter, orders]);

  const applyFilters = () => {
    let result = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.customerName?.toLowerCase().includes(term) ||
        order.tableNumber?.toString().includes(term) ||
        order.id.toString().includes(term)
      );
    }

    // Date range filter
    if (dateFilter.startDate && dateFilter.endDate) {
      result = result.filter(order => {
        const orderDate = dayjs(order.date);
        return orderDate.isAfter(dateFilter.startDate) && 
               orderDate.isBefore(dateFilter.endDate.add(1, 'day'));
      });
    }

    setFilteredOrders(result);
    setPage(0); // Reset to first page when filters change
  };

  const viewInvoice = (order) => {
    navigate('/invoice', { state: { order } });
  };

  const calculateSummary = () => {
    return filteredOrders.reduce((acc, order) => {
      acc.subtotal += order.subtotal || 0;
      acc.vat += order.vat || 0;
      acc.total += order.total || 0;
      acc.count++;
      return acc;
    }, { subtotal: 0, vat: 0, total: 0, count: 0 });
  };

  const summary = calculateSummary();

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({ startDate: null, endDate: null });
  };

  const getInitials = (name) => {
    if (!name || name === 'Walk-in') return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF'];
    return colors[id % colors.length];
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = () => {
    setExportLoading(true);
    handleExportClose();
    
    // Prepare data for export
    const data = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Date': dayjs(order.date).format('DD/MM/YYYY HH:mm'),
      'Customer': order.customerName || 'Walk-in',
      'Table': order.tableNumber || 'Takeaway',
      'Subtotal': order.subtotal?.toFixed(2),
      'VAT (5%)': order.vat?.toFixed(2),
      'Total': order.total?.toFixed(2),
      'Items': order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    saveAs(blob, `orders_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
    
    setExportLoading(false);
  };



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f9fafc', minHeight: '100vh' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 2, sm: 0 } 
          }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 56, 
                height: 56, 
                mr: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
              }}
            >
              <Receipt sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                Order History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review and manage your previous orders
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${filteredOrders.length} orders`} 
              color="primary" 
              size="large"
              sx={{ 
                borderRadius: 6, 
                px: 2,
                py: 2.5,
                '& .MuiChip-label': { 
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExportClick}
              sx={{
                borderRadius: 8,
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
              }}
            >
              Export
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={exportToExcel} disabled={exportLoading || filteredOrders.length === 0}>
                <ListItemIcon>
                  {exportLoading ? <CircularProgress size={20} /> : <GridOn fontSize="small" />}
                </ListItemIcon>
                Excel (.xlsx)
              </MenuItem>
          
            </Menu>
          </Box>
        </Box>

        {/* Filter Card */}
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'visible',
            boxShadow: '0 10px 28px rgba(0,0,0,0.05)'
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center',
              color: 'primary.main'
            }}>
              <FilterAlt sx={{ mr: 1 }} /> 
              Search & Filters
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by customer name, table number, or order ID..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={dateFilter.startDate}
                  onChange={(newValue) => setDateFilter({...dateFilter, startDate: newValue})}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }
                    } 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={dateFilter.endDate}
                  onChange={(newValue) => setDateFilter({...dateFilter, endDate: newValue})}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }
                    } 
                  }}
                  minDate={dateFilter.startDate}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={resetFilters}
                startIcon={<ClearAll />}
                sx={{ 
                  borderRadius: 8,
                  px: 3
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {filteredOrders.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 3,
                  backgroundImage: 'linear-gradient(to right, #f3f4f6, #f7f8fa)',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.05)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e3f2fd', mr: 2 }}>
                    <RestaurantMenu sx={{ color: '#2196f3' }} />
                  </Avatar>
                  <Typography variant="subtitle1" color="text.secondary">
                    Subtotal
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
                  AED {summary.subtotal.toFixed(2)}
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0}
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 3,
                  backgroundImage: 'linear-gradient(to right, #f3f4f6, #f7f8fa)',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.05)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e8f5e9', mr: 2 }}>
                    <AttachMoney sx={{ color: '#4caf50' }} />
                  </Avatar>
                  <Typography variant="subtitle1" color="text.secondary">
                    VAT (5%)
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
                  AED {summary.vat.toFixed(2)}
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0}
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 3,
                  backgroundImage: 'linear-gradient(135deg, #4a148c, #7b1fa2)',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(123, 31, 162, 0.25)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                    <Receipt sx={{ color: 'white' }} />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Total Revenue
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  AED {summary.total.toFixed(2)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Orders Table */}
        <Card 
          elevation={0} 
          sx={{ 
            marginTop: 8,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            boxShadow: '0 10px 28px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ bgcolor: 'background.paper', px: 3, py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Order Details
            </Typography>
          </Box>
          <Divider />
          
          {loading ? (
            <Box sx={{ p: 3 }}>
              <LinearProgress />
              <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                Loading orders...
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Table</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Subtotal</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>VAT (5%)</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Total</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', py: 2 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                        <TableRow 
                          key={order.id} 
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }
                          }}
                        >
                          <TableCell>
                            <Chip 
                              label={`#${order.id}`} 
                              size="small"
                              sx={{ 
                                fontWeight: 'bold',
                                bgcolor: 'primary.light',
                                color: 'primary.dark',
                                borderRadius: 1
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarMonth 
                                fontSize="small" 
                                sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }}
                              />
                              {dayjs(order.date).format('DD MMM YYYY, hh:mm A')}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  mr: 1, 
                                  bgcolor: getRandomColor(order.id),
                                  fontSize: 14
                                }}
                              >
                                {getInitials(order.customerName)}
                              </Avatar>
                              <Typography>{order.customerName || 'Walk-in'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {order.tableNumber ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Restaurant 
                                  fontSize="small" 
                                  sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }}
                                />
                                Table {order.tableNumber}
                              </Box>
                            ) : (
                              <Chip 
                                label="Takeaway" 
                                size="small" 
                                sx={{ 
                                  borderRadius: 1,
                                  bgcolor: 'rgba(0, 0, 0, 0.08)'
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">AED {order.subtotal?.toFixed(2)}</TableCell>
                          <TableCell align="right">AED {order.vat?.toFixed(2)}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            AED {order.total?.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Button 
                              variant="contained" 
                              onClick={() => viewInvoice(order)}
                              startIcon={<Receipt />}
                              size="small"
                              sx={{ 
                                borderRadius: 8,
                                px: 2,
                                boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                              }}
                            >
                              Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 80, 
                                height: 80, 
                                mb: 2,
                                bgcolor: 'background.default',
                                border: '1px dashed',
                                borderColor: 'divider'
                              }}
                            >
                              <Receipt sx={{ fontSize: 40, color: 'text.disabled' }} />
                            </Avatar>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              No orders found
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              Try adjusting your search or filter criteria
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {filteredOrders.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredOrders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    '& .MuiTablePagination-toolbar': {
                      minHeight: '56px'
                    }
                  }}
                />
              )}
            </>
          )}
        </Card>
      </Box>
    </LocalizationProvider>
  );
}