// components/DistributionChart.js
'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function DistributionChart({ allocations }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!allocations || allocations.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare data
    const labels = allocations.map(a => `Circle ${a.circle}`);
    const unitData = allocations.map(a => a.units);
    const profitData = allocations.map(a => a.profit);
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Units Distributed',
            data: unitData,
            backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Profit (₱)',
            data: profitData,
            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1,
            type: 'line',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Units'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Profit (₱)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Stock Distribution and Profit by Circle',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [allocations]);

  if (!allocations) return null;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}