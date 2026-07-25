import React, { useEffect, useState } from 'react';

function BuyersPage({ onSelectBuyer }) {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/Buyers')
      .then(res => res.json())
      .then(data => {
        setBuyers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading buyers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Select a Buyer
          </h1>
          <p className="text-gray-500">Choose from your list of buyers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyers.map(buyer => (
            <div
              key={buyer.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                      {buyer.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">ID: {buyer.id}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {buyer.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {buyer.address && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Address:</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{buyer.address}</p>
                  </div>
                )}

                <button
                  onClick={() => onSelectBuyer(buyer)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  Select Buyer
                </button>
              </div>
            </div>
          ))}
        </div>

        {buyers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No buyers found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyersPage;
