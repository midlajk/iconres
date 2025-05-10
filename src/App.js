import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewOrder from './components/NewOrder';
import OrderHistory from './components/OrderHistory';
import Layout from './components/Layout';
import Invoice from './components/Invoice';
import NewProducts from './components/NewProducts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NewOrder />} />
          <Route path="history" element={<OrderHistory />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="newproduct" element={<NewProducts />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;