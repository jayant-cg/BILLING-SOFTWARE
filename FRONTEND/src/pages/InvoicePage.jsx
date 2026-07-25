import React, { useState } from 'react';

function InvoicePage({ buyer, cart, onStartNewBill, onGoBack }) {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);

  const company = {
    companyName: "TechStore Solutions",
    billingAddress: "123 Business Park, Mumbai, Maharashtra 400001",
    mobile: "+91 98765 43210",
    email: "info@techstore.com",
    gstin: "27AABCT1234H1Z0"
  };

  const generateInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const gstAmount = subtotal * 0.18;
      const totalAmount = subtotal + gstAmount;

      const invoicePayload = {
        buyerId: buyer.id,
        invoiceDate: new Date().toISOString().split('T')[0],
        subtotal: subtotal,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
        status: "Created"
      };

      const res = await fetch('http://localhost:5081/api/Invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });

      if (!res.ok) throw new Error('Failed to create invoice');

      const invoice = await res.json();
      
      // Create invoice items
      for (const item of cart) {
        const itemAmount = item.price * item.qty;
        const itemGstAmount = itemAmount * 0.18;

        await fetch('http://localhost:5081/api/InvoiceItems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: invoice.id,
            productId: item.id,
            qty: item.qty,
            rate: item.price,
            amount: itemAmount,
            gstRate: 18,
            gstAmount: itemGstAmount,
            totalAmount: itemAmount + itemGstAmount
          })
        });
      }

      setInvoiceData(invoice);
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await fetch(`http://localhost:5081/api/Invoices/${invoiceData.id}/pdf`);
      if (!res.ok) throw new Error('Failed to download PDF');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError(err.message);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const invoiceNumber = invoiceData?.invoiceNo || `INV-${Date.now()}`;
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Invoice Preview */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border-2 border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 p-10 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-5xl font-bold">{company.companyName}</h1>
                <div className="flex flex-col gap-1 mt-3 text-blue-100">
                  <p>📍 {company.billingAddress}</p>
                  <p>📞 {company.mobile} | 📧 {company.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-black opacity-10">INVOICE</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10">
            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-10 mb-10 pb-10 border-b-2 border-gray-200">
              <div>
                <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-6">Invoice Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice No:</span>
                    <span className="font-semibold text-gray-900">{invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold text-gray-900">{invoiceDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold text-gray-900">{dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GSTIN:</span>
                    <span className="font-semibold text-gray-900">{company.gstin}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-6">Bill To</h3>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-gray-900">{buyer.partyName}</p>
                  <p className="text-sm text-gray-700">{buyer.billingAddress}</p>
                  {buyer.mobile && (
                    <p className="text-sm text-gray-600">📞 {buyer.mobile}</p>
                  )}
                  {buyer.gstin && (
                    <p className="text-sm text-gray-600">GSTIN: {buyer.gstin}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-10">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-y-2 border-gray-300">
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-semibold">{item.modelName}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{item.qty}</td>
                      <td className="px-6 py-4 text-right text-gray-700">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-gray-900 font-bold">₹{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-10">
              <div className="w-full md:w-96">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 space-y-4 border-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="text-lg font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">GST (18%):</span>
                    <span className="text-lg font-bold text-orange-600">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                    <span className="text-3xl font-black text-blue-600">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p className="font-semibold mb-1">Thank you for your business!</p>
              <p>This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={onGoBack}
            className="px-8 py-4 rounded-lg bg-white text-gray-700 font-bold border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            ← Edit Cart
          </button>

          {!invoiceData ? (
            <button
              className={`px-8 py-4 rounded-lg text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
              }`}
              onClick={generateInvoice}
              disabled={loading}
            >
              <span>{loading ? '⏳' : '💾'}</span>
              <span>{loading ? 'Creating Invoice...' : 'Create Invoice'}</span>
            </button>
          ) : (
            <>
              <button
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={downloadPDF}
              >
                <span>📄</span>
                <span>Download PDF</span>
              </button>
            </>
          )}

          <button
            onClick={onStartNewBill}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:from-orange-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Start New Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoicePage;
