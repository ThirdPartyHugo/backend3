-- Users and Roles
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  permissions JSON
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT,
  leader_id INT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- Sales and Products
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('CARD', 'THERMOPUMP', 'ISOLATION', 'ROOF') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  details JSON
);

CREATE TABLE sales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT NOT NULL,
  product_id INT NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  client_address TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('CASH', 'CHECK', 'INTERAC') NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'PAID', 'REFUNDED') NOT NULL,
  payment_proof_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Territories and Mapping
CREATE TABLE territories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  leader_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  coordinates JSON,
  FOREIGN KEY (leader_id) REFERENCES users(id)
);

-- End of Day Reports
CREATE TABLE daily_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  sales_count INT NOT NULL,
  sales_amount DECIMAL(10,2) NOT NULL,
  cards_received INT,
  cards_sold INT,
  photos_url JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Commissions and Expenses
CREATE TABLE commission_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  min_sales INT NOT NULL,
  max_sales INT NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);