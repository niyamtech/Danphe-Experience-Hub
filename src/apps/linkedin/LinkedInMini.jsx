import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LinkedInMini = ({ onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
    <button
      onClick={onBack}
      className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-2"
    >
      <ArrowLeft size={16} /> Back to Hub
    </button>
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">LinkedIn Mini</h1>
      <p className="text-gray-600">
        Profiles, experience timelines and AI resume boosts are in progress.
      </p>
    </div>
  </div>
);

export default LinkedInMini;
