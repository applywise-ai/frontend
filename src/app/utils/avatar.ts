/**
 * Get avatar background color based on company name
 * @param companyName - The company name to generate color for
 * @returns Tailwind CSS gradient class string
 */
export const getAvatarColor = (companyName: string): string => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600'
  ];
  
  // Generate a simple hash from the company name
  const hash = companyName.split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return colors[hash % colors.length];
};

/**
 * Get first letter of the first name for avatar display
 * @param name - The full name to extract initial from
 * @returns First letter of first name (1 character)
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return 'U'; // Default to 'U' for User
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return 'U';
  }
  
  // Return just the first character of the name
  return trimmedName.charAt(0).toUpperCase();
}; 