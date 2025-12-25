import { db } from '../libs/db.js';

class DashboardController {
  // Get summary statistics
  async getSummary(req, res) {
    try {
      // Count total users
      const [usersResult] = await db.query(
        'SELECT COUNT(*) as count FROM users WHERE role = "user"'
      );
      
      // Count total products
      const [productsResult] = await db.query(
        'SELECT COUNT(DISTINCT product_id) as count FROM products WHERE is_active = 1'
      );
      
      // Calculate total revenue from completed orders
      const [revenueResult] = await db.query(
        'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE order_status = "delivered"'
      );
      
      // Count total orders
      const [ordersResult] = await db.query(
        'SELECT COUNT(*) as count FROM orders'
      );
      
      // Count watchlisted products - return 0 if table doesn't exist
      let watchlistedCount = 0;
      try {
        const [watchlistedResult] = await db.query(
          'SELECT COUNT(DISTINCT variant_id) as count FROM watchlists'
        );
        watchlistedCount = watchlistedResult[0].count;
      } catch (error) {
        // Table doesn't exist, use 0
      }
      
      res.json({
        users: usersResult[0].count,
        products: productsResult[0].count,
        revenue: parseFloat(revenueResult[0].total) || 0,
        orders: ordersResult[0].count,
        watchlisted: watchlistedCount
      });
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      res.status(500).json({ message: 'Lỗi khi lấy thống kê tổng quan' });
    }
  }

  // Get recent orders
  async getRecentOrders(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const [orders] = await db.query(`
        SELECT 
          o.order_id,
          o.total_amount,
          o.order_status,
          o.payment_status,
          o.created_at,
          COALESCE(u.full_name, u.username, a.recipient_name, 'Khách') as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN addresses a ON o.address_id = a.address_id
        ORDER BY o.created_at DESC
        LIMIT ?
      `, [limit]);
      
      res.json(orders);
    } catch (error) {
      console.error('Error getting recent orders:', error);
      res.status(500).json({ message: 'Lỗi khi lấy đơn hàng gần đây' });
    }
  }

  // Get top selling products
  async getTopSelling(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const [products] = await db.query(`
        SELECT 
          p.product_id,
          p.product_name,
          c.category_name,
          SUM(oi.quantity) as total_sold,
          MIN(v.price) as price,
          SUM(v.stock_quantity) as stock
        FROM order_items oi
        JOIN product_variants v ON oi.variant_id = v.variant_id
        JOIN products p ON v.product_id = p.product_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipping', 'confirmed')
        GROUP BY p.product_id, p.product_name, c.category_name
        ORDER BY total_sold DESC
        LIMIT ?
      `, [limit]);
      
      res.json(products);
    } catch (error) {
      console.error('Error getting top selling products:', error);
      res.status(500).json({ message: 'Lỗi khi lấy sản phẩm bán chạy' });
    }
  }

  // Get order status distribution
  async getOrderStatusDistribution(req, res) {
    try {
      const [results] = await db.query(`
        SELECT 
          order_status as status,
          COUNT(*) as count
        FROM orders
        GROUP BY order_status
      `);
      
      res.json(results);
    } catch (error) {
      console.error('Error getting order status distribution:', error);
      res.status(500).json({ message: 'Lỗi khi lấy phân bổ trạng thái đơn hàng' });
    }
  }

  // Get category distribution
  async getCategoryDistribution(req, res) {
    try {
      const [results] = await db.query(`
        SELECT 
          c.category_name,
          COUNT(DISTINCT p.product_id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.category_id = p.category_id AND p.is_active = 1
        GROUP BY c.category_id, c.category_name
        HAVING product_count > 0
        ORDER BY product_count DESC
      `);
      
      res.json(results);
    } catch (error) {
      console.error('Error getting category distribution:', error);
      res.status(500).json({ message: 'Lỗi khi lấy phân bổ danh mục' });
    }
  }

  // Get revenue by period (weekly)
  async getRevenueByPeriod(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      let query = `
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE order_status = 'delivered'
      `;
      
      const params = [];
      if (start_date && end_date) {
        query += ' AND DATE(created_at) BETWEEN ? AND ?';
        params.push(start_date, end_date);
      } else {
        // Default to last 30 days
        query += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
      }
      
      query += ' GROUP BY DATE(created_at) ORDER BY date ASC';
      
      const [results] = await db.query(query, params);
      
      res.json(results);
    } catch (error) {
      console.error('Error getting revenue by period:', error);
      res.status(500).json({ message: 'Lỗi khi lấy doanh thu theo thời gian' });
    }
  }

  // Get top viewed variants
  async getTopViewedVariants(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      // Check if recent_views table exists, if not return empty array
      try {
        const [results] = await db.query(`
          SELECT 
            rv.variant_id,
            p.product_name,
            v.variant_name,
            COUNT(*) as view_count
          FROM recent_views rv
          JOIN product_variants v ON rv.variant_id = v.variant_id
          JOIN products p ON v.product_id = p.product_id
          WHERE rv.viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY rv.variant_id, p.product_name, v.variant_name
          ORDER BY view_count DESC
          LIMIT ?
        `, [limit]);
        
        res.json(results);
      } catch (tableError) {
        // If table doesn't exist, return empty array
        res.json([]);
      }
    } catch (error) {
      console.error('Error getting top viewed variants:', error);
      res.status(500).json({ message: 'Lỗi khi lấy sản phẩm xem nhiều' });
    }
  }

  // Get top active users
  async getTopActiveUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      // Check if recent_views table exists
      try {
        const [results] = await db.query(`
          SELECT 
            u.user_id,
            u.username,
            u.fullname,
            COUNT(DISTINCT rv.view_id) as recent_views
          FROM users u
          LEFT JOIN recent_views rv ON u.user_id = rv.user_id 
            AND rv.viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          WHERE u.role = 'user'
          GROUP BY u.user_id, u.username, u.fullname
          ORDER BY recent_views DESC
          LIMIT ?
        `, [limit]);
        
        res.json(results);
      } catch (tableError) {
        // If table doesn't exist, get users by order count instead
        const [results] = await db.query(`
          SELECT 
            u.user_id,
            u.username,
            u.full_name,
            COUNT(DISTINCT o.order_id) as recent_views
          FROM users u
          LEFT JOIN orders o ON u.user_id = o.user_id 
            AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          WHERE u.role = 0
          GROUP BY u.user_id, u.username, u.full_name
          ORDER BY recent_views DESC
          LIMIT ?
        `, [limit]);
        
        res.json(results);
      }
    } catch (error) {
      console.error('Error getting top active users:', error);
      res.status(500).json({ message: 'Lỗi khi lấy người dùng hoạt động' });
    }
  }
}

export default new DashboardController();
