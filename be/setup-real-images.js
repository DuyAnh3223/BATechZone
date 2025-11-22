// Script để thêm ảnh thực tế từ thư mục uploads vào database
// Run: node setup-real-images.js

import { db } from './src/libs/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setupRealImages() {
  try {
    // Thư mục chứa ảnh
    const uploadsDir = path.join(__dirname, 'uploads', 'variants');
    
    // Thư mục variants có ảnh
    const variantDirs = ['363', '367', '368'];
    
    for (const variantIdStr of variantDirs) {
      const variantId = variantIdStr.trim();
      console.log(`\n📦 Processing variant: ${variantId}`);
      
      const variantPath = path.join(uploadsDir, variantId);
      
      try {
        // Kiểm tra xem thư mục có tồn tại không
        console.log(`  Checking path: ${variantPath}`);
        await fs.access(variantPath);
        
        // Lấy danh sách file
        const files = await fs.readdir(variantPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        
        console.log(`  Found ${imageFiles.length} images`);
        
        // Xóa ảnh cũ của variant này
        await db.query('DELETE FROM variant_images WHERE variant_id = ?', [variantId]);
        console.log(`  Deleted old images for variant ${variantId}`);
        
        // Thêm ảnh mới
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const imageUrl = `/uploads/variants/${variantId}/${file}`;
          const isPrimary = i === 0; // Ảnh đầu tiên là primary
          
          const [result] = await db.query(
            `INSERT INTO variant_images (variant_id, image_url, is_primary, display_order, alt_text)
             VALUES (?, ?, ?, ?, ?)`,
            [variantId, imageUrl, isPrimary ? 1 : 0, i, `Image ${i + 1}`]
          );
          
          console.log(`  ✓ Added: ${file} (ID: ${result.insertId}, Primary: ${isPrimary})`);
        }
      } catch (error) {
        console.log(`  ⚠️  Error: ${error.message}`);
      }
    }
    
    console.log('\n✅ Real images setup completed!');
    console.log('\nVariant images added:');
    
    // Show summary
    const [summary] = await db.query(`
      SELECT v.variant_id, p.product_name, COUNT(vi.image_id) as image_count
      FROM product_variants v
      LEFT JOIN products p ON v.product_id = p.product_id
      LEFT JOIN variant_images vi ON v.variant_id = vi.variant_id
      WHERE v.variant_id IN (363, 367, 368)
      GROUP BY v.variant_id
    `);
    
    console.table(summary);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setupRealImages();
