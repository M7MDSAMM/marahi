import { useState } from "react";
import { Navigate } from "react-router-dom";
import { User, Pin, Bag, Logout } from "../../components/Icons";
import { useStore } from "../../store";
import { validPhone } from "../../data";
import { Status, DemoNotice } from "../../components/UI";
export function Account() {
  const { t, ar, user, profile, setProfile, orders, money, logout, setToast } =
    useStore();
  const [tab, setTab] = useState("profile");
  const [error, setError] = useState("");
  if (!user) return <Navigate to="/connexion" replace />;
  const myOrders = orders.filter((o) => !o.demo); // This is a local device demo, not a secure multi-user account.
  function save(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data.phone && !validPhone(data.phone)) {
      setError(t("phoneError"));
      return;
    }
    setProfile((previous) => ({ ...previous, ...data }));
    setError("");
    setToast(t("saved"));
  }
  return (
    <div className="container page account-layout">
      <aside className="account-sidebar">
        <p className="eyebrow">{ar ? "مرحبا بيك" : "BIENVENUE"}</p>
        <h1>{profile.name || user.name}</h1>
        <div className="account-tabs">
          {[
            ["profile", "profile", User],
            ["address", "address", Pin],
            ["orders", "myOrders", Bag],
          ].map(([v, key, Icon]) => (
            <button
              key={v}
              className={tab === v ? "active" : ""}
              onClick={() => setTab(v)}
            >
              <Icon size={19} />
              {t(key)}
            </button>
          ))}
          <button onClick={logout}>
            <Logout size={19} />
            {t("logout")}
          </button>
        </div>
      </aside>
      <section className="account-content">
        <DemoNotice />
        {tab === "orders" ? (
          <div className="panel">
            <h2>{t("myOrders")}</h2>
            {!myOrders.length ? (
              <p>{t("noOrders")}</p>
            ) : (
              myOrders.map((o) => (
                <details className="account-order" key={o.id}>
                  <summary>
                    <span>
                      <strong>{o.id}</strong>
                      <small>
                        {new Date(o.date).toLocaleDateString(
                          ar ? "ar-TN" : "fr-TN",
                        )}
                      </small>
                    </span>
                    <strong>{money(o.total)}</strong>
                    <Status status={o.status} />
                  </summary>
                  <div>
                    {o.items.map((item, i) => (
                      <p key={i}>
                        {ar ? item.ar : item.fr} × {item.quantity}{" "}
                        <bdi>{money(item.price * item.quantity)}</bdi>
                      </p>
                    ))}
                    <p>
                      {t(o.mode === "pickup" ? "pickup" : "delivery")}{" "}
                      {o.address && `· ${o.address}`}
                    </p>
                  </div>
                </details>
              ))
            )}
          </div>
        ) : (
          <div className="panel">
            <h2>{t(tab === "address" ? "address" : "profile")}</h2>
            <form onSubmit={save} key={tab}>
              {tab === "profile" ? (
                <>
                  <label>
                    {t("name")}
                    <input
                      name="name"
                      required
                      defaultValue={profile.name || ""}
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    {t("phone")}
                    <input
                      name="phone"
                      type="tel"
                      dir="ltr"
                      defaultValue={profile.phone || ""}
                    />
                  </label>
                  <label>
                    {t("email")}
                    <input
                      name="email"
                      type="email"
                      required
                      dir="ltr"
                      defaultValue={profile.email || user.email}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    {t("address")}
                    <input
                      name="address"
                      required
                      defaultValue={profile.address || ""}
                      autoComplete="street-address"
                    />
                  </label>
                  <div className="form-columns">
                    <label>
                      {t("city")}
                      <input
                        name="city"
                        required
                        defaultValue={profile.city || ""}
                      />
                    </label>
                    <label>
                      {t("postcode")}
                      <input
                        name="postcode"
                        pattern="[0-9]{4}"
                        inputMode="numeric"
                        defaultValue={profile.postcode || ""}
                      />
                    </label>
                  </div>
                </>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn-gold">{t("save")}</button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
