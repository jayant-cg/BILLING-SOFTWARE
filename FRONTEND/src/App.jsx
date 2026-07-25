import React, { useState } from 'react';
import BuyersPage from './pages/BuyersPage';
import ProductsPage from './pages/ProductsPage';
import InvoicePage from './pages/InvoicePage';

function App() {
  const [buyer, setBuyer] = useState(null);
  const [cart, setCart] = useState([]);

  if (!buyer) return <BuyersPage onSelectBuyer={setBuyer} />;
  if (buyer && cart.length === 0) return <ProductsPage buyer={buyer} onGenerateInvoice={setCart} />;
  return <InvoicePage buyer={buyer} cart={cart} />;
}

export default App;
