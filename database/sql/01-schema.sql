-- Marahi Hanan : schema propose, MariaDB 10.4+.
-- Importer dans une nouvelle base. Aucun DROP. S'arreter si le nom existe deja.
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE DATABASE marahi_hanan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marahi_hanan;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف المستخدم الداخلي',
  full_name VARCHAR(100) NOT NULL COMMENT 'الاسم الكامل',
  email VARCHAR(190) NOT NULL COMMENT 'بريد الدخول؛ يطبّعه الخادم إلى lowercase',
  phone VARCHAR(16) NOT NULL COMMENT 'الهاتف بصيغة +216 ثم ثمانية أرقام',
  password_hash VARCHAR(255) NOT NULL COMMENT 'هاش كلمة السر؛ لا تحفظ كلمة السر الأصلية',
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer' COMMENT 'دور واحد بسيط لكل مستخدم',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'تفعيل الحساب أو تعطيله',
  preferred_language ENUM('fr','ar') NOT NULL DEFAULT 'fr' COMMENT 'لغة المراسلات الخاصة بالحساب',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'وقت الإنشاء UTC',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'آخر تعديل UTC',
  CONSTRAINT uq_users_email UNIQUE(email),
  CONSTRAINT ck_users_phone CHECK(phone REGEXP '^[+]216[0-9]{8}$'),
  CONSTRAINT ck_users_name CHECK(CHAR_LENGTH(TRIM(full_name)) > 0),
  CONSTRAINT ck_users_active CHECK(is_active IN (0,1))
) ENGINE=InnoDB;

CREATE TABLE user_addresses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف العنوان',
  user_id INT UNSIGNED NOT NULL COMMENT 'مالك العنوان؛ عنوان محفوظ واحد فقط للحساب',
  address_line VARCHAR(300) NOT NULL COMMENT 'الشارع ورقم المنزل والتفاصيل',
  city VARCHAR(100) NOT NULL COMMENT 'المدينة أو المعتمدية',
  postal_code CHAR(4) NULL COMMENT 'ترقيم بريدي اختياري؛ نص لحفظ الأصفار',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'آخر تعديل UTC',
  CONSTRAINT uq_address_user UNIQUE(user_id),
  CONSTRAINT fk_address_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_address_line CHECK(CHAR_LENGTH(TRIM(address_line)) > 0),
  CONSTRAINT ck_address_city CHECK(CHAR_LENGTH(TRIM(city)) > 0),
  CONSTRAINT ck_address_postcode CHECK(postal_code IS NULL OR postal_code REGEXP '^[0-9]{4}$')
) ENGINE=InnoDB;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف الفئة',
  code VARCHAR(40) NOT NULL COMMENT 'رمز ثابت مثل grains أو traditional أو nuts',
  name_fr VARCHAR(100) NOT NULL COMMENT 'اسم الفئة بالفرنسية',
  name_ar VARCHAR(100) NOT NULL COMMENT 'اسم الفئة بالعربية',
  image_path VARCHAR(255) NULL COMMENT 'مسار نسبي لصورة الفئة',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ترتيب العرض',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'الفئة مفعلة أم مخفية',
  CONSTRAINT uq_category_code UNIQUE(code),
  CONSTRAINT ck_category_names CHECK(CHAR_LENGTH(TRIM(name_fr))>0 AND CHAR_LENGTH(TRIM(name_ar))>0),
  CONSTRAINT ck_category_active CHECK(is_active IN (0,1))
) ENGINE=InnoDB;

CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف المنتوج',
  category_id INT UNSIGNED NOT NULL COMMENT 'فئة واحدة لكل منتوج',
  slug VARCHAR(100) NOT NULL COMMENT 'رمز رابط ثابت؛ يقابل id النصي في React حاليا',
  name_fr VARCHAR(100) NOT NULL COMMENT 'اسم المنتوج بالفرنسية',
  name_ar VARCHAR(100) NOT NULL COMMENT 'اسم المنتوج بالعربية',
  description_fr TEXT NOT NULL COMMENT 'وصف المنتوج بالفرنسية',
  description_ar TEXT NOT NULL COMMENT 'وصف المنتوج بالعربية',
  nut_type ENUM('nuts','dried') NULL COMMENT 'فلتر الفواكه الجافة فقط؛ NULL في الأصناف الأخرى',
  is_visible BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'إظهار المنتوج في الكاتالوغ',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'إظهاره ضمن المنتوجات المفضلة',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ترتيب العرض',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'وقت الإنشاء UTC',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'آخر تعديل UTC',
  CONSTRAINT uq_product_slug UNIQUE(slug),
  CONSTRAINT fk_product_category FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT ck_product_names CHECK(CHAR_LENGTH(TRIM(name_fr))>0 AND CHAR_LENGTH(TRIM(name_ar))>0),
  CONSTRAINT ck_product_flags CHECK(is_visible IN (0,1) AND is_featured IN (0,1)),
  INDEX ix_product_catalog(category_id,is_visible,sort_order)
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف النوع أو الرحية',
  product_id INT UNSIGNED NOT NULL COMMENT 'المنتوج المالك للنوع',
  code VARCHAR(60) NOT NULL COMMENT 'رمز النوع داخل المنتوج؛ مثل pistache',
  name_fr VARCHAR(100) NOT NULL COMMENT 'اسم النوع بالفرنسية',
  name_ar VARCHAR(100) NOT NULL COMMENT 'اسم النوع بالعربية',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'السماح باختيار النوع',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'أول نوع مفعّل هو الاختيار الافتراضي',
  CONSTRAINT uq_variant_code UNIQUE(product_id,code),
  CONSTRAINT fk_variant_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT ck_variant_active CHECK(is_active IN (0,1)),
  CONSTRAINT ck_variant_names CHECK(CHAR_LENGTH(TRIM(name_fr))>0 AND CHAR_LENGTH(TRIM(name_ar))>0),
  INDEX ix_variant_listing(product_id,is_active,sort_order)
) ENGINE=InnoDB;

