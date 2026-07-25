import React, { useState, useEffect } from 'react';

function BuyersPage({ onSelectBuyer }) {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5081/api/Buyers')
      .then(res => res.json())
      .then(data => {
        setBuyers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching buyers:', err);
        setLoading(false);
      });
  }, []);

  const filteredBuyers = buyers.filter(buyer =>
    buyer.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (buyer.billingAddress && buyer.billingAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading buyers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Select a Buyer
          </h1>
          <p className="text-gray-600 text-lg">Choose from your list of customers to start creating an invoice</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 transition shadow-sm"
            />
            <span className="absolute right-4 top-4 text-2xl">🔍</span>
          </div>
        </div>

        {/* Buyers Grid */}
        {filteredBuyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map(buyer => (
              <div
                key={buyer.id}
                onClick={() => onSelectBuyer(buyer)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer"
              >
                {/* Top Accent */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>
                
                <div className="p-6">
                  {/* Avatar & Name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {buyer.partyName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
                        {buyer.partyName}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">ID: {buyer.id}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    {buyer.billingAddress && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Address</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{buyer.billingAddress}</p>
                      </div>
                    )}
                    {buyer.city && (
                      <p className="text-sm text-gray-600"><span className="font-semibold">City:</span> {buyer.city}</p>
                    )}
                    {buyer.mobile && (
                      <p className="text-sm text-gray-600"><span className="font-semibold">📞:</span> {buyer.mobile}</p>
                    )}
                    {buyer.gstin && (
                      <p className="text-xs text-gray-500"><span className="font-semibold">GSTIN:</span> {buyer.gstin}</p>
                    )}
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => onSelectBuyer(buyer)}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Select Buyer</span>
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg font-medium">No buyers found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyersPage;
