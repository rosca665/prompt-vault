import React from 'react';
import type { SortField, SortOrder } from '@/types/api';
import styles from './SortSelector.module.css';

interface SortSelectorProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const sortOptions: { label: string; value: SortField }[] = [
  { label: 'Newest', value: 'created' },
  { label: 'Oldest', value: 'created' },
  { label: 'Last Used', value: 'lastUsed' },
  { label: 'Most Used', value: 'usageCount' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Title A-Z', value: 'title' },
];

const SortSelector: React.FC<SortSelectorProps> = ({ sortField, sortOrder, onSortChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Determine order based on selection
    if (value === 'created') {
      onSortChange('created', 'desc');
    } else if (value === 'oldest') {
      onSortChange('created', 'asc');
    } else if (value === 'lastUsed') {
      onSortChange('lastUsed', 'desc');
    } else if (value === 'usageCount') {
      onSortChange('usageCount', 'desc');
    } else if (value === 'rating') {
      onSortChange('rating', 'desc');
    } else {
      onSortChange('title', 'asc');
    }
  };

  const currentSort =
    sortField === 'created' && sortOrder === 'desc'
      ? 'created'
      : sortField === 'created' && sortOrder === 'asc'
        ? 'oldest'
        : sortField;

  return (
    <select className={styles.selector} value={currentSort} onChange={handleChange}>
      <option value="created">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="lastUsed">Last Used</option>
      <option value="usageCount">Most Used</option>
      <option value="rating">Highest Rated</option>
      <option value="title">A-Z</option>
    </select>
  );
};

export default SortSelector;
