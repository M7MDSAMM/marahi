import { Link } from "react-router-dom";
import { useStore } from "../store";
import { EmptyState, DemoNotice } from "../components/UI";
import { useCheckout } from "./cart/useCheckout";
import { OrderConfirmation } from "./cart/OrderConfirmation";
import { CartSummary } from "./cart/CartSummary";
import { CheckoutForm } from "./cart/CheckoutForm";
export default function Cart() {
  const { t, ar, cart } = useStore();
  const { mode, setMode, error, confirmed, subtotal, fee, submit } = useCheckout();
  if (confirmed) return <OrderConfirmation confirmed={confirmed} />;
  if (!cart.length)
    return (
      <div className="container page">
        <EmptyState text={t("emptyCart")}>
          <Link className="btn btn-gold" to="/produits">
            {t("discover")}
          </Link>
        </EmptyState>
      </div>
    );
  return (
    <div className="container page">
      <header className="page-heading">
        <p className="eyebrow">
          {ar ? "اختياراتك البنينة" : "VOTRE SÉLECTION GOURMANDE"}
        </p>
        <h1>
          {t("cartTitle")}{" "}
          <span className="heading-count">
            {cart.reduce((n, i) => n + i.quantity, 0)}
          </span>
        </h1>
      </header>
      <DemoNotice />
      <div className="checkout-grid">
        <CartSummary mode={mode} subtotal={subtotal} fee={fee} />
        <CheckoutForm mode={mode} setMode={setMode} error={error} submit={submit} />

      </div>
    </div>
  );
}
