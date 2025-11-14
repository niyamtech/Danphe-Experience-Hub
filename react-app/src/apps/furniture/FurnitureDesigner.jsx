import React from 'react';
import { ArrowLeft } from 'lucide-react';

const FurnitureDesigner = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
    <button
      onClick={onBack}
      className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
    >
      <ArrowLeft size={16} /> Back to Hub
    </button>
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Furniture Designer</h1>
      <p className="text-gray-600">
        Drag-and-drop planning, presets and exports are on the roadmap. Stay tuned!
      </p>
    </div>
  </div>
);

export default FurnitureDesigner;
