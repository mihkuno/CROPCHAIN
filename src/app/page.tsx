// app/page.js
'use client';

import { useState } from 'react';
import SolverCard from '../components/SolverCard';
import { sampleData } from '../lib/api';

export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSolve = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API with hardcoded sample data
      const response = await fetch('http://localhost:8000/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error optimizing distribution:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
          Stock Distribution Optimizer
        </h1>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
          <p className="mb-4">
            This tool helps optimize the distribution of stock across different market circles 
            to maximize profit. Each circle has different demand, capacity constraints, and transportation costs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Sample Data:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">Circles:</span> A, B, C</li>
                <li><span className="font-medium">Initial Stock:</span> 1,000 units</li>
                <li><span className="font-medium">Unit Selling Price:</span> ₱10</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Circle Properties:</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Circle</th>
                    <th className="text-left py-2">Demand %</th>
                    <th className="text-left py-2">Capacity %</th>
                    <th className="text-left py-2">Travel Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">A</td>
                    <td className="py-2">40%</td>
                    <td className="py-2">80%</td>
                    <td className="py-2">₱2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">B</td>
                    <td className="py-2">35%</td>
                    <td className="py-2">90%</td>
                    <td className="py-2">₱3</td>
                  </tr>
                  <tr>
                    <td className="py-2">C</td>
                    <td className="py-2">25%</td>
                    <td className="py-2">75%</td>
                    <td className="py-2">₱4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <SolverCard
          onSolve={handleSolve}
          loading={loading}
          results={results}
          error={error}
        />
      </div>
    </main>
  );
}