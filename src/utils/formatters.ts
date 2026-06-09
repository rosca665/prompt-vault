import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format date relative to now (e.g., '2 hours ago')
 */
export const formatRelativeDate = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

/**
 * Format date as readable string (e.g., 'Jan 15, 2024')
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return 'Unknown';
  }
};

/**
 * Format date with time (e.g., 'Jan 15, 2024 at 3:30 PM')
 */
export const formatDatetime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy p');
  } catch {
    return 'Unknown';
  }
};
