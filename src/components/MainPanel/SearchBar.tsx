import React, { useCallback } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search prompts..."
        value={value}
        onChange={handleChange}
        aria-label="Search prompts"
      />
      {value && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
