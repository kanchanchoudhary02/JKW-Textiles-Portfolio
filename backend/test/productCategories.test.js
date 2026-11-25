const test = require('node:test');
const assert = require('node:assert/strict');
const { PRODUCT_CATEGORIES, getProductCategoryFilter } = require('../constants/productCategories');
const Product = require('../models/Product');

const currentCategory = 'Dobby / Schiffli/Jacquard';
const legacyCategory = 'Dobby / Schiffli';

test('allows creating and updating products with either Dobby / Schiffli category value', async () => {
  assert.ok(PRODUCT_CATEGORIES.includes(currentCategory));
  assert.ok(PRODUCT_CATEGORIES.includes(legacyCategory));

  const product = new Product({ name: 'Category compatibility test', category: currentCategory });
  await assert.doesNotReject(product.validate());

  product.category = legacyCategory;
  await assert.doesNotReject(product.validate());
});

test('public and admin category filters match both current and legacy products', () => {
  const expected = { $in: [currentCategory, legacyCategory] };
  assert.deepEqual(getProductCategoryFilter(currentCategory), expected);
  assert.deepEqual(getProductCategoryFilter(legacyCategory), expected);
});

test('unrelated product categories retain exact-match filtering', () => {
  assert.equal(getProductCategoryFilter('Cotton'), 'Cotton');
});
