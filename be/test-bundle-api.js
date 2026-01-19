/**
 * Test Bundle API - Tạo bundle với auto-generate serial
 * Chạy: node test-bundle-api.js
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Màu sắc cho console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// ============================================================================
// TEST 1: Tạo Bundle với số lượng hợp lệ
// ============================================================================
async function testCreateBundleSuccess() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('TEST 1: Tạo Bundle với số lượng hợp lệ (quantity = 2)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  const timestamp = Date.now();
  const bundleData = {
    bundle_name: `PC Gaming Entry Level - Test ${timestamp}`,
    category_id: 1,
    description: 'Bộ PC gaming phổ thông, phù hợp cho game esports và làm việc văn phòng. CPU Intel Core i3 12100F, VGA GTX 1650, RAM 16GB DDR4.',
    price: 15000000,
    warranty_period: 24,
    discount_percent: 5,
    discount_start_date: '2026-01-18',
    discount_end_date: '2026-02-28',
    quantity: 2, // Tạo 2 bundle serial
    components: [
      { component_variant_id: 3, quantity: 1, display_order: 1 },
      { component_variant_id: 17, quantity: 1, display_order: 2 },
      { component_variant_id: 29, quantity: 1, display_order: 3 },
      { component_variant_id: 39, quantity: 1, display_order: 4 },
      { component_variant_id: 46, quantity: 1, display_order: 5 },
      { component_variant_id: 47, quantity: 1, display_order: 6 },
      { component_variant_id: 53, quantity: 1, display_order: 7 },
    ],
  };

  try {
    log('\n📤 Sending request...', 'yellow');
    log('Endpoint: POST /api/bundles', 'blue');
    log('Data:', 'blue');
    console.log(JSON.stringify(bundleData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/bundles`, bundleData);

    log('\n✅ SUCCESS!', 'green');
    log('Response:', 'green');
    console.log(JSON.stringify(response.data, null, 2));

    // Kiểm tra kết quả
    if (response.data.success) {
      const bundle = response.data.data;
      log(`\n✓ Bundle created: ${bundle.variant_name}`, 'green');
      log(`✓ Variant ID: ${bundle.variant_id}`, 'green');
      log(`✓ Max stock: ${bundle.max_stock}`, 'green');
      log(`✓ Created quantity: ${bundle.created_quantity}`, 'green');
      log(`✓ Number of components: ${bundle.components?.length || 0}`, 'green');
    }
  } catch (error) {
    log('\n❌ FAILED!', 'red');
    if (error.response) {
      log('Error Response:', 'red');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      log('Error:', 'red');
      console.log(error.message);
    }
  }
}

// ============================================================================
// TEST 2: Tạo Bundle với số lượng vượt quá tồn kho (should fail)
// ============================================================================
async function testCreateBundleExceedStock() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('TEST 2: Tạo Bundle với số lượng vượt quá tồn kho (should fail)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  const bundleData = {
    bundle_name: 'PC Gaming High End - Should Fail',
    category_id: 1,
    description: 'Test bundle với số lượng quá lớn',
    price: 20000000,
    quantity: 999, // Số lượng quá lớn
    components: [
      { component_variant_id: 3, quantity: 1, display_order: 1 },
      { component_variant_id: 17, quantity: 1, display_order: 2 },
    ],
  };

  try {
    log('\n📤 Sending request...', 'yellow');
    log('Endpoint: POST /api/bundles', 'blue');
    log('Data:', 'blue');
    console.log(JSON.stringify(bundleData, null, 2));

    const response = await axios.post(`${API_BASE_URL}/bundles`, bundleData);

    log('\n⚠️ UNEXPECTED SUCCESS (should have failed)', 'yellow');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    log('\n✅ EXPECTED FAILURE!', 'green');
    if (error.response) {
      log('Error Response:', 'green');
      console.log(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data.message?.includes('Không đủ linh kiện')) {
        log('\n✓ Validation working correctly!', 'green');
      }
    } else {
      log('Error:', 'red');
      console.log(error.message);
    }
  }
}

// ============================================================================
// TEST 3: Tạo Bundle không có linh kiện (should fail)
// ============================================================================
async function testCreateBundleNoComponents() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('TEST 3: Tạo Bundle không có linh kiện (should fail)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  const bundleData = {
    bundle_name: 'PC Empty - Should Fail',
    category_id: 1,
    description: 'Test bundle không có linh kiện',
    price: 10000000,
    quantity: 1,
    components: [], // Không có linh kiện
  };

  try {
    log('\n📤 Sending request...', 'yellow');
    log('Endpoint: POST /api/bundles', 'blue');

    const response = await axios.post(`${API_BASE_URL}/bundles`, bundleData);

    log('\n⚠️ UNEXPECTED SUCCESS (should have failed)', 'yellow');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    log('\n✅ EXPECTED FAILURE!', 'green');
    if (error.response) {
      log('Error Response:', 'green');
      console.log(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data.message?.includes('ít nhất 1 linh kiện')) {
        log('\n✓ Validation working correctly!', 'green');
      }
    } else {
      log('Error:', 'red');
      console.log(error.message);
    }
  }
}

// ============================================================================
// TEST 4: Tạo Bundle với quantity = 0 (không tạo serial)
// ============================================================================
async function testCreateBundleZeroQuantity() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('TEST 4: Tạo Bundle với quantity = 0 (không tạo serial)', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  const timestamp = Date.now();
  const bundleData = {
    bundle_name: `PC Gaming Mid Range No Serial - Test ${timestamp}`,
    category_id: 1,
    description: 'Bundle chỉ tạo cấu hình, không tạo serial',
    price: 18000000,
    quantity: 0, // Không tạo serial
    components: [
      { component_variant_id: 3, quantity: 1, display_order: 1 },
      { component_variant_id: 17, quantity: 1, display_order: 2 },
    ],
  };

  try {
    log('\n📤 Sending request...', 'yellow');
    log('Endpoint: POST /api/bundles', 'blue');

    const response = await axios.post(`${API_BASE_URL}/bundles`, bundleData);

    log('\n✅ SUCCESS!', 'green');
    log('Response:', 'green');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      const bundle = response.data.data;
      log(`\n✓ Bundle created without serials`, 'green');
      log(`✓ Created quantity: ${bundle.created_quantity}`, 'green');
    }
  } catch (error) {
    log('\n❌ FAILED!', 'red');
    if (error.response) {
      log('Error Response:', 'red');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      log('Error:', 'red');
      console.log(error.message);
    }
  }
}

// ============================================================================
// TEST 5: Lấy chi tiết bundle vừa tạo
// ============================================================================
async function testGetBundleDetail(variantId) {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`TEST 5: Lấy chi tiết bundle (variant_id: ${variantId})`, 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  try {
    log('\n📤 Sending request...', 'yellow');
    log(`Endpoint: GET /api/bundles/${variantId}`, 'blue');

    const response = await axios.get(`${API_BASE_URL}/bundles/${variantId}`);

    log('\n✅ SUCCESS!', 'green');
    log('Bundle Detail:', 'green');
    console.log(JSON.stringify(response.data.data, null, 2));
  } catch (error) {
    log('\n❌ FAILED!', 'red');
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

// ============================================================================
// TEST 6: Kiểm tra tồn kho bundle
// ============================================================================
async function testCheckBundleStock(variantId) {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`TEST 6: Kiểm tra tồn kho bundle (variant_id: ${variantId})`, 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  try {
    log('\n📤 Sending request...', 'yellow');
    log(`Endpoint: GET /api/bundles/${variantId}/stock`, 'blue');

    const response = await axios.get(`${API_BASE_URL}/bundles/${variantId}/stock`);

    log('\n✅ SUCCESS!', 'green');
    log('Stock Info:', 'green');
    console.log(JSON.stringify(response.data.data, null, 2));
  } catch (error) {
    log('\n❌ FAILED!', 'red');
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================
async function runAllTests() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║         BUNDLE API TEST SUITE                            ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  log('Starting tests...', 'yellow');

  try {
    // Test 1: Tạo bundle thành công
    await testCreateBundleSuccess();
    await sleep(1000);

    // Test 2: Tạo bundle vượt quá tồn kho
    await testCreateBundleExceedStock();
    await sleep(1000);

    // Test 3: Tạo bundle không có linh kiện
    await testCreateBundleNoComponents();
    await sleep(1000);

    // Test 4: Tạo bundle với quantity = 0
    await testCreateBundleZeroQuantity();
    await sleep(1000);

    // Test 5 & 6: Nếu muốn test với bundle cụ thể, uncomment và thay variant_id
    // await testGetBundleDetail(1);
    // await sleep(1000);
    // await testCheckBundleStock(1);

    log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
    log('║         ALL TESTS COMPLETED                              ║', 'bright');
    log('╚══════════════════════════════════════════════════════════╝', 'bright');
  } catch (error) {
    log('\n❌ Test suite failed!', 'red');
    console.error(error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run tests
runAllTests();
