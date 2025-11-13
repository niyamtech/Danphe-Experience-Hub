import React, { useMemo, useState } from 'react';
import CategoryFilter from './components/CategoryFilter.jsx';
import AppCard from './components/AppCard.jsx';
import { apps, categories } from './data/apps.js';
import ProductivityTracker from './apps/productivity/ProductivityTracker.jsx';
import TaxCalculator from './apps/tax/TaxCalculator.jsx';
import HomeLoanCalculator from './apps/home-loan/HomeLoanCalculator.jsx';
import MeditationCounter from './apps/meditation/MeditationCounter.jsx';
import StarbucksOrdering from './apps/coffee/StarbucksOrdering.jsx';
import FurnitureDesigner from './apps/furniture/FurnitureDesigner.jsx';
import LinkedInMini from './apps/linkedin/LinkedInMini.jsx';

const componentMap = {
  'productivity-tracker': ProductivityTracker,
  'tax-app': TaxCalculator,
  'home-loan': HomeLoanCalculator,
  meditation: MeditationCounter,
  coffee: StarbucksOrdering,
  'furniture-design': FurnitureDesigner,
  'linkedin-mini': LinkedInMini
};

const App = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [category, setCategory] = useState('all');

  if (selectedApp) {
    const SelectedComponent = componentMap[selectedApp] || (() => <div />);
    return <SelectedComponent onBack={() => setSelectedApp(null)} />;
  }

  const enrichedApps = useMemo(
    () =>
      apps.map((app) => ({
        ...app,
        categoryLabel: categories.find((cat) => cat.id === app.category)?.name || ''
      })),
    []
  );

  const filtered = category === 'all' ? enrichedApps : enrichedApps.filter((app) => app.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Danphe Experience Hub</p>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Multi-app portfolio
          </h1>
          <p className="text-gray-600 mt-2">
            Pick an app to deep dive. Each module is isolated inside <code>/src/apps</code> for scaling.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} onSelect={(id) => app.implemented && setSelectedApp(id)} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What changed?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Apps live inside dedicated folders (<code>/src/apps/*</code>) with scoped components.</li>
            <li>Shared UI (cards, filters) live under <code>/src/components</code>.</li>
            <li>Mock data + enums stored in <code>/src/data</code>.</li>
            <li>Speech recognition and other logic-ready utilities live inside <code>/src/hooks</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
