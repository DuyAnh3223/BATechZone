-- ============================================================================
-- BUNDLE SYSTEM - VIEWS AND STORED PROCEDURES
-- ============================================================================
-- Tạo các VIEW và stored procedures cần thiết cho hệ thống Bundle
-- Chạy file này sau khi đã có các bảng: products, product_variants, 
-- bundle_items, variant_serials
-- ============================================================================

-- ============================================================================
-- 1. VIEW: v_bundle_stock
-- ============================================================================
-- Tính toán tồn kho động của bundle dựa trên linh kiện có số lượng ít nhất
-- ============================================================================

DROP VIEW IF EXISTS v_bundle_stock;

CREATE VIEW v_bundle_stock AS
SELECT 
    pv.variant_id,
    pv.product_id,
    pv.sku,
    pv.variant_name,
    COALESCE(
        FLOOR(
            MIN(
                (SELECT COUNT(*) 
                 FROM variant_serials vs 
                 WHERE vs.variant_id = bi.component_variant_id 
                   AND vs.status = 'in_stock'
                   AND vs.serial_type = 'component'
                ) / bi.quantity
            )
        ), 
        0
    ) as available_stock
FROM product_variants pv
LEFT JOIN bundle_items bi ON pv.variant_id = bi.bundle_variant_id
WHERE pv.variant_type = 'bundle'
  AND pv.is_active = 1
GROUP BY pv.variant_id, pv.product_id, pv.sku, pv.variant_name;


-- ============================================================================
-- 2. STORED PROCEDURE: sp_get_bundle_stock
-- ============================================================================
-- Lấy tồn kho của một bundle cụ thể
-- ============================================================================

DROP PROCEDURE IF EXISTS sp_get_bundle_stock;

DELIMITER $$

CREATE PROCEDURE sp_get_bundle_stock(
    IN p_bundle_variant_id INT,
    OUT p_available_stock INT
)
BEGIN
    -- Tính tồn kho bundle = MIN(số lượng linh kiện / số lượng cần dùng)
    SELECT COALESCE(
        FLOOR(
            MIN(
                (SELECT COUNT(*) 
                 FROM variant_serials vs 
                 WHERE vs.variant_id = bi.component_variant_id 
                   AND vs.status = 'in_stock'
                   AND vs.serial_type = 'component'
                ) / bi.quantity
            )
        ), 
        0
    )
    INTO p_available_stock
    FROM bundle_items bi
    WHERE bi.bundle_variant_id = p_bundle_variant_id;
    
    -- Nếu không có linh kiện nào, trả về 0
    IF p_available_stock IS NULL THEN
        SET p_available_stock = 0;
    END IF;
END$$

DELIMITER ;


-- ============================================================================
-- 3. STORED PROCEDURE: sp_sell_pc_bundle
-- ============================================================================
-- Xử lý bán PC Bundle: gán serial cho từng linh kiện và tạo serial bundle
-- ============================================================================

DROP PROCEDURE IF EXISTS sp_sell_pc_bundle;

DELIMITER $$

CREATE PROCEDURE sp_sell_pc_bundle(
    IN p_bundle_variant_id INT,
    IN p_order_item_id INT,
    OUT p_success BOOLEAN,
    OUT p_message VARCHAR(255),
    OUT p_serial_number VARCHAR(64)
)
BEGIN
    DECLARE v_available_stock INT DEFAULT 0;
    DECLARE v_bundle_sku VARCHAR(50);
    DECLARE v_bundle_serial VARCHAR(64);
    DECLARE v_component_variant_id INT;
    DECLARE v_quantity_needed INT;
    DECLARE v_serials_assigned INT;
    DECLARE done INT DEFAULT 0;
    
    -- Cursor để duyệt qua các linh kiện trong bundle
    DECLARE component_cursor CURSOR FOR
        SELECT component_variant_id, quantity
        FROM bundle_items
        WHERE bundle_variant_id = p_bundle_variant_id
        ORDER BY display_order;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    -- Bắt đầu transaction
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_message = 'Lỗi khi bán bundle';
        SET p_serial_number = NULL;
    END;
    
    START TRANSACTION;
    
    -- Kiểm tra tồn kho
    CALL sp_get_bundle_stock(p_bundle_variant_id, v_available_stock);
    
    IF v_available_stock < 1 THEN
        SET p_success = FALSE;
        SET p_message = 'Bundle hết hàng';
        SET p_serial_number = NULL;
        ROLLBACK;
    ELSE
        -- Lấy SKU của bundle để tạo serial
        SELECT sku INTO v_bundle_sku
        FROM product_variants
        WHERE variant_id = p_bundle_variant_id;
        
        -- Tạo serial cho bundle (định dạng: BUNDLE-SKU-TIMESTAMP)
        SET v_bundle_serial = CONCAT('BUNDLE-', v_bundle_sku, '-', UNIX_TIMESTAMP());
        
        -- Duyệt qua từng linh kiện và gán serial
        OPEN component_cursor;
        
        component_loop: LOOP
            FETCH component_cursor INTO v_component_variant_id, v_quantity_needed;
            
            IF done THEN
                LEAVE component_loop;
            END IF;
            
            -- Gán serial cho linh kiện (lấy số lượng cần thiết)
            UPDATE variant_serials
            SET status = 'sold',
                order_item_id = p_order_item_id,
                updated_at = CURRENT_TIMESTAMP
            WHERE variant_id = v_component_variant_id
              AND status = 'in_stock'
              AND serial_type = 'component'
            ORDER BY created_at ASC
            LIMIT v_quantity_needed;
            
            -- Kiểm tra xem đã gán đủ serial chưa
            SET v_serials_assigned = ROW_COUNT();
            
            IF v_serials_assigned < v_quantity_needed THEN
                SET p_success = FALSE;
                SET p_message = CONCAT('Không đủ linh kiện variant_id: ', v_component_variant_id);
                SET p_serial_number = NULL;
                ROLLBACK;
                LEAVE component_loop;
            END IF;
            
        END LOOP;
        
        CLOSE component_cursor;
        
        -- Nếu tất cả linh kiện đã được gán, tạo serial cho bundle
        IF p_success IS NULL OR p_success = TRUE THEN
            INSERT INTO variant_serials (
                variant_id, 
                serial_number, 
                status, 
                order_item_id,
                serial_type,
                created_at,
                updated_at
            ) VALUES (
                p_bundle_variant_id,
                v_bundle_serial,
                'sold',
                p_order_item_id,
                'pc_bundle',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            );
            
            SET p_success = TRUE;
            SET p_message = 'Bán bundle thành công';
            SET p_serial_number = v_bundle_serial;
            
            COMMIT;
        END IF;
    END IF;
    
END$$

DELIMITER ;


-- ============================================================================
-- 4. TEST QUERIES
-- ============================================================================
-- Các câu lệnh để test xem VIEW và procedures có hoạt động đúng không
-- ============================================================================

-- Test VIEW: Xem tồn kho của tất cả bundles
-- SELECT * FROM v_bundle_stock;

-- Test stored procedure: Kiểm tra tồn kho của một bundle cụ thể
-- CALL sp_get_bundle_stock(1, @stock);
-- SELECT @stock as available_stock;

-- Test bán bundle (chỉ test sau khi đã có order_item_id hợp lệ)
-- CALL sp_sell_pc_bundle(1, 999, @success, @message, @serial);
-- SELECT @success, @message, @serial;
