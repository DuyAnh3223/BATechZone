// --------------- MOCK DATA FOR ADMIN CATEGORY PAGE ---------------
// Mock attribute data derived from `batechzone.sql`
export const attributeValues = [
  { attribute_value_id: 26, attribute_id: 31, value_name: 'Intel' },
  { attribute_value_id: 27, attribute_id: 31, value_name: 'AMD' },
  { attribute_value_id: 28, attribute_id: 31, value_name: 'Asus' },
  { attribute_value_id: 29, attribute_id: 31, value_name: 'Gigabyte' },
  { attribute_value_id: 30, attribute_id: 31, value_name: 'MSI' },
  { attribute_value_id: 31, attribute_id: 31, value_name: 'Thermaltake' },
];

export const attributes = [
  {
    attribute_id: 31,
    attribute_name: 'Hãng',
    attribute_type: 'other',
  },
  // Add example attribute for color/size
  {
    attribute_id: 32,
    attribute_name: 'Kích thước',
    attribute_type: 'size',
  },
  {
    attribute_id: 33,
    attribute_name: 'Màu sắc',
    attribute_type: 'color',
  },
];

// mapping attribute -> category
export const attributeCategories = [
  { attribute_category_id: 22, attribute_id: 31, category_id: 1 },
  { attribute_category_id: 23, attribute_id: 31, category_id: 2 },
  { attribute_category_id: 24, attribute_id: 31, category_id: 5 },
  { attribute_category_id: 25, attribute_id: 31, category_id: 6 },
  // link other attributes to category 1 for demo
  { attribute_category_id: 26, attribute_id: 32, category_id: 1 },
  { attribute_category_id: 27, attribute_id: 33, category_id: 1 },
];

export function getAttributesForCategory(categoryId = 1) {
  const attrIds = attributeCategories
    .filter((ac) => ac.category_id === categoryId)
    .map((ac) => ac.attribute_id);

  return attributes
    .filter((a) => attrIds.includes(a.attribute_id))
    .map((a) => ({
      ...a,
      values: attributeValues.filter((v) => v.attribute_id === a.attribute_id),
    }));
}

 

// Categories mock data (derived from batechzone.sql)
export const categories = [
  { category_id: 1, category_name: 'CPU', slug: 'cpu', description: 'Bộ vi xử lý trung tâm', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 2, category_name: 'VGA', slug: 'vga', description: 'Card đồ họa', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 3, category_name: 'RAM', slug: 'ram', description: 'Bộ nhớ RAM', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 4, category_name: 'SSD', slug: 'ssd', description: 'Ổ cứng SSD', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 5, category_name: 'Mainboard', slug: 'mainboard', description: 'Bo mạch chủ', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 6, category_name: 'PSU', slug: 'psu', description: 'Bộ nguồn', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 7, category_name: 'Case', slug: 'case', description: 'Vỏ máy tính', parent_category_id: null, image_url: null, is_active: 1 },
  { category_id: 8, category_name: 'Cooling', slug: 'cooling', description: 'Tản nhiệt', parent_category_id: null, image_url: null, is_active: 1 },
];

export function getCategories() {
  return categories;
}

export function getCategoryById(id) {
  return categories.find((c) => c.category_id === id) || null;
}

// update default export to include categories
const _default = { attributes, attributeValues, attributeCategories, getAttributesForCategory, categories, getCategories, getCategoryById };
export default _default;


// --------------- END MOCK DATA FOR ADMIN CATEGORY PAGE ---------------

// --------------- MOCK DATA FOR ADMIN PRODUCT PAGE ---------------
export const products = [
  {
    product_id: 501,
    category_id: 1, // CPU
    product_name: "CPU Demo - Intel",
    slug: "cpu-demo-intel",
    description: "Sản phẩm demo CPU dùng thuộc tính danh mục",
    base_price: 3500000,
    is_active: 1,
    is_featured: 1,
    view_count: 10,
    rating_average: 4.5,
    review_count: 2,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
  },
  {
    product_id: 502,
    category_id: 5, // Mainboard
    product_name: "Mainboard Demo - Asus",
    slug: "mainboard-demo-asus",
    description: "Sản phẩm demo mainboard",
    base_price: 2500000,
    is_active: 1,
    is_featured: 0,
    view_count: 5,
    rating_average: 4.0,
    review_count: 0,
    created_at: "2025-01-05",
    updated_at: "2025-01-05",
  },
];

export const productVariants = [
  {
    variant_id: 601,
    product_id: 501,
    sku: "CPU-INTEL",
    variant_name: "CPU - Intel",
    price: 3600000,
    stock_quantity: 20,
    is_active: 1,
    is_default: 1,
  },
  {
    variant_id: 602,
    product_id: 501,
    sku: "CPU-AMD",
    variant_name: "CPU - AMD",
    price: 3400000,
    stock_quantity: 15,
    is_active: 1,
    is_default: 0,
  },
  {
    variant_id: 603,
    product_id: 502,
    sku: "MB-ASUS",
    variant_name: "Mainboard - Asus",
    price: 2600000,
    stock_quantity: 12,
    is_active: 1,
    is_default: 1,
  },
  {
    variant_id: 604,
    product_id: 502,
    sku: "MB-MSI",
    variant_name: "Mainboard - MSI",
    price: 2450000,
    stock_quantity: 8,
    is_active: 1,
    is_default: 0,
  },
];


export const variantAttributes = [
  // CPU Demo (product 501)
  { variant_id: 601, attribute_value_id: 26 }, // Intel
  { variant_id: 602, attribute_value_id: 27 }, // AMD

  // Mainboard Demo (product 502)
  { variant_id: 603, attribute_value_id: 28 }, // Asus
  { variant_id: 604, attribute_value_id: 30 }, // MSI
];


export const productMock = {
  products,
  productVariants,
  variantAttributes,
};



// --------------- END MOCK DATA FOR ADMIN PRODUCT PAGE ---------------