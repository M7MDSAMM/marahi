import { Link } from "react-router-dom";
import { Trash } from "../../components/Icons";
import { useStore } from "../../store";
import { Quantity, ProductImage } from "../../components/UI";
export function CartSummary({ mode, subtotal, fee }) {
  const { cart, setCart, t, ar, nameOf, money, weightOf, changeQuantity } = useStore();
  return (
        <section>
          <h2 className="subheading">
            {ar ? "منتوجات القفّة" : "Le récapitulatif"}
          </h2>
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.key}>
                <Link to={`/produit/${item.id}`}>
                  <ProductImage product={item} />
                </Link>
                <div className="cart-item-copy">
                  <Link to={`/produit/${item.id}`}>
                    <h3>{nameOf(item)}</h3>
                  </Link>
                  <p>
                    {ar ? item.variantAr : item.variantFr} ·{" "}
                    {weightOf(item.weight)}
                  </p>
                  <Quantity
                    value={item.quantity}
                    onChange={(q) => changeQuantity(item.key, q)}
                  />
                </div>
                <div className="cart-item-end">
                  <strong>{money(item.price * item.quantity)}</strong>
                  <button
                    className="text-button muted remove-button"
                    onClick={() =>
                      setCart(cart.filter((i) => i.key !== item.key))
                    }
                  >
                    <Trash size={14} />
                    {t("remove")}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="cart-totals">
            <p>
              <span>{t("subtotal")}</span>
              <strong>{money(subtotal)}</strong>
            </p>
            {mode === "delivery" && (
              <p>
                <span>{t("deliveryFee")}</span>
                <strong>{money(fee)}</strong>
              </p>
            )}
            <div className="grand-total">
              <span>{t("total")}</span>
              <strong>{money(subtotal + fee)}</strong>
            </div>
          </div>
          <Link className="text-link" to="/produits">
            {t("continue")}
          </Link>
        </section>
  );
}
