export const generateCartItemId = (baseId, ingredientIds = []) => {
  const sorted = [...ingredientIds].sort().join("-");
  return `${baseId}__${sorted}`;
};