import { Link } from "react-router-dom";
import { Check } from "../../components/Icons";
import { useStore } from "../../store";
export function OrderConfirmation({ confirmed }) {
  const { t, money } = useStore();
  return (
      <div className="container page">
        <div className="confirmation">
          <span className="confirmation-check">
            <Check size={38} />
          </span>
          <p className="eyebrow">
            {t("reference")} {confirmed.id}
          </p>
          <h1>{t("confirmTitle")}</h1>
          <p>{t("confirmDesc")}</p>
          <div className="confirmation-total">{money(confirmed.total)}</div>
          <div className="button-row">
            <Link className="btn btn-gold" to="/compte">
              {t("viewOrders")}
            </Link>
            <Link className="btn btn-outline" to="/produits">
              {t("continue")}
            </Link>
          </div>
        </div>
      </div>
  );
}
