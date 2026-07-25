import React, { useEffect, useState } from 'react';

function ProductsPage({ buyer, onGenerateInvoice, onGoBack }) {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5081/api/Categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  const addProduct = (product, qty) => {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].qty += qty;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, qty }]);
    }
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeProduct(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, qty: newQty } : item
      ));
    }
  };

  const removeProduct = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Products</h1>
            <p className="text-gray-600">Billing for <span className="font-semibold text-blue-600">{buyer.partyName}</span></p>
          </div>
          <button
            onClick={onGoBack}
            className="px-6 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition font-semibold shadow-sm hover:shadow-md"
          >
            ← Change Buyer
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCategory === null ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200 hover:border-blue-500 overflow-hidden text-left"
                    >
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-24 flex items-center justify-center group-hover:scale-110 transition">
                        <span className="text-5xl">📦</span>
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-xs text-gray-500 mt-2">{cat.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition font-semibold shadow-sm"
                >
                  ← Back
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <CategoryProducts categoryId={selectedCategory} onAdd={addProduct} buyerId={buyer.id} />
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900">🛒 Cart</h3>
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">{cart.length}</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-gray-500 text-sm">No items added yet</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.modelName}</p>
                        <button
                          onClick={() => removeProduct(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-lg hover:bg-red-50 w-6 h-6 rounded flex items-center justify-center transition"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">₹{item.price}</p>

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-7 h-7 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition font-bold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-10 text-center border border-gray-300 rounded px-1 py-1 text-sm font-bold"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-7 h-7 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition font-bold"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-right font-bold text-gray-900 text-sm">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-2 mb-6 border border-gray-200">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>GST (18%):</span>
                  <span className="font-semibold">₹{gst.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold text-blue-600">
                  <span>Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                onClick={() => onGenerateInvoice(cart)}
                disabled={cart.length === 0}
              >
                Generate Bill →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryProducts({ categoryId, onAdd, buyerId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5081/api/Products/category/${categoryId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return <p className="text-gray-500">Loading products...</p>;
  }

  const handleAddToCart = (product) => {
    const priceToUse = product.defaultPrice;
    onAdd({ ...product, price: priceToUse }, 1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map(p => (
        <div key={p.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-2 border-gray-200 hover:border-blue-500 p-6 group">
          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">{p.modelName}</h4>
          <p className="text-2xl font-bold text-blue-600 mb-4">₹{p.defaultPrice}</p>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-semibold shadow-md hover:shadow-lg active:scale-95"
            onClick={() => handleAddToCart(p)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;
