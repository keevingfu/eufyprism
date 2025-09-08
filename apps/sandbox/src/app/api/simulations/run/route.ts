import { NextRequest, NextResponse } from 'next/server';
import { MarketSimulator } from '@/services/simulator';
import { AIAdvisor } from '@/services/ai-advisor';
import { SimulationParameters, MarketSimulation } from '@/types/sandbox';

export async function POST(request: NextRequest) {
  try {
    const parameters: SimulationParameters = await request.json();
    
    // Validate parameters
    if (!validateParameters(parameters)) {
      return NextResponse.json(
        { error: 'Invalid simulation parameters' },
        { status: 400 }
      );
    }

    // Run simulation
    const simulator = new MarketSimulator(parameters);
    const results = await simulator.runSimulation();
    
    // Generate AI insights and recommendations
    const aiAdvisor = new AIAdvisor();
    const analysis = aiAdvisor.analyzeSimulation(parameters, results);

    // Create simulation record
    const simulation: MarketSimulation = {
      id: generateSimulationId(),
      name: `Simulation ${new Date().toLocaleDateString()}`,
      description: 'Market strategy simulation',
      createdAt: new Date(),
      updatedAt: new Date(),
      parameters,
      results: {
        ...results,
        recommendations: analysis.recommendations,
      },
      status: 'completed',
    };

    // In a real application, you would save this to a database
    // For now, we'll just return the results
    
    return NextResponse.json({
      success: true,
      simulation,
      analysis,
    });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function validateParameters(parameters: SimulationParameters): boolean {
  // Basic validation
  if (!parameters.marketSize || parameters.marketSize <= 0) return false;
  if (!parameters.initialMarketShare || parameters.initialMarketShare <= 0 || parameters.initialMarketShare > 100) return false;
  if (!parameters.competitorCount || parameters.competitorCount <= 0) return false;
  if (!parameters.simulationDuration || parameters.simulationDuration <= 0) return false;
  
  // Validate pricing strategy
  if (!parameters.pricingStrategy?.basePrice || parameters.pricingStrategy.basePrice <= 0) return false;
  
  // Validate budget
  if (!parameters.budget?.total || parameters.budget.total <= 0) return false;
  
  // Validate promotion strategy
  if (!parameters.promotionStrategy?.channels || parameters.promotionStrategy.channels.length === 0) return false;
  
  // Check if budget allocations sum to ~100%
  const totalAllocation = parameters.promotionStrategy.channels.reduce(
    (sum, channel) => sum + channel.budgetAllocation, 0
  );
  if (Math.abs(totalAllocation - 100) > 5) return false;
  
  return true;
}

function generateSimulationId(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}