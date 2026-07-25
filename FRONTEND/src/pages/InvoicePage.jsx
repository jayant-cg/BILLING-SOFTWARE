import React, { useState } from 'react';

function InvoicePage({ buyer, cart }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Company details (static)
  const company = {
    name: "TechStore Solutions",
    address: "123 Business Park, Mumbai, Maharashtra 400001",
    phone: "+91 98765 43210",
    email: "info@techstore.com",
    gst: "27AABCT1234H1Z0",
    pan: "AABCT1234H"
  };

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

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  // Generate invoice number and date
  const invoiceNumber = `INV-${Date.now()}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Invoice Preview */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold">{company.name}</h1>
                <p className="text-blue-100 mt-2">{company.address}</p>
                <p className="text-blue-100 mt-1">📞 {company.phone} | 📧 {company.email}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold opacity-20">INVOICE</div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-gray-200">
              {/* Invoice Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Invoice Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-700">Invoice No:</span> <span className="text-gray-600">{invoiceNumber}</span></p>
                  <p><span className="font-semibold text-gray-700">Date:</span> <span className="text-gray-600">{invoiceDate}</span></p>
                  <p><span className="font-semibold text-gray-700">Due Date:</span> <span className="text-gray-600">{dueDate}</span></p>
                  <p><span className="font-semibold text-gray-700">GST No:</span> <span className="text-gray-600">{company.gst}</span></p>
                </div>
              </div>

              {/* Bill To */}
              <div>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Bill To</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-800 text-lg">{buyer.name}</p>
                  <p className="text-gray-600">{buyer.address}</p>
                  <p><span className="font-semibold text-gray-700">Contact:</span> <span className="text-gray-600">{buyer.phone || 'N/A'}</span></p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4 text-gray-800 font-medium">{item.name}</td>
                      <td className="px-4 py-4 text-center text-gray-600">{item.qty}</td>
                      <td className="px-4 py-4 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-4 text-right text-gray-800 font-semibold">₹{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-80">
                <div className="bg-gray-50 rounded-lg p-6 space-y-3 border border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST (18%):</span>
                    <span className="font-semibold">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-lg font-bold text-blue-600">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-6 text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
              <p className="mt-2">This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            className={`px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
            }`}
            onClick={generateInvoice}
            disabled={loading}
          >
            {loading ? '⏳ Generating PDF...' : '📄 Generate PDF'}
          </button>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`invoice-${invoiceNumber}.pdf`}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ⬇️ Download Invoice
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoicePage;
