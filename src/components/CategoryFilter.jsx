import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Os rótulos vêm do i18n via t(id); aqui ficam só id e ícone.
const categories = [
  { id: 'all', icon: '🎬' },
  { id: 'autorais', icon: '🎨' },
  { id: 'jogos', icon: '🎮' },
  { id: 'parcerias', icon: '🤝' }
];

const types = [
  { id: 'all', icon: '🎬' },
  { id: 'series', icon: '📺' },
  { id: 'curtas', icon: '🎬' },
  { id: 'longas', icon: '🍿' }
];

export default function CategoryFilter({ selectedCategory, selectedType, onCategoryChange, onTypeChange }) {
  const { t } = useTranslation();
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
          📁 {t('filter.categories')}
        </button>
        <button
          onClick={() => setActiveFilter('type')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeFilter === 'type'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          🎥 {t('filter.types')}
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
                {t(cat.id)}
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
                {t(type.id)}
              </button>
            ))}
      </div>

      {/* Indicador de filtros ativos */}
      {(selectedCategory !== 'all' || selectedType !== 'all') && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {t('filter.active')}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              {categories.find(c => c.id === selectedCategory)?.icon}
              {t(selectedCategory)}
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              {types.find(tp => tp.id === selectedType)?.icon}
              {t(selectedType)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
