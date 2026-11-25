-- EXEMPLES PEDAGOGIQUES sur les donnees de demonstration.
-- Chaque exemple finit par ROLLBACK. Ce fichier ne constitue pas une API de commande.
-- Les regles conditionnelles, droits et retours HTTP doivent etre geres par le backend.
USE marahi_hanan;
SET time_zone='+00:00';

-- A. Mettre a jour le prix sans modifier les anciens achats.
START TRANSACTION;
SELECT id,sku,price FROM product_options WHERE sku='ZRIR-V1-500' FOR UPDATE;
UPDATE product_options SET price=26.000 WHERE sku='ZRIR-V1-500';
SELECT unit_price,line_total FROM order_items WHERE order_id=1;
-- Le prix de l'ancien achat reste 25.000 et sa ligne reste 50.000.
ROLLBACK;

-- B. Confirmer un rendez-vous de demonstration.
START TRANSACTION;
SELECT id,status,requested_date FROM milling_appointments WHERE id=1 FOR UPDATE;
-- Le backend doit verifier que la ligne est encore pending et que l'acteur est admin.
UPDATE milling_appointments
SET status='confirmed',confirmed_date=requested_date,handled_by_user_id=1
WHERE id=1 AND status='pending';
-- Exiger exactement une ligne modifiee avant COMMIT dans la vraie application.
ROLLBACK;

-- C. Une livraison n'est terminee qu'avec l'encaissement, dans la meme transaction.
START TRANSACTION;
SELECT id,status,reception_mode FROM orders WHERE id=1 FOR UPDATE;
-- Pour cet exemple, on parcourt les etapes autorisees avant le paiement.
UPDATE orders SET status='preparing' WHERE id=1 AND status='pending';
INSERT INTO order_status_history(order_id,from_status,to_status,actor_type,actor_user_id)
VALUES(1,'pending','preparing','admin',1);
UPDATE orders SET status='shipping' WHERE id=1 AND status='preparing' AND reception_mode='delivery';
INSERT INTO order_status_history(order_id,from_status,to_status,actor_type,actor_user_id)
VALUES(1,'preparing','shipping','admin',1);
UPDATE orders SET status='delivered',payment_status='paid',paid_at=UTC_TIMESTAMP()
WHERE id=1 AND status='shipping';
INSERT INTO order_status_history(order_id,from_status,to_status,actor_type,actor_user_id)
VALUES(1,'shipping','delivered','admin',1);
ROLLBACK;
