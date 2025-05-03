// components/ResultsDisplay.js
'use client';

export default function ResultsDisplay({ results }) {
  if (!results) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-lg font-medium mb-3">Optimization Results</h3>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-green-600">
          ₱{results.total_profit.toLocaleString(undefined, {maximumFractionDigits: 2})}
        </div>
        <div className="text-sm text-gray-600">Total Profit</div>
      </div>
      
      <div className="mb-4">
        <div className="text-gray-700">
          <span className="font-medium">{results.remaining_stock}</span> units remaining in stock
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-3 text-left">Circle</th>
              <th className="py-2 px-3 text-right">Units</th>
              <th className="py-2 px-3 text-right">Net Price</th>
              <th className="py-2 px-3 text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            {results.allocations.map((allocation) => (
              <tr key={allocation.circle} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 font-medium">Circle {allocation.circle}</td>
                <td className="py-2 px-3 text-right">{allocation.units.toLocaleString()}</td>
                <td className="py-2 px-3 text-right">₱{allocation.net_price.toFixed(2)}</td>
                <td className="py-2 px-3 text-right">₱{allocation.profit.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}