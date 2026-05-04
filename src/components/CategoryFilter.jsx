import { useState } from 'react';

const categories = [
  { id: 'all', name: 'Todos', icon: '🎬', type: 'category' },
  { id: 'autorais', name: 'Autorais', icon: '🎨', type: 'category' },
  { id: 'jogos', name: 'Jogos', icon: '🎮', type: 'category' },
  { id: 'parcerias', name: 'Parcerias', icon: '🤝', type: 'category' }
];

const types = [
  { id: 'all', name: 'Todos', icon: '🎬', type: 'type' },
  { id: 'series', name: 'Séries', icon: '📺', type: 'type' },
  { id: 'curtas', name: 'Curtas', icon: '🎬', type: 'type' },
  { id: 'longas', name: 'Longas', icon: '🍿', type: 'type' }
];

export default function CategoryFilter({ selectedCategory, selectedType, onCategoryChange, onTypeChange }) {
  const [activeFilter, setActiveFilter] = useState('category'); // 'category' ou 'type'

  return (
    <div className="mb-8">
      {/* Botões para alternar entre Categorias e Tipos */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveFilter('category')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFilter === 'category'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          📁 Categorias
        </button>
        <button
          onClick={() => setActiveFilter('type')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFilter === 'type'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          🎥 Tipos
        </button>
      </div>

      {/* Filtros ativos */}
      <div className="flex flex-wrap gap-3">
        {activeFilter === 'category' 
          ? categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))
          : types.map((type) => (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  selectedType === type.id
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                }`}
              >
                <span>{type.icon}</span>
                {type.name}
              </button>
            ))}
      </div>

      {/* Indicador de filtros ativos */}
      {(selectedCategory !== 'all' || selectedType !== 'all') && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Filtros ativos: 
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              {categories.find(c => c.id === selectedCategory)?.icon}
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              {types.find(t => t.id === selectedType)?.icon}
              {types.find(t => t.id === selectedType)?.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}