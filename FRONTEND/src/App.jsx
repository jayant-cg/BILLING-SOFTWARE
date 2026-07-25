import React, { useState } from 'react';
import BuyersPage from './pages/BuyersPage';
import ProductsPage from './pages/ProductsPage';
import InvoicePage from './pages/InvoicePage';

function App() {
  const [appState, setAppState] = useState({
    page: 1, // 1: Buyers, 2: Products, 3: Invoice
    buyer: null,
    cart: [],
    invoice: null,
    loading: false,
    error: null
  });

  const goToProducts = (buyer) => {
    setAppState(prev => ({
      ...prev,
      page: 2,
      buyer: buyer,
      cart: [],
      error: null
    }));
  };

  const goToInvoice = (cart) => {
    setAppState(prev => ({
      ...prev,
      page: 3,
      cart: cart,
      error: null
    }));
  };

  const startNewBill = () => {
    setAppState({
      page: 1,
      buyer: null,
      cart: [],
      invoice: null,
      loading: false,
      error: null
    });
  };

  const goBack = () => {
    if (appState.page === 2) {
      setAppState(prev => ({
        ...prev,
        page: 1,
        buyer: null,
        cart: [],
        error: null
      }));
    } else if (appState.page === 3) {
      setAppState(prev => ({
        ...prev,
        page: 2,
        invoice: null
      }));
    }
  };

  const PageIndicator = () => {
    const steps = [
      { num: 1, label: 'Select Buyer', icon: '👤' },
      { num: 2, label: 'Add Products', icon: '📦' },
      { num: 3, label: 'Review & Confirm', icon: '✅' }
    ];

    return (
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => {
                    if (step.num < appState.page) goBack();
                  }}
                  disabled={step.num > appState.page}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    step.num === appState.page
                      ? 'text-blue-600 font-bold scale-110'
                      : step.num < appState.page
                      ? 'text-green-600 cursor-pointer hover:scale-105'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    step.num === appState.page
                      ? 'bg-blue-100 text-blue-600'
                      : step.num < appState.page
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.num < appState.page ? '✓' : step.icon}
                  </div>
                  <span className="text-xs font-medium text-center">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`h-1 w-16 rounded-full transition-all ${
                    step.num < appState.page ? 'bg-green-400' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageIndicator />
      
      {appState.page === 1 && (
        <BuyersPage onSelectBuyer={goToProducts} />
      )}

      {appState.page === 2 && (
        <ProductsPage 
          buyer={appState.buyer} 
          onGenerateInvoice={goToInvoice}
          onGoBack={goBack}
        />
      )}

      {appState.page === 3 && (
        <InvoicePage 
          buyer={appState.buyer} 
          cart={appState.cart}
          onStartNewBill={startNewBill}
          onGoBack={goBack}
        />
      )}
    </div>
  );
}

export default App;
