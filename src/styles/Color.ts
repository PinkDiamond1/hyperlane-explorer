// Should match tailwind.config.js
export enum Color {
  primaryBlack = '#010101',
  primaryWhite = '#FFFFFF',
  primaryGray = '#6B7280',
  primaryBlue = '#2362C1',
  primaryBeige = '#F1EDE9',
  primaryRed = '#BF1B15',
}

// Useful for cases when using class names isn't convenient
// such as in svg fills
export function classNameToColor(className) {
  switch (className) {
    case 'bg-blue-500':
      return Color.primaryBlue;
    case 'bg-red-500':
      return Color.primaryRed;
    case 'bg-gray-500':
      return Color.primaryGray;
    default:
      throw new Error('Missing color for className: ' + className);
  }
}
