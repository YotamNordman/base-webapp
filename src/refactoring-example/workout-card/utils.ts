/**
 * Formats a workout date string into a localized Hebrew format
 * @param dateString ISO date string to format
 * @returns Formatted date string in Hebrew locale
 */
export const formatWorkoutDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
