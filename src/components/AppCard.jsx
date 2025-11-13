import React from 'react';

const AppCard = ({ app, onSelect }) => {
  const Icon = app.icon;
  return (
    <div
      onClick={() => onSelect(app.id)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
    >
      <div
        className={`bg-gradient-to-r ${app.color} p-6 flex items-center justify-center h-32 group-hover:scale-105 transition-transform`}
      >
        <Icon size={48} className="text-white" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{app.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{app.categoryLabel}</p>
        <p className="text-gray-600">{app.description}</p>
        {!app.implemented && (
          <p className="text-sm text-indigo-600 font-medium mt-3">Coming Soon</p>
        )}
      </div>
    </div>
  );
};

export default AppCard;
