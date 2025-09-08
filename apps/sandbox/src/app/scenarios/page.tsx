'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { WhatIfScenario } from '@/types/sandbox';

export default function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isNewScenarioOpen, setIsNewScenarioOpen] = useState(false);

  // Predefined scenarios
  const scenarios: WhatIfScenario[] = [
    {
      id: 'aggressive-marketing',
      name: 'Aggressive Marketing Strategy',
      description: 'Increase marketing budget by 50%, focus on social media and search engine',
      parameterChanges: {
        budget: {
          total: 15000000,
          marketing: 7500000,
          product: 3000000,
          operations: 1500000,
          reserve: 3000000,
        },
      },
      projectedResults: {
        marketShareChange: 3.5,
        revenueChange: 25,
        riskLevel: 'medium',
        probability: 0.7,
      },
    },
    {
      id: 'premium-positioning',
      name: 'Premium Market Positioning',
      description: 'Increase product price by 30%, focus on high-end customer segments',
      parameterChanges: {
        pricingStrategy: {
          model: 'premium',
          basePrice: 389,
          priceElasticity: 1.5,
          competitorPriceResponse: 0.6,
        },
      },
      projectedResults: {
        marketShareChange: -1.5,
        revenueChange: 15,
        riskLevel: 'low',
        probability: 0.8,
      },
    },
    {
      id: 'innovation-focus',
      name: 'Innovation-Driven Growth',
      description: 'Double product R&D investment, launch 3-4 new features quarterly',
      parameterChanges: {
        productStrategy: {
          features: [],
          qualityLevel: 9,
          innovationRate: 4,
        },
        budget: {
          total: 12000000,
          marketing: 4000000,
          product: 6000000,
          operations: 1500000,
          reserve: 500000,
        },
      },
      projectedResults: {
        marketShareChange: 5,
        revenueChange: 30,
        riskLevel: 'high',
        probability: 0.6,
      },
    },
    {
      id: 'market-penetration',
      name: 'Market Penetration Strategy',
      description: 'Reduce prices by 20%, expand market coverage',
      parameterChanges: {
        pricingStrategy: {
          model: 'penetration',
          basePrice: 239,
          priceElasticity: 2.0,
          competitorPriceResponse: 1.2,
        },
      },
      projectedResults: {
        marketShareChange: 6,
        revenueChange: 10,
        riskLevel: 'medium',
        probability: 0.75,
      },
    },
  ];

  // Scenario comparison data
  const getComparisonData = () => {
    const baselineData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      baseline: 15 + i * 0.5,
    }));

    selectedScenarios.forEach(scenarioId => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        baselineData.forEach((data, i) => {
          (data as any)[scenarioId] = 15 + i * 0.5 + scenario.projectedResults.marketShareChange * (i / 11);
        });
      }
    });

    return baselineData;
  };

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else if (prev.length < 3) {
        return [...prev, scenarioId];
      }
      return prev;
    });
  };

  const sensitivityData = [
    { factor: 'Price Sensitivity', impact: -2.5, confidence: 0.85 },
    { factor: 'Marketing Effectiveness', impact: 3.2, confidence: 0.75 },
    { factor: 'Product Quality', impact: 2.8, confidence: 0.90 },
    { factor: 'Competitive Response', impact: -1.8, confidence: 0.70 },
    { factor: 'Market Growth', impact: 1.5, confidence: 0.80 },
    { factor: 'Customer Retention', impact: 2.1, confidence: 0.85 },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scenario Analysis</h1>
          <p className="mt-2 text-gray-600">Evaluate the potential impact of different strategic decisions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              compareMode
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {compareMode ? 'Exit Compare' : 'Compare Mode'}
          </button>
          <button
            onClick={() => setIsNewScenarioOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            New Scenario
          </button>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <motion.div
            key={scenario.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all ${
              selectedScenarios.includes(scenario.id)
                ? 'border-primary-600'
                : 'border-gray-100 hover:border-gray-300'
            }`}
            onClick={() => compareMode ? handleScenarioToggle(scenario.id) : setSelectedScenario(scenario.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
              </div>
              {compareMode && (
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => handleScenarioToggle(scenario.id)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Market Share Change</p>
                <p className={`text-xl font-bold ${
                  scenario.projectedResults.marketShareChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {scenario.projectedResults.marketShareChange > 0 ? '+' : ''}
                  {scenario.projectedResults.marketShareChange}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Revenue Impact</p>
                <p className={`text-xl font-bold ${
                  scenario.projectedResults.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {scenario.projectedResults.revenueChange > 0 ? '+' : ''}
                  {scenario.projectedResults.revenueChange}%
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                getRiskColor(scenario.projectedResults.riskLevel)
              }`}>
                Risk: {scenario.projectedResults.riskLevel === 'low' ? 'Low' : 
                      scenario.projectedResults.riskLevel === 'medium' ? 'Medium' : 'High'}
              </div>
              <div className="text-sm text-gray-600">
                Success Rate: {(scenario.projectedResults.probability * 100).toFixed(0)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison View */}
      {compareMode && selectedScenarios.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Scenario Comparison Analysis</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Baseline"
                />
                {selectedScenarios.map((scenarioId, index) => {
                  const scenario = scenarios.find(s => s.id === scenarioId);
                  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                  return (
                    <Line
                      key={scenarioId}
                      type="monotone"
                      dataKey={scenarioId}
                      stroke={colors[index]}
                      strokeWidth={2}
                      name={scenario?.name}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedScenarios.map(scenarioId => {
              const scenario = scenarios.find(s => s.id === scenarioId);
              if (!scenario) return null;
              return (
                <div key={scenarioId} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>ROI: <span className="font-medium text-green-600">
                      {(scenario.projectedResults.revenueChange / 10).toFixed(1)}x
                    </span></p>
                    <p>Payback Period: <span className="font-medium">
                      {Math.round(12 / scenario.projectedResults.probability)} months
                    </span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Sensitivity Analysis */}
      <Tabs.Root defaultValue="sensitivity" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <Tabs.List className="flex border-b border-gray-200">
          <Tabs.Trigger value="sensitivity" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            Sensitivity Analysis
          </Tabs.Trigger>
          <Tabs.Trigger value="recommendations" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            AI Recommendations
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="sensitivity" className="mt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sensitivityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[-4, 4]} />
                <YAxis dataKey="factor" type="category" width={100} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-medium">{data.factor}</p>
                          <p className="text-sm text-gray-600">
                            Impact: {data.impact > 0 ? '+' : ''}{data.impact}%
                          </p>
                          <p className="text-sm text-gray-600">
                            Confidence: {(data.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="impact" fill="#3b82f6">
                  {sensitivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
                <ReferenceLine x={0} stroke="#666" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Marketing effectiveness is the largest positive driver - each 1% increase can bring 3.2% market share growth</li>
              <li>• Price sensitivity is the highest - pricing strategies need careful consideration</li>
              <li>• Product quality has high-confidence positive impact and is key to stable growth</li>
            </ul>
          </div>
        </Tabs.Content>

        <Tabs.Content value="recommendations" className="mt-6">
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-primary-600 bg-primary-50">
              <h4 className="font-semibold text-primary-900">Priority Recommendation: Innovation-Driven Growth</h4>
              <p className="mt-1 text-sm text-primary-700">
                Based on current market environment and competitive landscape, we recommend the innovation-driven strategy. Although the risk is higher, the potential returns are greatest,
                and it aligns with target customer preferences. We suggest phased implementation with small-scale pilot validation first.
              </p>
            </div>

            <div className="p-4 border-l-4 border-green-600 bg-green-50">
              <h4 className="font-semibold text-green-900">Alternative Plan: Aggressive Marketing Strategy</h4>
              <p className="mt-1 text-sm text-green-700">
                If innovation capabilities are limited, consider the aggressive marketing strategy. This strategy has moderate risk with quick results,
                particularly suitable for rapidly capturing market share when competitors are slow to respond.
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-600 bg-orange-50">
              <h4 className="font-semibold text-orange-900">Risk Warning</h4>
              <p className="mt-1 text-sm text-orange-700">
                Avoid executing multiple aggressive strategies simultaneously. Recommend maintaining at least 20% budget reserve for unexpected situations.
                Closely monitor competitor responses and adjust strategies promptly.
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Implementation Roadmap</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Month 1-2: Market Research & Preparation</p>
                    <p className="text-sm text-gray-600">Deep analysis of target customer needs, refine product planning</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Month 3-4: Small-Scale Pilot</p>
                    <p className="text-sm text-gray-600">Select 1-2 cities for pilot testing to validate strategy effectiveness</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Month 5-12: Full Rollout</p>
                    <p className="text-sm text-gray-600">Optimize strategy based on pilot results, gradually expand implementation scope</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* New Scenario Dialog */}
      <Dialog.Root open={isNewScenarioOpen} onOpenChange={setIsNewScenarioOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Create New Scenario
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mb-6">
              Define new What-if scenarios to evaluate the impact of different strategies
            </Dialog.Description>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., Digital Transformation Strategy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the main changes in this scenario..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Scenario
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}