// lib/api.js
export const sampleData = {
    circles: ["A", "B", "C"],
    demand_pct: {"A": 0.40, "B": 0.35, "C": 0.25},
    capacity_pct: {"A": 0.80, "B": 0.90, "C": 0.75},
    travel_cost: {"A": 2, "B": 3, "C": 4},
    initial_stock: 1000,
    unit_price: 10
  };
  
  export const optimizeDistribution = async (data = sampleData) => {
    const response = await fetch('http://localhost:8000/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  
    return await response.json();
  };