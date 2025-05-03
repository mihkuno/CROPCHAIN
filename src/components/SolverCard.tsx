// components/SolverCard.js
'use client';

import { useState } from 'react';
import DistributionChart from './DistributionChart';
import ResultsDisplay from './ResultsDisplay';

export default function SolverCard({ onSolve, loading, results, error }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Stock Distribution Solver</h2>
        <button
          onClick={onSolve}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Solving...' : 'Solve Optimization'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResultsDisplay results={results} />
            <DistributionChart allocations={results.allocations} />
          </div>
        </div>
      )}

      {!results && !loading && !error && (
        <div className="text-center py-12 text-gray-500">
          Click "Solve Optimization" to find the optimal distribution of stock.
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Running optimization solver...</p>
        </div>
      )}
    </div>
  );
}