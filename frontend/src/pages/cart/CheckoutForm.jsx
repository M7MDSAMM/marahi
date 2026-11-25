import { Basket, Pin, Truck } from "../../components/Icons";
import { useStore } from "../../store";
export function CheckoutForm({ mode, setMode, error, submit }) {
  const { t, ar, profile, user } = useStore();
  return (
        <section className="checkout-form panel">
          <p className="eyebrow">{t("checkout")}</p>
          <h2>{t("info")}</h2>
          <form onSubmit={submit}>
            <label>
              {t("name")}
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                defaultValue={profile.name || ""}
              />
            </label>
            <label>
              {t("phone")}
              <input
                name="phone"
                type="tel"
                dir="ltr"
                required
                autoComplete="tel"
                placeholder="+216 53 000 000"
                defaultValue={profile.phone || ""}
              />
            </label>
            <label>
              {t("email")}{" "}
              <span className="muted">({ar ? "اختياري" : "facultatif"})</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={user?.email || profile.email || ""}
              />
            </label>
            <fieldset className="option-group">
              <legend>{t("mode")}</legend>
              <div className="mode-options">
                <button
                  type="button"
                  className={`mode-option ${mode === "pickup" ? "active" : ""}`}
                  aria-pressed={mode === "pickup"}
                  onClick={() => setMode("pickup")}
                >
                  <Pin size={19} />
                  {t("pickup")}
                </button>
                <button
                  type="button"
                  className={`mode-option ${mode === "delivery" ? "active" : ""}`}
                  aria-pressed={mode === "delivery"}
                  onClick={() => setMode("delivery")}
                >
                  <Truck size={19} />
                  {t("delivery")}
                </button>
              </div>
            </fieldset>
            {mode === "delivery" && (
              <>
                <label>
                  {t("address")}
                  <input
                    name="address"
                    required
                    maxLength={300}
                    autoComplete="street-address"
                    defaultValue={profile.address || ""}
                  />
                </label>
                <label>
                  {t("city")}
                  <input
                    name="city"
                    required
                    maxLength={100}
                    defaultValue={profile.city || ""}
                  />
                </label>
                <p className="form-help">{t("deliveryInfo")}</p>
              </>
            )}
            <label>
              {t("note")}
              <textarea name="note" rows="3" maxLength={1000} />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn-gold full-width" type="submit">
              <Basket size={18} />
              {t("submitOrder")}
            </button>
            <p className="form-help center">{t("payment")}</p>
          </form>
        </section>
  );
}
