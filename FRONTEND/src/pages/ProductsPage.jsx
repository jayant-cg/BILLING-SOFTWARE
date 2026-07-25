import React, { useEffect, useState } from 'react';

function ProductsPage({ buyer, onGenerateInvoice }) {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch('/api/Categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const addProduct = (product, qty) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + qty } : item
      ));
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

  // Calculate totals correctly
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);

  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Create Invoice
        </h1>
        <p className="text-gray-600">Buyer: <span className="font-semibold text-gray-800">{buyer.name}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Categories and Products */}
        <div className="lg:col-span-2">
          {/* Category Cards */}
          {selectedCategory === null ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-16 flex items-center justify-center">
                      <span className="text-3xl">📦</span>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">Click to view products</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                ← Back to Categories
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <CategoryProducts categoryId={selectedCategory} onAdd={addProduct} />
            </div>
          )}
        </div>

        {/* Right Side - Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b-2 border-blue-500">
              Cart Summary
            </h3>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items added yet</p>
            ) : (
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeProduct(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg ml-2"
                      >
                        ×
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 transition font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="w-8 h-8 bg-green-500 text-white rounded hover:bg-green-600 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-right font-semibold text-gray-800 mt-2">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-6 border border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (18%):</span>
                <span className="font-semibold">₹{gst.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-lg font-bold text-blue-600">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onGenerateInvoice(cart)}
              disabled={cart.length === 0}
            >
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryProducts({ categoryId, onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/Products/category/${categoryId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId]);

  if (loading) {
    return <p className="text-gray-500">Loading products...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map(p => (
        <div key={p.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-100 p-4">
          <h4 className="font-bold text-gray-800 mb-2">{p.name}</h4>
          <p className="text-lg font-semibold text-blue-600 mb-4">₹{p.price}</p>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-semibold"
            onClick={() => onAdd(p, 1)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;
