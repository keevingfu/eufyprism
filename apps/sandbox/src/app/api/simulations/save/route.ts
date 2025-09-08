import { NextRequest, NextResponse } from 'next/server';
import { MarketSimulation } from '@/types/sandbox';

// In-memory storage for demo purposes
// In a real application, you would use a database
const simulations = new Map<string, MarketSimulation>();

export async function POST(request: NextRequest) {
  try {
    const simulation: MarketSimulation = await request.json();
    
    // Validate simulation data
    if (!simulation.id || !simulation.name) {
      return NextResponse.json(
        { error: 'Invalid simulation data' },
        { status: 400 }
      );
    }

    // Update timestamp
    simulation.updatedAt = new Date();
    
    // Save simulation
    simulations.set(simulation.id, simulation);
    
    return NextResponse.json({
      success: true,
      simulation,
    });
  } catch (error) {
    console.error('Save simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get specific simulation
      const simulation = simulations.get(id);
      if (!simulation) {
        return NextResponse.json(
          { error: 'Simulation not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        simulation,
      });
    } else {
      // Get all simulations
      const allSimulations = Array.from(simulations.values())
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      
      return NextResponse.json({
        success: true,
        simulations: allSimulations,
      });
    }
  } catch (error) {
    console.error('Get simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Simulation ID is required' },
        { status: 400 }
      );
    }
    
    const deleted = simulations.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Simulation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Simulation deleted successfully',
    });
  } catch (error) {
    console.error('Delete simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}