CREATE TABLE product_options (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف العبوة القابلة للبيع؛ ترسله السلة للباك إند',
  variant_id INT UNSIGNED NOT NULL COMMENT 'نوع واحد لهذه العبوة',
  sku VARCHAR(60) NOT NULL COMMENT 'رمز فريد للعبوة في الكاتالوغ',
  weight_g INT UNSIGNED NOT NULL COMMENT 'وزن العبوة بالغرام؛ ليس وزن السطر كله',
  price DECIMAL(12,3) NOT NULL COMMENT 'سعر عبوة واحدة بالدينار التونسي',
  is_available BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'توفر يدوي؛ ليس عدادا للمخزون',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'ترتيب الأوزان والوزن الافتراضي داخل النوع',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'آخر تعديل للسعر أو التوفر UTC',
  CONSTRAINT uq_option_sku UNIQUE(sku),
  CONSTRAINT uq_option_weight UNIQUE(variant_id,weight_g),
  CONSTRAINT fk_option_variant FOREIGN KEY(variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT ck_option_weight CHECK(weight_g > 0),
  CONSTRAINT ck_option_price CHECK(price > 0),
  CONSTRAINT ck_option_available CHECK(is_available IN (0,1)),
  INDEX ix_option_listing(variant_id,is_available,sort_order)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف الصورة',
  product_id INT UNSIGNED NOT NULL COMMENT 'المنتوج صاحب الصورة',
  file_path VARCHAR(255) NOT NULL COMMENT 'مسار الملف النسبي؛ الصورة ليست BLOB ولا base64',
  alt_fr VARCHAR(150) NOT NULL DEFAULT '' COMMENT 'نص بديل فرنسي',
  alt_ar VARCHAR(150) NOT NULL DEFAULT '' COMMENT 'نص بديل عربي',
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'أول صورة حسب الترتيب ثم id هي الغلاف',
  CONSTRAINT fk_image_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT ck_image_path CHECK(CHAR_LENGTH(TRIM(file_path)) > 0),
  INDEX ix_image_cover(product_id,sort_order,id)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف الطلب الداخلي',
  reference VARCHAR(32) NOT NULL COMMENT 'مرجع ظاهر للحريف؛ ليس وسيلة تفويض للوصول',
  request_key CHAR(36) NOT NULL COMMENT 'مفتاح محاولة الطلب لمنع تكرار التسجيل عند إعادة الإرسال',
  user_id INT UNSIGNED NULL COMMENT 'NULL للزائر؛ للخادم وحده حق تحديد صاحب الحساب',
  customer_name VARCHAR(100) NOT NULL COMMENT 'نسخة الاسم وقت الطلب',
  customer_phone VARCHAR(16) NOT NULL COMMENT 'نسخة الهاتف وقت الطلب',
  customer_email VARCHAR(190) NULL COMMENT 'بريد اختياري وقت الطلب؛ لا يثبت ملكية الطلب',
  language ENUM('fr','ar') NOT NULL DEFAULT 'fr' COMMENT 'لغة الطلب والمراسلة',
  reception_mode ENUM('pickup','delivery') NOT NULL COMMENT 'استلام من الطاحونة أو توصيل',
  delivery_address VARCHAR(300) NULL COMMENT 'نسخة عنوان التوصيل؛ NULL عند الاستلام من المحل',
  delivery_city VARCHAR(100) NULL COMMENT 'نسخة المدينة وقت الطلب',
  delivery_postal_code CHAR(4) NULL COMMENT 'نسخة الترقيم البريدي إن توفر',
  customer_note VARCHAR(1000) NULL COMMENT 'ملاحظة الحريف',
  subtotal DECIMAL(12,3) NOT NULL COMMENT 'مجموع السطور؛ يحسبه الخادم من الأسعار الموثوقة',
  delivery_fee DECIMAL(12,3) NOT NULL DEFAULT 0 COMMENT 'معلوم التوصيل المتفق عليه وقت الطلب',
  total DECIMAL(12,3) NOT NULL COMMENT 'subtotal + delivery_fee بالدينار التونسي',
  currency CHAR(3) NOT NULL DEFAULT 'TND' COMMENT 'عملة واحدة في النسخة الحالية',
  status ENUM('pending','preparing','shipping','delivered','cancelled') NOT NULL DEFAULT 'pending' COMMENT 'حالة الطلب',
  payment_method ENUM('cash_on_receipt') NOT NULL DEFAULT 'cash_on_receipt' COMMENT 'نقدا عند الاستلام؛ لا دفع إلكتروني',
  payment_status ENUM('unpaid','paid') NOT NULL DEFAULT 'unpaid' COMMENT 'يسجل paid فقط عند التسليم الفعلي',
  paid_at DATETIME NULL COMMENT 'وقت تحصيل المبلغ UTC',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'وقت الطلب UTC',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'آخر تعديل UTC',
  CONSTRAINT uq_order_reference UNIQUE(reference),
  CONSTRAINT uq_order_request UNIQUE(request_key),
  CONSTRAINT fk_order_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT ck_order_phone CHECK(customer_phone REGEXP '^[+]216[0-9]{8}$'),
  CONSTRAINT ck_order_name CHECK(CHAR_LENGTH(TRIM(customer_name)) > 0),
  CONSTRAINT ck_order_money CHECK(subtotal >= 0 AND delivery_fee >= 0 AND total = subtotal + delivery_fee),
  CONSTRAINT ck_order_currency CHECK(currency = 'TND'),
  CONSTRAINT ck_order_postcode CHECK(delivery_postal_code IS NULL OR delivery_postal_code REGEXP '^[0-9]{4}$'),
  CONSTRAINT ck_order_reception CHECK(
    (reception_mode='pickup' AND delivery_fee=0 AND delivery_address IS NULL AND delivery_city IS NULL AND delivery_postal_code IS NULL)
    OR (reception_mode='delivery' AND delivery_address IS NOT NULL AND CHAR_LENGTH(TRIM(delivery_address))>0 AND delivery_city IS NOT NULL AND CHAR_LENGTH(TRIM(delivery_city))>0)
  ),
  CONSTRAINT ck_order_payment CHECK(
    (status='delivered' AND payment_status='paid' AND paid_at IS NOT NULL)
    OR (status<>'delivered' AND payment_status='unpaid' AND paid_at IS NULL)
  ),
  INDEX ix_order_customer(user_id,created_at),
  INDEX ix_order_queue(status,created_at)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف سطر الطلب',
  order_id INT UNSIGNED NOT NULL COMMENT 'الطلب المالك للسطر',
  option_id INT UNSIGNED NOT NULL COMMENT 'العبوة الأصلية؛ يمنع حذفها بعد بيعها',
  product_name_fr VARCHAR(100) NOT NULL COMMENT 'نسخة اسم المنتوج بالفرنسية وقت البيع',
  product_name_ar VARCHAR(100) NOT NULL COMMENT 'نسخة اسم المنتوج بالعربية وقت البيع',
  variant_name_fr VARCHAR(100) NOT NULL COMMENT 'نسخة النوع بالفرنسية وقت البيع',
  variant_name_ar VARCHAR(100) NOT NULL COMMENT 'نسخة النوع بالعربية وقت البيع',
  weight_g INT UNSIGNED NOT NULL COMMENT 'نسخة وزن عبوة واحدة بالغرام',
  quantity SMALLINT UNSIGNED NOT NULL COMMENT 'عدد العبوات من 1 إلى 99',
  unit_price DECIMAL(12,3) NOT NULL COMMENT 'نسخة سعر العبوة وقت الطلب',
  line_total DECIMAL(12,3) NOT NULL COMMENT 'quantity مضروبة في unit_price',
  CONSTRAINT uq_order_item_option UNIQUE(order_id,option_id),
  CONSTRAINT fk_item_order FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  CONSTRAINT fk_item_option FOREIGN KEY(option_id) REFERENCES product_options(id) ON DELETE RESTRICT,
  CONSTRAINT ck_item_quantity CHECK(quantity BETWEEN 1 AND 99),
  CONSTRAINT ck_item_weight CHECK(weight_g > 0),
  CONSTRAINT ck_item_price CHECK(unit_price > 0 AND line_total=ROUND(quantity*unit_price,3))
) ENGINE=InnoDB;

CREATE TABLE order_status_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف الحدث',
  order_id INT UNSIGNED NOT NULL COMMENT 'الطلب المرتبط بالحدث',
  from_status ENUM('pending','preparing','shipping','delivered','cancelled') NULL COMMENT 'NULL في حدث الإنشاء الأول',
  to_status ENUM('pending','preparing','shipping','delivered','cancelled') NOT NULL COMMENT 'الحالة الجديدة',
  actor_type ENUM('guest','customer','admin','system') NOT NULL COMMENT 'صفة من أحدث التغيير وقت الحدث',
  actor_user_id INT UNSIGNED NULL COMMENT 'الحساب المنفذ إن وجد',
  note VARCHAR(500) NULL COMMENT 'سبب الإلغاء أو ملاحظة إدارية',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'توقيت الحدث UTC',
  CONSTRAINT fk_history_order FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  CONSTRAINT fk_history_actor FOREIGN KEY(actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT ck_history_change CHECK(from_status IS NULL OR from_status<>to_status),
  INDEX ix_history_order(order_id,created_at,id)
) ENGINE=InnoDB;

CREATE TABLE milling_appointments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف طلب الرحية',
  reference VARCHAR(32) NOT NULL COMMENT 'مرجع الموعد',
  user_id INT UNSIGNED NULL COMMENT 'حساب الحريف إن كان مسجلا',
  grain_product_id INT UNSIGNED NULL COMMENT 'رابط اختياري لحبوب الكاتالوغ؛ ليس عملية شراء',
  customer_name VARCHAR(100) NOT NULL COMMENT 'اسم صاحب الحبوب وقت الطلب',
  customer_phone VARCHAR(16) NOT NULL COMMENT 'رقم الاتصال وقت الطلب',
  grain_name VARCHAR(120) NOT NULL COMMENT 'نسخة نوع الحبوب؛ يسمح بطلب حبوب خارج الكاتالوغ',
  quantity_kg DECIMAL(8,3) NOT NULL COMMENT 'وزن حبوب الحريف بالكيلوغرام',
  grind_level ENUM('fine','medium','coarse') NOT NULL DEFAULT 'fine' COMMENT 'درجة الرحية المطلوبة',
  requested_date DATE NOT NULL COMMENT 'نهار مطلوب حسب توقيت تونس؛ ليس موعدا مؤكدا',
  confirmed_date DATE NULL COMMENT 'النهار المتفق عليه عند التأكيد؛ دون نظام ساعات معقد',
  status ENUM('pending','confirmed','rejected','done','cancelled') NOT NULL DEFAULT 'pending' COMMENT 'حالة طلب الرحية',
  customer_note VARCHAR(1000) NULL COMMENT 'ملاحظة الحريف',
  status_reason VARCHAR(500) NULL COMMENT 'سبب الرفض أو الإلغاء',
  handled_by_user_id INT UNSIGNED NULL COMMENT 'المسؤول الذي تعامل مع الطلب',
  completed_at DATETIME NULL COMMENT 'وقت إنهاء الخدمة UTC',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'وقت إرسال الطلب UTC',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'آخر تعديل UTC',
  CONSTRAINT uq_appointment_reference UNIQUE(reference),
  CONSTRAINT fk_appointment_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_appointment_grain FOREIGN KEY(grain_product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_appointment_handler FOREIGN KEY(handled_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT ck_appointment_phone CHECK(customer_phone REGEXP '^[+]216[0-9]{8}$'),
  CONSTRAINT ck_appointment_quantity CHECK(quantity_kg > 0 AND quantity_kg <= 1000),
  CONSTRAINT ck_appointment_names CHECK(CHAR_LENGTH(TRIM(customer_name))>0 AND CHAR_LENGTH(TRIM(grain_name))>0),
  CONSTRAINT ck_appointment_date CHECK(status NOT IN ('confirmed','done') OR confirmed_date IS NOT NULL),
  CONSTRAINT ck_appointment_reason CHECK(status NOT IN ('rejected','cancelled') OR (status_reason IS NOT NULL AND CHAR_LENGTH(TRIM(status_reason))>0)),
  CONSTRAINT ck_appointment_done CHECK((status='done' AND completed_at IS NOT NULL) OR (status<>'done' AND completed_at IS NULL)),
  INDEX ix_appointment_queue(status,requested_date),
  INDEX ix_appointment_customer(user_id,created_at)
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف الرسالة',
  user_id INT UNSIGNED NULL COMMENT 'حساب المرسل إن وجد',
  sender_name VARCHAR(100) NOT NULL COMMENT 'اسم المرسل وقت الإرسال',
  sender_phone VARCHAR(16) NOT NULL COMMENT 'رقم الاتصال',
  message_text TEXT NOT NULL COMMENT 'مضمون الرسالة؛ حد التطبيق 2000 حرف',
  status ENUM('new','read','closed') NOT NULL DEFAULT 'new' COMMENT 'حالة متابعة الرسالة',
  handled_by_user_id INT UNSIGNED NULL COMMENT 'المسؤول المتابع',
  resolved_at DATETIME NULL COMMENT 'وقت إغلاق الرسالة UTC',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'وقت الإرسال UTC',
  CONSTRAINT fk_message_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_message_handler FOREIGN KEY(handled_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT ck_message_phone CHECK(sender_phone REGEXP '^[+]216[0-9]{8}$'),
  CONSTRAINT ck_message_name CHECK(CHAR_LENGTH(TRIM(sender_name))>0),
  CONSTRAINT ck_message_length CHECK(CHAR_LENGTH(TRIM(message_text)) BETWEEN 1 AND 2000),
  CONSTRAINT ck_message_closed CHECK((status='closed' AND resolved_at IS NOT NULL) OR (status<>'closed' AND resolved_at IS NULL)),
  INDEX ix_message_queue(status,created_at)
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'معرّف طلب الاسترجاع',
  user_id INT UNSIGNED NOT NULL COMMENT 'صاحب الحساب',
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'SHA-256 لرمز عشوائي قوي؛ ليس هاش كلمة السر',
  expires_at DATETIME NOT NULL COMMENT 'وقت انتهاء صلاحية الرمز UTC',
  used_at DATETIME NULL COMMENT 'وقت استعماله؛ NULL يعني لم يستعمل',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'وقت الإصدار UTC',
  CONSTRAINT uq_reset_hash UNIQUE(token_hash),
  CONSTRAINT fk_reset_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_reset_expiry CHECK(expires_at>created_at),
  CONSTRAINT ck_reset_hash CHECK(token_hash REGEXP '^[0-9a-f]{64}$'),
  INDEX ix_reset_user(user_id,used_at,expires_at)
) ENGINE=InnoDB;
