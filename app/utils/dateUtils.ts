/**
 * Formats a date string or Date object into a readable format
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    case 'long':
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    default:
      return dateObj.toLocaleDateString('en-US');
  }
};

/**
 * Formats a date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Gets relative time (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Checks if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Gets the start and end of a date (for date range queries)
 */
export const getDateRange = (date: string | Date): { start: Date; end: Date } => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const start = new Date(dateObj);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(dateObj);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};
