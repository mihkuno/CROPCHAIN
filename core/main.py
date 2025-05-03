from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ortools.sat.python import cp_model
from typing import Dict, List

app = FastAPI(title="Stock Distribution Optimizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizationRequest(BaseModel):
    circles: List[str]
    demand_pct: Dict[str, float]
    capacity_pct: Dict[str, float]
    travel_cost: Dict[str, int]
    initial_stock: int
    unit_price: int

class CircleAllocation(BaseModel):
    circle: str
    units: int
    net_price: float
    profit: float

class OptimizationResponse(BaseModel):
    total_profit: float
    allocations: List[CircleAllocation]
    remaining_stock: int

@app.post("/optimize", response_model=OptimizationResponse)
def optimize_distribution(request: OptimizationRequest):
    try:
        # Create the CP-SAT model
        model = cp_model.CpModel()

        # Decision variables
        x = {}
        for c in request.circles:
            max_units = int(request.demand_pct[c] * request.initial_stock * request.capacity_pct[c])
            x[c] = model.NewIntVar(0, max_units, f'x_{c}')

        # Constraint: Total stock
        model.Add(sum(x.values()) <= request.initial_stock)

        # Objective function: Maximize profit
        profit = 0
        for c in request.circles:
            profit += (request.unit_price - request.travel_cost[c]) * x[c]
        model.Maximize(profit)

        # Solve the model
        solver = cp_model.CpSolver()
        status = solver.Solve(model)

        if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
            total_profit = solver.ObjectiveValue()
            allocations = []
            total_units = 0
            
            for c in request.circles:
                units = solver.Value(x[c])
                total_units += units
                net_price = request.unit_price - request.travel_cost[c]
                circle_profit = units * net_price
                
                allocations.append(
                    CircleAllocation(
                        circle=c,
                        units=units,
                        net_price=net_price,
                        profit=circle_profit
                    )
                )
            
            remaining_stock = request.initial_stock - total_units
            
            return OptimizationResponse(
                total_profit=total_profit,
                allocations=allocations,
                remaining_stock=remaining_stock
            )
        else:
            raise HTTPException(status_code=400, detail="No optimal solution found")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Stock Distribution Optimizer API"}

# For testing with sample data
@app.get("/sample")
def get_sample_data():
    return {
        "circles": ["A", "B", "C"],
        "demand_pct": {"A": 0.40, "B": 0.35, "C": 0.25},
        "capacity_pct": {"A": 0.80, "B": 0.90, "C": 0.75},
        "travel_cost": {"A": 2, "B": 3, "C": 4},
        "initial_stock": 1000,
        "unit_price": 10
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)