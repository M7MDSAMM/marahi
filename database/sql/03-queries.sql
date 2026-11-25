-- Requetes de lecture pour comprendre et preparer le backend.
USE marahi_hanan;
SET NAMES utf8mb4;
SET time_zone='+00:00';

-- 1. Catalogue : une ligne par combinaison type + poids disponible.
SELECT p.id, p.slug, p.name_fr, p.name_ar, c.code AS category_code,
       v.id AS variant_id, v.name_fr AS variant_fr, v.name_ar AS variant_ar,
       o.id AS option_id, o.sku, o.weight_g, o.price,
       (SELECT pi.file_path FROM product_images pi WHERE pi.product_id=p.id
        ORDER BY pi.sort_order,pi.id LIMIT 1) AS cover_path
FROM products p
JOIN categories c ON c.id=p.category_id
JOIN product_variants v ON v.product_id=p.id
JOIN product_options o ON o.variant_id=v.id
WHERE c.is_active=1 AND p.is_visible=1 AND v.is_active=1 AND o.is_available=1
ORDER BY p.sort_order,p.id,v.sort_order,v.id,o.sort_order,o.weight_g,o.id;

-- 2. Compte client : @authenticated_user_id vient de la session du serveur.
SET @authenticated_user_id=2;
SELECT id,reference,status,reception_mode,total,created_at
FROM orders WHERE user_id=@authenticated_user_id ORDER BY created_at DESC,id DESC;

-- 3. Contenu d'une commande autorisee. Controler le proprietaire avant cette requete.
SET @authorized_order_id=2;
SELECT product_name_fr,product_name_ar,variant_name_fr,variant_name_ar,
       weight_g,quantity,unit_price,line_total
FROM order_items WHERE order_id=@authorized_order_id ORDER BY id;

-- 4. Resume de l'administration : indicateurs calcules, pas de table de statistiques.
SELECT
 (SELECT COUNT(*) FROM orders WHERE status IN ('pending','preparing')) AS orders_to_prepare,
 (SELECT COUNT(*) FROM milling_appointments WHERE status='pending') AS appointments_to_confirm,
 (SELECT COUNT(*) FROM products p JOIN categories c ON c.id=p.category_id
  WHERE p.is_visible=1 AND c.is_active=1 AND EXISTS
   (SELECT 1 FROM product_variants v JOIN product_options o ON o.variant_id=v.id
    WHERE v.product_id=p.id AND v.is_active=1 AND o.is_available=1)) AS purchasable_products,
 (SELECT COUNT(*) FROM users WHERE role='customer' AND is_active=1) AS active_customer_accounts;

-- 5. Encaissements effectifs ; le total inclut les frais de livraison, ce n'est pas un benefice.
SELECT COALESCE(SUM(subtotal),0) AS merchandise_collected,
       COALESCE(SUM(delivery_fee),0) AS delivery_collected,
       COALESCE(SUM(total),0) AS total_cash_collected
FROM orders WHERE status='delivered' AND payment_status='paid';

-- 6. Les quantites les plus remises/livrees.
SELECT i.option_id,i.product_name_fr,i.variant_name_fr,i.weight_g,
       SUM(i.quantity) AS packages_delivered,SUM(i.line_total) AS merchandise_amount
FROM order_items i JOIN orders o ON o.id=i.order_id
WHERE o.status='delivered'
GROUP BY i.option_id,i.product_name_fr,i.variant_name_fr,i.weight_g
ORDER BY packages_delivered DESC;

-- 7. File de travail pour la journee tunisienne choisie, transmise comme DATE.
SET @local_work_date='2026-12-02';
SELECT reference,customer_name,customer_phone,grain_name,quantity_kg,grind_level
FROM milling_appointments
WHERE status='confirmed' AND confirmed_date=@local_work_date ORDER BY id;

-- 8. Historique d'une commande.
SELECT from_status,to_status,actor_type,actor_user_id,note,created_at
FROM order_status_history WHERE order_id=2 ORDER BY created_at,id;

-- 9. Controle de coherence : cette requete doit renvoyer zero ligne apres un checkout valide.
SELECT o.id,o.reference,o.subtotal,COALESCE(SUM(i.line_total),0) AS items_sum,COUNT(i.id) AS item_count
FROM orders o LEFT JOIN order_items i ON i.order_id=o.id
GROUP BY o.id,o.reference,o.subtotal
HAVING item_count=0 OR o.subtotal<>items_sum;

-- 10. Messages qui demandent encore une action.
SELECT id,sender_name,sender_phone,message_text,status,created_at
FROM contact_messages WHERE status IN ('new','read') ORDER BY created_at,id;
