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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading buyers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Select a Buyer
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map(buyer => (
          <div
            key={buyer.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => onSelectBuyer(buyer)}
          >
            <h2 className="text-lg font-semibold text-gray-700">{buyer.name}</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {buyer.id}</p>
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyersPage;
