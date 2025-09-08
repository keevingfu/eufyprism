'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import { SimulationParameters, PricingStrategy, PromotionChannel } from '@/types/sandbox';

export default function SimulatorPage() {
  const [parameters, setParameters] = useState<SimulationParameters>({
    marketSize: 10000000,
    initialMarketShare: 15,
    competitorCount: 5,
    simulationDuration: 12,
    pricingStrategy: {
      model: 'competitive',
      basePrice: 299,
      priceElasticity: 1.2,
      competitorPriceResponse: 0.8,
    },
    promotionStrategy: {
      channels: [
        { type: 'social', budgetAllocation: 35, effectiveness: 0.7, targetAudience: ['18-34', 'urban'] },
        { type: 'search', budgetAllocation: 30, effectiveness: 0.8, targetAudience: ['25-44', 'tech-savvy'] },
        { type: 'email', budgetAllocation: 20, effectiveness: 0.6, targetAudience: ['existing-customers'] },
        { type: 'display', budgetAllocation: 10, effectiveness: 0.4, targetAudience: ['general'] },
        { type: 'offline', budgetAllocation: 5, effectiveness: 0.3, targetAudience: ['local'] },
      ],
      totalBudget: 5000000,
      seasonality: [],
    },
    productStrategy: {
      features: [],
      qualityLevel: 7,
      innovationRate: 2,
    },
    budget: {
      total: 10000000,
      marketing: 5000000,
      product: 3000000,
      operations: 1500000,
      reserve: 500000,
    },
  });

  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/simulations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters),
      });
      const results = await response.json();
      // Handle results
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const updatePricingModel = (model: PricingStrategy['model']) => {
    setParameters(prev => ({
      ...prev,
      pricingStrategy: { ...prev.pricingStrategy, model },
    }));
  };

  const updateBudgetAllocation = (index: number, value: number) => {
    setParameters(prev => {
      const channels = [...prev.promotionStrategy.channels];
      channels[index].budgetAllocation = value;
      
      // Normalize allocations to 100%
      const total = channels.reduce((sum, ch) => sum + ch.budgetAllocation, 0);
      if (total !== 100) {
        const factor = 100 / total;
        channels.forEach(ch => {
          ch.budgetAllocation = Math.round(ch.budgetAllocation * factor);
        });
      }
      
      return {
        ...prev,
        promotionStrategy: { ...prev.promotionStrategy, channels },
      };
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategy Simulator</h1>
          <p className="mt-2 text-gray-600">Configure parameters and run market strategy simulations</p>
        </div>
        <button
          onClick={handleRunSimulation}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
            isRunning
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
          }`}
        >
          {isRunning ? 'Running...' : 'Start Simulation'}
        </button>
      </div>

      {/* Configuration Tabs */}
      <Tabs.Root defaultValue="market" className="w-full">
        <Tabs.List className="flex border-b border-gray-200">
          <Tabs.Trigger value="market" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            Market Configuration
          </Tabs.Trigger>
          <Tabs.Trigger value="pricing" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            Pricing Strategy
          </Tabs.Trigger>
          <Tabs.Trigger value="promotion" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            Promotion Strategy
          </Tabs.Trigger>
          <Tabs.Trigger value="product" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            Product Strategy
          </Tabs.Trigger>
          <Tabs.Trigger value="budget" className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
            Budget Allocation
          </Tabs.Trigger>
        </Tabs.List>

        {/* Market Configuration */}
        <Tabs.Content value="market" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Parameters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Market Size
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.marketSize]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, marketSize: value }))}
                      max={50000000}
                      min={1000000}
                      step={1000000}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-24 text-right">
                      {(parameters.marketSize / 1000000).toFixed(0)}M
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Market Share (%)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.initialMarketShare]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, initialMarketShare: value }))}
                      max={50}
                      min={1}
                      step={0.5}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {parameters.initialMarketShare}%
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Competitors
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.competitorCount]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, competitorCount: value }))}
                      max={20}
                      min={1}
                      step={1}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {parameters.competitorCount}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模拟时长 (月)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.simulationDuration]}
                      onValueChange={([value]) => setParameters(prev => ({ ...prev, simulationDuration: value }))}
                      max={36}
                      min={3}
                      step={1}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {parameters.simulationDuration}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">市场洞察</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">市场潜力</h4>
                  <p className="text-sm text-blue-700">
                    基于当前参数，您的目标市场价值约为
                    <span className="font-semibold"> ¥{(parameters.marketSize * 0.3 / 10000).toFixed(0)}万</span>
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">竞争强度</h4>
                  <p className="text-sm text-green-700">
                    {parameters.competitorCount <= 3 ? '低' : parameters.competitorCount <= 8 ? '中等' : '高'}竞争市场，
                    需要{parameters.competitorCount <= 3 ? '专注质量' : parameters.competitorCount <= 8 ? '平衡策略' : '差异化竞争'}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">增长预期</h4>
                  <p className="text-sm text-purple-700">
                    在{parameters.simulationDuration}个月内，市场份额有望达到
                    <span className="font-semibold"> {(parameters.initialMarketShare * 1.5).toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Tabs.Content>

        {/* Pricing Strategy */}
        <Tabs.Content value="pricing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">定价模型</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    定价策略
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'competitive', label: '竞争定价', icon: '⚔️' },
                      { value: 'penetration', label: '渗透定价', icon: '📉' },
                      { value: 'premium', label: '高端定价', icon: '💎' },
                      { value: 'dynamic', label: '动态定价', icon: '🔄' },
                    ].map((strategy) => (
                      <button
                        key={strategy.value}
                        onClick={() => updatePricingModel(strategy.value as PricingStrategy['model'])}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          parameters.pricingStrategy.model === strategy.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{strategy.icon}</span>
                        <p className="text-sm font-medium mt-1">{strategy.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    基础价格 (¥)
                  </label>
                  <input
                    type="number"
                    value={parameters.pricingStrategy.basePrice}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      pricingStrategy: {
                        ...prev.pricingStrategy,
                        basePrice: parseFloat(e.target.value) || 0,
                      },
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    价格弹性系数
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.pricingStrategy.priceElasticity]}
                      onValueChange={([value]) => setParameters(prev => ({
                        ...prev,
                        pricingStrategy: {
                          ...prev.pricingStrategy,
                          priceElasticity: value,
                        },
                      }))}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {parameters.pricingStrategy.priceElasticity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {parameters.pricingStrategy.priceElasticity < 1 ? '低弹性' : parameters.pricingStrategy.priceElasticity < 2 ? '中等弹性' : '高弹性'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">价格影响预测</h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">收入预测</h4>
                  <div className="text-sm text-yellow-700">
                    <p>月度收入预估：¥{(parameters.marketSize * parameters.initialMarketShare * 0.01 * parameters.pricingStrategy.basePrice * 0.1 / 10000).toFixed(0)}万</p>
                    <p className="mt-1">年度收入潜力：¥{(parameters.marketSize * parameters.initialMarketShare * 0.01 * parameters.pricingStrategy.basePrice * 1.2 / 10000).toFixed(0)}万</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">竞争影响</h4>
                  <p className="text-sm text-orange-700">
                    当前定价策略将
                    {parameters.pricingStrategy.model === 'penetration' ? '快速获取市场份额但利润率较低' :
                     parameters.pricingStrategy.model === 'premium' ? '维持高利润率但增长较慢' :
                     parameters.pricingStrategy.model === 'dynamic' ? '灵活应对市场变化' :
                     '保持市场平衡'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Tabs.Content>

        {/* Promotion Strategy */}
        <Tabs.Content value="promotion" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">推广渠道配置</h3>
            
            <div className="space-y-6">
              {parameters.promotionStrategy.channels.map((channel, index) => (
                <div key={channel.type} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {channel.type === 'social' ? '社交媒体' :
                       channel.type === 'search' ? '搜索引擎' :
                       channel.type === 'email' ? '电子邮件' :
                       channel.type === 'display' ? '展示广告' :
                       '线下推广'}
                    </h4>
                    <span className="text-sm text-gray-600">
                      预算占比: {channel.budgetAllocation}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">预算分配</label>
                      <div className="flex items-center space-x-3">
                        <Slider.Root
                          value={[channel.budgetAllocation]}
                          onValueChange={([value]) => updateBudgetAllocation(index, value)}
                          max={100}
                          min={0}
                          step={5}
                          className="relative flex items-center select-none touch-none w-full h-5"
                        >
                          <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                            <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                          </Slider.Track>
                          <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                        </Slider.Root>
                        <span className="text-sm text-gray-700 w-16 text-right">
                          ¥{(parameters.promotionStrategy.totalBudget * channel.budgetAllocation / 100 / 10000).toFixed(0)}万
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">预期效果</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${channel.effectiveness * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">
                          {(channel.effectiveness * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">总推广预算</span>
                <span className="text-lg font-semibold text-gray-900">
                  ¥{(parameters.promotionStrategy.totalBudget / 10000).toFixed(0)}万
                </span>
              </div>
            </div>
          </motion.div>
        </Tabs.Content>

        {/* Product Strategy */}
        <Tabs.Content value="product" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">产品质量</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    质量等级 (1-10)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.productStrategy.qualityLevel]}
                      onValueChange={([value]) => setParameters(prev => ({
                        ...prev,
                        productStrategy: {
                          ...prev.productStrategy,
                          qualityLevel: value,
                        },
                      }))}
                      max={10}
                      min={1}
                      step={1}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {parameters.productStrategy.qualityLevel}/10
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>基础</span>
                    <span>标准</span>
                    <span>优质</span>
                    <span>卓越</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    创新速度 (新功能/季度)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Slider.Root
                      value={[parameters.productStrategy.innovationRate]}
                      onValueChange={([value]) => setParameters(prev => ({
                        ...prev,
                        productStrategy: {
                          ...prev.productStrategy,
                          innovationRate: value,
                        },
                      }))}
                      max={10}
                      min={0}
                      step={1}
                      className="relative flex items-center select-none touch-none w-full h-5"
                    >
                      <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-primary-600 rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-600" />
                    </Slider.Root>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {parameters.productStrategy.innovationRate}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">产品影响分析</h3>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-900 mb-1">客户满意度预测</h4>
                  <p className="text-sm text-indigo-700">
                    基于质量等级 {parameters.productStrategy.qualityLevel}/10，
                    预计NPS得分为 <span className="font-semibold">{30 + parameters.productStrategy.qualityLevel * 5}</span>
                  </p>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-pink-900 mb-1">市场竞争力</h4>
                  <p className="text-sm text-pink-700">
                    {parameters.productStrategy.qualityLevel >= 8 ? '强势领先' :
                     parameters.productStrategy.qualityLevel >= 6 ? '具有竞争力' :
                     parameters.productStrategy.qualityLevel >= 4 ? '基本满足需求' :
                     '需要改进'}，创新速度
                    {parameters.productStrategy.innovationRate >= 5 ? '快' :
                     parameters.productStrategy.innovationRate >= 2 ? '适中' :
                     '慢'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Tabs.Content>

        {/* Budget Allocation */}
        <Tabs.Content value="budget" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">预算分配</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(parameters.budget).filter(([key]) => key !== 'total').map(([key, value]) => (
                  <div key={key} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-700 capitalize mb-2">
                      {key === 'marketing' ? '市场营销' :
                       key === 'product' ? '产品开发' :
                       key === 'operations' ? '运营成本' :
                       '储备资金'}
                    </h4>
                    <p className="text-2xl font-bold text-gray-900">
                      ¥{(value / 10000).toFixed(0)}万
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {((value / parameters.budget.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-primary-900">总预算</h4>
                    <p className="text-sm text-primary-700 mt-1">年度预算总额</p>
                  </div>
                  <p className="text-3xl font-bold text-primary-900">
                    ¥{(parameters.budget.total / 10000).toFixed(0)}万
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900">ROI预期</h4>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    {((parameters.budget.marketing / parameters.budget.total) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-900">效率指数</h4>
                  <p className="text-xl font-bold text-green-700 mt-1">
                    {(parameters.budget.marketing / parameters.marketSize * 10000).toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900">风险缓冲</h4>
                  <p className="text-xl font-bold text-purple-700 mt-1">
                    {((parameters.budget.reserve / parameters.budget.total) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}