import React from 'react';

const CategoryFilter = ({ categories, selected, onSelect }) => (
  <div className="flex flex-wrap gap-3">
    {categories.map((cat) => {
      const Icon = cat.icon;
      const isActive = selected === cat.id;
      return (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isActive
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
          }`}
        >
          <Icon size={18} />
          <span className="font-medium">{cat.name}</span>
        </button>
      );
    })}
  </div>
);

export default CategoryFilter;
