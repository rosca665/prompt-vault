import React from 'react';
import type { SearchFilters } from '@/types/api';
import styles from './FilterChips.module.css';

interface FilterChipsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onFiltersChange }) => {
  const handleRemoveFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      key: key as keyof SearchFilters,
      value,
    }));

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={styles.chips}>
      {activeFilters.map(({ key, value }) => (
        <div key={key} className={styles.chip}>
          <span>{String(value)}</span>
          <button
            className={styles.chipClose}
            onClick={() => handleRemoveFilter(key)}
            aria-label={`Remove ${key} filter`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;
