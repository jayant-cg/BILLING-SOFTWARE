import React, { useState } from 'react';

function InvoicePage({ buyer, cart }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/Invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: buyer.id, items: cart })
      });
      const invoice = await res.json();

      const pdfRes = await fetch(`/api/Invoices/${invoice.id}/pdf`);
      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error generating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Invoice for {buyer.name}
      </h2>

      {/* Cart Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Items</h3>
        <ul className="space-y-2">
          {cart.map(item => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name} × {item.qty}</span>
              <span className="text-gray-700">₹{item.price * item.qty}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Generate PDF Button */}
      <button
        className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
        }`}
        onClick={generateInvoice}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate PDF'}
      </button>

      {/* Download Link */}
      {pdfUrl && (
        <div className="mt-6 text-center">
          <a
            href={pdfUrl}
            download="invoice.pdf"
            className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Download Invoice
          </a>
        </div>
      )}
    </div>
  );
}

export default InvoicePage;
