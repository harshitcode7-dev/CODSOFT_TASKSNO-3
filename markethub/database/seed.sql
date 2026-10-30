-- MarketHub Seed Data
-- Insert demo data for testing

-- Insert Admin Users
INSERT INTO users (email, password, role, first_name, last_name, phone, is_active, is_verified) VALUES
('admin@markethub.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'ADMIN', 'Super', 'Admin', '9876543210', true, true),
('admin2@markethub.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'ADMIN', 'System', 'Admin', '9876543211', true, true),
('admin3@markethub.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'ADMIN', 'Support', 'Admin', '9876543212', true, true);

-- Insert Customers
INSERT INTO users (email, password, role, first_name, last_name, phone, is_active, is_verified) VALUES
('rahul@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Rahul', 'Sharma', '9876543220', true, true),
('priya@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Priya', 'Singh', '9876543221', true, true),
('amit@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Amit', 'Kumar', '9876543222', true, true),
('neha@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Neha', 'Gupta', '9876543223', true, true),
('vikram@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Vikram', 'Patel', '9876543224', true, true),
('sneha@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Sneha', 'Reddy', '9876543225', true, true),
('arjun@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Arjun', 'Verma', '9876543226', true, true),
('pooja@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Pooja', 'Mehta', '9876543227', true, true),
('rohit@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Rohit', 'Das', '9876543228', true, true),
('kavita@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Kavita', 'Jain', '9876543229', true, true),
('suresh@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Suresh', 'Nair', '9876543230', true, true),
('anita@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Anita', 'Iyer', '9876543231', true, true),
('raj@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Raj', 'Malhotra', '9876543232', true, true),
('meera@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Meera', 'Chopra', '9876543233', true, true),
('deepak@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Deepak', 'Saxena', '9876543234', true, true),
('rani@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Rani', 'Kaur', '9876543235', true, true),
('manish@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Manish', 'Bhatia', '9876543236', true, true),
('divya@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Divya', 'Seth', '9876543237', true, true),
('karthik@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Karthik', 'Rao', '9876543238', true, true),
('swati@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'CUSTOMER', 'Swati', 'Menon', '9876543239', true, true);

-- Insert customers
INSERT INTO customers (user_id) SELECT id FROM users WHERE role = 'CUSTOMER';

-- Insert Vendors
INSERT INTO users (email, password, role, first_name, last_name, phone, is_active, is_verified) VALUES
('techworld@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'VENDOR', 'Rajesh', 'Kumar', '9876543300', true, true),
('fashionhub@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'VENDOR', 'Meena', 'Devi', '9876543301', true, true),
('homemart@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'VENDOR', 'Suresh', 'Patel', '9876543302', true, true),
('electrozone@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'VENDOR', 'Amit', 'Shah', '9876543303', true, true),
('dailyneeds@gmail.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'VENDOR', 'Lakshmi', 'Prasad', '9876543304', true, true);

-- Insert vendor details
INSERT INTO vendors (user_id, business_name, gst_number, pan_number, status, commission_rate, bank_name, bank_account_number, bank_ifsc, total_earnings, available_balance) VALUES
(24, 'TechWorld Electronics', '29AAAC1234F1Z5', 'AAAC1234A', 'APPROVED', 10.00, 'HDFC Bank', '123456789012', 'HDFC0001234', 250000.00, 200000.00),
(25, 'FashionHub Trends', '27BBBC5678F1Z9', 'BBBC5678B', 'APPROVED', 12.00, 'ICICI Bank', '234567890123', 'ICIC0002345', 180000.00, 150000.00),
(26, 'HomeMart Essentials', '29CCCD9012F1Z3', 'CCCD9012C', 'APPROVED', 8.00, 'SBI', '345678901234', 'SBIN0003456', 320000.00, 280000.00),
(27, 'ElectroZone Gadgets', '27DDDE3456F1Z7', 'DDDE3456D', 'APPROVED', 10.00, 'Axis Bank', '456789012345', 'UTIB0004567', 195000.00, 160000.00),
(28, 'DailyNeeds Store', '29EEFF7890F1Z1', 'EEFF7890E', 'APPROVED', 15.00, 'Kotak Bank', '567890123456', 'KKBK0005678', 145000.00, 120000.00);

-- Insert vendor profiles
INSERT INTO vendor_profiles (vendor_id, business_description, business_address, city, state, pincode, rating, total_reviews, total_products, total_sales) VALUES
(1, 'Premium electronics and gadgets store with the latest technology products at competitive prices.', '123 Tech Park, Electronic City', 'Bangalore', 'Karnataka', '560100', 4.5, 156, 25, 890),
(2, 'Trendy fashion destination for men, women, and kids. Quality clothing at affordable prices.', '456 Fashion Street, Commercial Area', 'Mumbai', 'Maharashtra', '400001', 4.3, 234, 30, 1245),
(3, 'One-stop shop for all home essentials. Quality products for every home.', '789 Home Lane, Sector 18', 'Delhi', 'Delhi', '110001', 4.4, 189, 20, 756),
(4, 'Your destination for the latest gadgets and electronic accessories.', '321 Gadget Road, IT Park', 'Hyderabad', 'Telangana', '500081', 4.2, 98, 18, 567),
(5, 'Daily grocery and household items delivered to your doorstep.', '654 Market Road, Central Area', 'Chennai', 'Tamil Nadu', '600001', 4.1, 76, 15, 432);

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url, is_active, display_order) VALUES
('Electronics', 'electronics', 'Electronic devices, gadgets, and accessories', NULL, true, 1),
('Fashion', 'fashion', 'Clothing, footwear, and fashion accessories', NULL, true, 2),
('Home & Kitchen', 'home-kitchen', 'Home appliances, kitchenware, and decor', NULL, true, 3),
('Grocery', 'grocery', 'Food items, daily essentials, and household supplies', NULL, true, 4),
('Beauty & Personal Care', 'beauty-personal-care', 'Skincare, makeup, and personal care products', NULL, true, 5),
('Sports & Fitness', 'sports-fitness', 'Sports equipment, fitness gear, and accessories', NULL, true, 6),
('Books & Stationery', 'books-stationery', 'Books, notebooks, and office supplies', NULL, true, 7),
('Accessories', 'accessories', 'Bags, watches, jewelry, and other accessories', NULL, true, 8);

-- Insert Products (Electronics from TechWorld)
INSERT INTO products (vendor_id, category_id, sku, name, slug, description, price, discount_price, discount_percentage, status, is_featured, rating, total_reviews, total_sold) VALUES
(1, 1, 'TECH-001', 'Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'High-quality wireless headphones with noise cancellation and 30-hour battery life.', 2999.00, 2499.00, 17, 'ACTIVE', true, 4.5, 45, 234),
(1, 1, 'TECH-002', 'Smart Watch Series 5', 'smart-watch-series-5', 'Advanced smartwatch with heart rate monitor, GPS, and 7-day battery life.', 8999.00, 7999.00, 11, 'ACTIVE', true, 4.6, 67, 189),
(1, 1, 'TECH-003', 'USB-C Fast Charger 65W', 'usb-c-fast-charger-65w', 'Universal fast charger compatible with laptops and phones.', 1999.00, 1499.00, 25, 'ACTIVE', false, 4.3, 32, 456),
(1, 1, 'TECH-004', 'Wireless Mouse Ergonomic', 'wireless-mouse-ergonomic', 'Ergonomic wireless mouse with precision tracking and long battery life.', 899.00, 699.00, 22, 'ACTIVE', false, 4.2, 28, 567),
(1, 1, 'TECH-005', 'Mechanical Keyboard RGB', 'mechanical-keyboard-rgb', 'Gaming mechanical keyboard with RGB backlighting and custom keys.', 3499.00, 2999.00, 14, 'ACTIVE', true, 4.7, 54, 123),
(1, 1, 'TECH-006', '4K Webcam HD', '4k-webcam-hd', 'Ultra HD webcam with auto-focus and built-in microphone.', 4499.00, 3999.00, 11, 'ACTIVE', false, 4.4, 38, 89),
(1, 1, 'TECH-007', 'Portable Power Bank 20000mAh', 'portable-power-bank-20000mah', 'High-capacity power bank with fast charging support.', 1799.00, 1499.00, 17, 'ACTIVE', true, 4.5, 72, 678),
(1, 1, 'TECH-008', 'Wireless Earbuds Pro', 'wireless-earbuds-pro', 'True wireless earbuds with active noise cancellation.', 3999.00, 3499.00, 13, 'ACTIVE', true, 4.6, 89, 345),
(1, 1, 'TECH-009', 'Laptop Stand Adjustable', 'laptop-stand-adjustable', 'Ergonomic aluminum laptop stand with adjustable height.', 1499.00, 1199.00, 20, 'ACTIVE', false, 4.3, 23, 156),
(1, 1, 'TECH-010', 'USB Hub 7-Port', 'usb-hub-7-port', 'High-speed USB hub with 7 ports and power adapter.', 999.00, 799.00, 20, 'ACTIVE', false, 4.1, 19, 234);

-- Insert Products (Fashion from FashionHub)
INSERT INTO products (vendor_id, category_id, sku, name, slug, description, price, discount_price, discount_percentage, status, is_featured, rating, total_reviews, total_sold) VALUES
(2, 2, 'FASH-001', 'Men Cotton Shirt Formal', 'men-cotton-shirt-formal', 'Premium cotton formal shirt perfect for office wear.', 1499.00, 1199.00, 20, 'ACTIVE', true, 4.4, 56, 456),
(2, 2, 'FASH-002', 'Women Kurti Ethnic', 'women-kurti-ethnic', 'Beautiful ethnic kurti with intricate embroidery.', 999.00, 799.00, 20, 'ACTIVE', true, 4.5, 78, 567),
(2, 2, 'FASH-003', 'Men Jeans Slim Fit', 'men-jeans-slim-fit', 'Stylish slim fit jeans with premium denim.', 1799.00, 1499.00, 17, 'ACTIVE', false, 4.3, 45, 345),
(2, 2, 'FASH-004', 'Women Leggings Pack of 3', 'women-leggings-pack-3', 'Comfortable cotton leggings pack of 3.', 899.00, 699.00, 22, 'ACTIVE', true, 4.6, 92, 789),
(2, 2, 'FASH-005', 'Men T-Shirt Casual', 'men-t-shirt-casual', '100% cotton casual t-shirt in multiple colors.', 599.00, 449.00, 25, 'ACTIVE', false, 4.2, 34, 567),
(2, 2, 'FASH-006', 'Women Saree Silk', 'women-saree-silk', 'Elegant silk saree with traditional design.', 4999.00, 3999.00, 20, 'ACTIVE', true, 4.7, 65, 234),
(2, 2, 'FASH-007', 'Men Polo Shirt', 'men-polo-shirt', 'Classic polo shirt with premium fabric.', 899.00, 699.00, 22, 'ACTIVE', false, 4.3, 28, 345),
(2, 2, 'FASH-008', 'Women Dress Party', 'women-dress-party', 'Stunning party dress with modern design.', 2499.00, 1999.00, 20, 'ACTIVE', true, 4.5, 51, 189),
(2, 2, 'FASH-009', 'Men Hoodie Winter', 'men-hoodie-winter', 'Warm winter hoodie with fleece lining.', 1299.00, 999.00, 23, 'ACTIVE', false, 4.4, 39, 456),
(2, 2, 'FASH-010', 'Women Top Casual', 'women-top-casual', 'Stylish casual top for everyday wear.', 699.00, 499.00, 29, 'ACTIVE', false, 4.1, 25, 678);

-- Insert Products (Home & Kitchen from HomeMart)
INSERT INTO products (vendor_id, category_id, sku, name, slug, description, price, discount_price, discount_percentage, status, is_featured, rating, total_reviews, total_sold) VALUES
(3, 3, 'HOME-001', 'Non-Stick Cookware Set', 'non-stick-cookware-set', '5-piece non-stick cookware set with lids.', 3999.00, 2999.00, 25, 'ACTIVE', true, 4.5, 67, 345),
(3, 3, 'HOME-002', 'Blender Mixer Grinder', 'blender-mixer-grinder', '750W mixer grinder with 3 jars.', 2999.00, 2499.00, 17, 'ACTIVE', true, 4.4, 54, 456),
(3, 3, 'HOME-003', 'Stainless Steel Water Dispenser', 'stainless-steel-water-dispenser', '20L stainless steel water dispenser with tap.', 1499.00, 1199.00, 20, 'ACTIVE', false, 4.3, 32, 567),
(3, 3, 'HOME-004', 'Dinner Set Ceramic 24-Piece', 'dinner-set-ceramic-24-piece', 'Elegant ceramic dinner set for 6 people.', 4999.00, 3999.00, 20, 'ACTIVE', true, 4.6, 78, 234),
(3, 3, 'HOME-005', 'Vacuum Cleaner Cordless', 'vacuum-cleaner-cordless', 'Lightweight cordless vacuum cleaner with HEPA filter.', 8999.00, 7499.00, 17, 'ACTIVE', true, 4.5, 45, 189),
(3, 3, 'HOME-006', 'Electric Kettle 1.5L', 'electric-kettle-1.5l', 'Fast boiling electric kettle with auto shut-off.', 899.00, 699.00, 22, 'ACTIVE', false, 4.2, 28, 678),
(3, 3, 'HOME-007', 'Air Fryer 4L', 'air-fryer-4l', 'Healthy air fryer with rapid air technology.', 5999.00, 4999.00, 17, 'ACTIVE', true, 4.7, 62, 345),
(3, 3, 'HOME-008', 'Bed Sheet Set King Size', 'bed-sheet-set-king-size', '100% cotton bed sheet set with pillow covers.', 1499.00, 1199.00, 20, 'ACTIVE', false, 4.4, 38, 567),
(3, 3, 'HOME-009', 'LED Desk Lamp Adjustable', 'led-desk-lamp-adjustable', 'Modern LED desk lamp with adjustable brightness.', 999.00, 799.00, 20, 'ACTIVE', false, 4.3, 21, 234),
(3, 3, 'HOME-010', 'Storage Box Set Plastic', 'storage-box-set-plastic', 'Set of 5 transparent storage boxes.', 799.00, 599.00, 25, 'ACTIVE', false, 4.1, 18, 456);

-- Insert Products (Grocery from DailyNeeds)
INSERT INTO products (vendor_id, category_id, sku, name, slug, description, price, discount_price, discount_percentage, status, is_featured, rating, total_reviews, total_sold) VALUES
(5, 4, 'GROC-001', 'Basmati Rice 5kg Premium', 'basmati-rice-5kg-premium', 'Premium aged basmati rice.', 699.00, 599.00, 14, 'ACTIVE', true, 4.5, 89, 1234),
(5, 4, 'GROC-002', 'Wheat Flour Atta 10kg', 'wheat-flour-atta-10kg', 'Whole wheat atta for rotis.', 399.00, 349.00, 13, 'ACTIVE', true, 4.4, 76, 1567),
(5, 4, 'GROC-003', 'Toor Dal 1kg', 'toor-dal-1kg', 'Premium quality toor dal.', 149.00, 119.00, 20, 'ACTIVE', false, 4.3, 54, 890),
(5, 4, 'GROC-004', 'Cooking Oil 1L Sunflower', 'cooking-oil-1l-sunflower', 'Refined sunflower cooking oil.', 199.00, 169.00, 15, 'ACTIVE', true, 4.6, 67, 1123),
(5, 4, 'GROC-005', 'Sugar 1kg', 'sugar-1kg', 'Refined white sugar.', 49.00, 39.00, 20, 'ACTIVE', false, 4.2, 34, 2345),
(5, 4, 'GROC-006', 'Tea Premium 500g', 'tea-premium-500g', 'Premium Assam tea leaves.', 399.00, 349.00, 13, 'ACTIVE', true, 4.5, 58, 678),
(5, 4, 'GROC-007', 'Coffee Powder 200g', 'coffee-powder-200g', 'Premium filter coffee powder.', 299.00, 249.00, 17, 'ACTIVE', false, 4.4, 45, 456),
(5, 4, 'GROC-008', 'Salt Iodized 1kg', 'salt-iodized-1kg', 'Iodized table salt.', 29.00, 24.00, 17, 'ACTIVE', false, 4.1, 23, 3456),
(5, 4, 'GROC-009', 'Spices Box Set', 'spices-box-set', 'Assorted Indian spices pack.', 499.00, 399.00, 20, 'ACTIVE', true, 4.6, 72, 567),
(5, 4, 'GROC-010', 'Dry Fruits Mix 500g', 'dry-fruits-mix-500g', 'Premium mixed dry fruits.', 899.00, 749.00, 17, 'ACTIVE', false, 4.5, 48, 234);

-- Insert Products (Electronics from ElectroZone)
INSERT INTO products (vendor_id, category_id, sku, name, slug, description, price, discount_price, discount_percentage, status, is_featured, rating, total_reviews, total_sold) VALUES
(4, 1, 'ELEC-001', 'Smartphone Android 128GB', 'smartphone-android-128gb', 'Latest Android smartphone with 128GB storage.', 15999.00, 13999.00, 13, 'ACTIVE', true, 4.5, 89, 456),
(4, 1, 'ELEC-002', 'Tablet 10 inch WiFi', 'tablet-10-inch-wifi', '10-inch Android tablet with HD display.', 12999.00, 10999.00, 15, 'ACTIVE', true, 4.4, 67, 345),
(4, 1, 'ELEC-003', 'Laptop 15.6 inch i5', 'laptop-15.6-inch-i5', 'Powerful laptop with Intel i5 processor.', 44999.00, 39999.00, 11, 'ACTIVE', true, 4.6, 78, 234),
(4, 1, 'ELEC-004', 'Wireless Charger Stand', 'wireless-charger-stand', 'Fast wireless charging stand for phones.', 1299.00, 999.00, 23, 'ACTIVE', false, 4.3, 34, 567),
(4, 1, 'ELEC-005', 'Phone Case Universal', 'phone-case-universal', 'Premium universal phone case.', 399.00, 299.00, 25, 'ACTIVE', false, 4.1, 23, 890),
(4, 1, 'ELEC-006', 'Screen Tempered Glass', 'screen-tempered-glass', 'Tempered glass screen protector.', 199.00, 149.00, 25, 'ACTIVE', false, 4.2, 45, 1234),
(4, 1, 'ELEC-007', 'Bluetooth Speaker Portable', 'bluetooth-speaker-portable', 'Portable Bluetooth speaker with bass.', 1999.00, 1699.00, 15, 'ACTIVE', true, 4.5, 56, 456),
(4, 1, 'ELEC-008', 'Wireless Keyboard Touchpad', 'wireless-keyboard-touchpad', 'Wireless keyboard with built-in touchpad.', 1799.00, 1499.00, 17, 'ACTIVE', false, 4.3, 28, 345),
(4, 1, 'ELEC-009', 'Cable Management Kit', 'cable-management-kit', 'Complete cable management solution.', 499.00, 399.00, 20, 'ACTIVE', false, 4.1, 19, 567),
(4, 1, 'ELEC-010', 'Laptop Sleeve 15 inch', 'laptop-sleeve-15-inch', 'Padded laptop sleeve for protection.', 799.00, 599.00, 25, 'ACTIVE', false, 4.2, 21, 234);

-- Insert Inventory for all products
INSERT INTO inventory (product_id, current_stock, reserved_stock, available_stock, minimum_stock)
SELECT id, 100, 0, 100, 10 FROM products;

-- Insert Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES
-- TechWorld Electronics Images
(1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Wireless Bluetooth Headphones', true, 1),
(1, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', 'Headphones side view', false, 2),
(2, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Smart Watch', true, 1),
(2, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500', 'Smart Watch features', false, 2),
(3, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', 'USB-C Fast Charger', true, 1),
(4, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 'Wireless Mouse', true, 1),
(5, 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500', 'Mechanical Keyboard', true, 1),
(6, 'https://images.unsplash.com/photo-1587825110354-8f0f8d6a6be9?w=500', '4K Webcam', true, 1),
(7, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 'Power Bank', true, 1),
(8, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 'Wireless Earbuds', true, 1),
(9, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 'Laptop Stand', true, 1),
(10, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', 'USB Hub', true, 1),
-- FashionHub Images
(11, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 'Men Cotton Shirt', true, 1),
(12, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', 'Women Kurti', true, 1),
(13, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'Men Jeans', true, 1),
(14, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', 'Women Leggings', true, 1),
(15, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'Men T-Shirt', true, 1),
(16, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', 'Women Saree', true, 1),
(17, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', 'Men Polo Shirt', true, 1),
(18, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 'Women Dress', true, 1),
(19, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'Men Hoodie', true, 1),
(20, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=500', 'Women Top', true, 1),
-- HomeMart Images
(21, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 'Non-Stick Cookware', true, 1),
(22, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500', 'Blender Mixer', true, 1),
(23, 'https://images.unsplash.com/photo-1594213114383-c6895f868826?w=500', 'Water Dispenser', true, 1),
(24, 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500', 'Dinner Set', true, 1),
(25, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500', 'Vacuum Cleaner', true, 1),
(26, 'https://images.unsplash.com/photo-1594213114383-c6895f868826?w=500', 'Electric Kettle', true, 1),
(27, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 'Air Fryer', true, 1),
(28, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', 'Bed Sheet Set', true, 1),
(29, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 'LED Desk Lamp', true, 1),
(30, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', 'Storage Box', true, 1),
-- DailyNeeds Images
(41, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', 'Basmati Rice', true, 1),
(42, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', 'Wheat Flour', true, 1),
(43, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', 'Toor Dal', true, 1),
(44, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 'Cooking Oil', true, 1),
(45, 'https://images.unsplash.com/photo-1587351021759-3e537b527c4c?w=500', 'Sugar', true, 1),
(46, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', 'Tea', true, 1),
(47, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500', 'Coffee', true, 1),
(48, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 'Salt', true, 1),
(49, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', 'Spices', true, 1),
(50, 'https://images.unsplash.com/photo-1621939514649-280dc2ecda65?w=500', 'Dry Fruits', true, 1),
-- ElectroZone Images
(31, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Smartphone', true, 1),
(32, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 'Tablet', true, 1),
(33, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 'Laptop', true, 1),
(34, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', 'Wireless Charger', true, 1),
(35, 'https://images.unsplash.com/photo-1581224923-6c0cf1d0ac56?w=500', 'Phone Case', true, 1),
(36, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', 'Screen Protector', true, 1),
(37, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Bluetooth Speaker', true, 1),
(38, 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500', 'Wireless Keyboard', true, 1),
(39, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', 'Cable Management', true, 1),
(40, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', 'Laptop Sleeve', true, 1);

-- Insert sample addresses for customers
INSERT INTO addresses (user_id, address_type, full_name, phone, house_flat, street, city, state, pincode, is_default) VALUES
(4, 'HOME', 'Rahul Sharma', '9876543220', 'A-102', 'MG Road', 'Bangalore', 'Karnataka', '560001', true),
(5, 'HOME', 'Priya Singh', '9876543221', 'B-203', 'Connaught Place', 'Delhi', 'Delhi', '110001', true),
(6, 'HOME', 'Amit Kumar', '9876543222', 'C-304', 'Marine Drive', 'Mumbai', 'Maharashtra', '400001', true),
(7, 'HOME', 'Neha Gupta', '9876543223', 'D-405', 'T Nagar', 'Chennai', 'Tamil Nadu', '600001', true);

-- Insert Delivery Partner
INSERT INTO users (email, password, role, first_name, last_name, phone, is_active, is_verified) VALUES
('delivery@markethub.com', '$2b$10$KB5INm8wfRPLRlohm48iou9A7e6ewKvc.P23tLO1VfdzO.xEem0B.', 'DELIVERY_PARTNER', 'Ravi', 'Kumar', '9876543400', true, true);

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount, usage_limit, used_count, valid_from, valid_until, is_active) VALUES
('WELCOME10', 'Welcome discount for new users', 'PERCENTAGE', 10.00, 500.00, 200.00, 1000, 156, '2024-01-01 00:00:00', '2025-12-31 23:59:59', true),
('FLAT500', 'Flat 500 off on orders above 2000', 'FIXED', 500.00, 2000.00, NULL, 500, 89, '2024-01-01 00:00:00', '2025-12-31 23:59:59', true),
('FESTIVE20', 'Festive season special 20% off', 'PERCENTAGE', 20.00, 1000.00, 500.00, 2000, 234, '2024-01-01 00:00:00', '2025-12-31 23:59:59', true),
('FIRSTORDER', 'First order special discount', 'PERCENTAGE', 15.00, 300.00, 300.00, 3000, 567, '2024-01-01 00:00:00', '2025-12-31 23:59:59', true);

-- Insert sample reviews
INSERT INTO reviews (product_id, user_id, rating, title, review, is_verified_purchase) VALUES
(1, 4, 5, 'Excellent sound quality', 'The sound quality is amazing and the battery life is impressive. Highly recommended!', true),
(1, 5, 4, 'Good value for money', 'Great headphones at this price point. Comfortable to wear for long hours.', true),
(2, 6, 5, 'Best smartwatch', 'Love all the features. Heart rate monitor is accurate and battery lasts a week.', true),
(11, 7, 4, 'Comfortable fabric', 'Very comfortable shirt. Fits perfectly and looks professional.', true),
(12, 4, 5, 'Beautiful design', 'The embroidery is beautiful. Exactly as shown in pictures.', true),
(31, 5, 5, 'Great cookware set', 'Non-stick coating is excellent. Easy to clean and cook.', true),
(41, 6, 4, 'Good phone', 'Value for money smartphone. Camera quality is decent.', true),
(51, 7, 5, 'Premium rice', 'Best basmati rice I have ever had. Aromatic and long grains.', true);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(4, 'Order Placed Successfully', 'Your order MH-10001 has been placed successfully.', 'ORDER', false),
(4, 'Order Shipped', 'Your order MH-10001 has been shipped and will arrive soon.', 'ORDER', false),
(24, 'New Order Received', 'You have received a new order VO-5001.', 'ORDER', false),
(1, 'New Vendor Registration', 'TechWorld Electronics has requested vendor registration.', 'VENDOR', false);

-- Update vendor total products
UPDATE vendor_profiles SET total_products = (SELECT COUNT(*) FROM products WHERE vendor_id = vendor_profiles.vendor_id);
