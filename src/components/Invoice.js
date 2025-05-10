
import { useLocation } from 'react-router-dom';
import { 
  Button, Typography, Box, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRef } from 'react';

// Styles for thermal printer (6-inch width)
const styles = {
  // Hide UI elements when printing
  '@media print': {
    '.no-print': {
      display: 'none !important',
    },
    '.print-only': {
      display: 'block',
    },
    // Specific styles for thermal printer format
    body: {
      width: '72mm', // ~3 inches (common thermal receipt width)
      margin: '0',
      padding: '0',
      fontFamily: 'monospace', // Better for thermal printers
    },
    // Ensure content fits in thermal printer width
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    // Compact cells for thermal printer
    td: {
      fontSize: '10px',
      padding: '2px 4px',
    },
    th: {
      fontSize: '10px',
      padding: '2px 4px',
    },
  },
};

export default function Invoice() {
  const { state } = useLocation();
  const order = state?.order;
  const printRef = useRef();

  if (!order) {
    return <Typography variant="h6">No order data found</Typography>;
  }

  const handlePrint = () => {
    window.print();
  };

  // Format the date to be more compact
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      {/* Add print styles */}
      <style>
        {`
          @media print {
            body {
              width: 6in;
              margin: 0;
              padding: 0;
              font-family: 'Courier New', monospace;
            }
            .no-print {
              display: none !important;
            }
            .invoice-wrapper {
              width: 5.9in; /* Slightly less than 6in to ensure margin */
              padding: 0.1in;
            }
            .compact-text {
              font-size: 12px;
              line-height: 1.2;
              margin: 2px 0;
            }
            .table-cell {
              padding: 4px;
              font-size: 12px;
            }
          }
        `}
      </style>
      
      {/* Main container */}
      <Box 
        className="invoice-wrapper" 
        ref={printRef}
        sx={{ 
          maxWidth: { xs: '100%', sm: '400px' }, 
          margin: 'auto', 
          p: 2,
          fontFamily: 'Courier New, monospace',
        }}
      >
        {/* Back button - won't be printed */}
        <Button 
          className="no-print" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => window.history.back()} 
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        {/* Header */}
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Restaurant Name
        </Typography>
        <Typography className="compact-text" variant="body2" align="center">
          Address, Dubai, UAE
        </Typography>
        <Typography className="compact-text" variant="body2" gutterBottom align="center">
          TRN: 123456789012345
        </Typography>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Order details */}
        <Box sx={{ my: 1.5 }}>
          <Typography className="compact-text" variant="body2">
            <strong>Order:</strong> {order.id}
          </Typography>
          <Typography className="compact-text" variant="body2">
            <strong>Date:</strong> {formatDate(order.date)}
          </Typography>
          <Typography className="compact-text" variant="body2">
            <strong>Customer:</strong> {order.customerName || 'Walk-in'}
          </Typography>
          <Typography className="compact-text" variant="body2">
            <strong>Table:</strong> {order.tableNumber || 'N/A'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Items table */}
        <TableContainer sx={{ mb: 1.5 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="table-cell" sx={{ fontWeight: 'bold', p: 0.5 }}>Item</TableCell>
                <TableCell className="table-cell" sx={{ fontWeight: 'bold', p: 0.5 }} align="right">Qty</TableCell>
                <TableCell className="table-cell" sx={{ fontWeight: 'bold', p: 0.5 }} align="right">Price</TableCell>
                <TableCell className="table-cell" sx={{ fontWeight: 'bold', p: 0.5 }} align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="table-cell" sx={{ p: 0.5 }}>
                    {item.name}
                  </TableCell>
                  <TableCell className="table-cell" sx={{ p: 0.5 }} align="right">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="table-cell" sx={{ p: 0.5 }} align="right">
                    {item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="table-cell" sx={{ p: 0.5 }} align="right">
                    {(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Totals */}
        <Box sx={{ textAlign: 'right', mb: 1.5 }}>
          <Typography className="compact-text" variant="body2">
            Subtotal: AED {order.subtotal.toFixed(2)}
          </Typography>
          <Typography className="compact-text" variant="body2">
            VAT (5%): AED {order.vat.toFixed(2)}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            Total: AED {order.total.toFixed(2)}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 1.5 }}>
          <Typography className="compact-text" variant="body2">
            Thank you for dining with us!
          </Typography>
          <Typography className="compact-text" variant="body2" sx={{ mt: 0.5 }}>
            {new Date().toLocaleDateString()}
          </Typography>
        </Box>
        
        {/* Print button - won't be printed */}
        <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
        </Box>
      </Box>
    </>
  );
}