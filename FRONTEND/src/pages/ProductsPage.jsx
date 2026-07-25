import React, { useEffect, useState } from 'react';

function ProductsPage({ buyer, onGenerateInvoice }) {
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

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

  const removeProduct = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => {
    const gst = item.price * 0.18; // GST 18%
    return sum + item.qty * item.price + gst;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Products for {buyer.name}
      </h2>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{cat.name}</h3>
            <CategoryProducts categoryId={cat.id} onAdd={addProduct} />
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Cart Summary</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items added yet.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name} × {item.qty}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">₹{item.price * item.qty}</span>
                  <button
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => removeProduct(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h4 className="text-lg font-semibold mt-4">Estimated Total: ₹{total.toFixed(2)}</h4>
        <button
          className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          onClick={() => onGenerateInvoice(cart)}
          disabled={cart.length === 0}
        >
          Generate Bill
        </button>
      </div>
    </div>
  );
}

function CategoryProducts({ categoryId, onAdd }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/Products/category/${categoryId}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [categoryId]);

  return (
    <ul className="space-y-2">
      {products.map(p => (
        <li key={p.id} className="flex justify-between items-center">
          <span>{p.name} - ₹{p.price}</span>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            onClick={() => onAdd(p, 1)}
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProductsPage;
