// Utility function for conditional class names
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
