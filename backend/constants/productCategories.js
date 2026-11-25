const DOBBY_SCHIFFLI_CATEGORY = 'Dobby / Schiffli/Jacquard';
const LEGACY_DOBBY_SCHIFFLI_CATEGORY = 'Dobby / Schiffli';
const DOBBY_SCHIFFLI_CATEGORIES = [
  DOBBY_SCHIFFLI_CATEGORY,
  LEGACY_DOBBY_SCHIFFLI_CATEGORY,
];

const PRODUCT_CATEGORIES = [
  'Greige',
  'Yarn Dyed',
  ...DOBBY_SCHIFFLI_CATEGORIES,
  'Dyed',
  'Printed',
  'Cotton',
  'Linen',
  'Rayon',
  'Blended',
  'Other',
];

function getProductCategoryFilter(category) {
  if (DOBBY_SCHIFFLI_CATEGORIES.includes(category)) {
    return { $in: DOBBY_SCHIFFLI_CATEGORIES };
  }
  return category;
}

module.exports = { PRODUCT_CATEGORIES, getProductCategoryFilter };
