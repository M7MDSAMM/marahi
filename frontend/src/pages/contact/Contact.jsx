import { useState } from "react";
import { Link } from "react-router-dom";
import { Pin, Clock, Phone, Message, Calendar } from "../../components/Icons";
import { useStore } from "../../store";
import { shop, validPhone } from "../../data";
import { DemoNotice } from "../../components/UI";
export function Contact() {
  const { t, ar, setContacts } = useStore();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!validPhone(data.phone)) {
      setError(t("phoneError"));
      return;
    }
    setContacts((previous) => [
      { ...data, id: `MSG-${Date.now()}`, date: new Date().toISOString() },
      ...previous,
    ]);
    setSent(true);
    setError("");
    e.currentTarget.reset();
  }
  return (
    <div className="container page">
      <header className="page-heading">
        <p className="eyebrow">
          {ar ? "ديما مرحبا" : "TOUJOURS LES BIENVENUS"}
        </p>
        <h1>{t("contactTitle")}</h1>
        <p>{t("contactDesc")}</p>
      </header>
      <div className="contact-grid">
        <section>
          <div className="contact-info">
            <div>
              <Pin />
              <h3>{t("address")}</h3>
              <p>{ar ? shop.addressAr : shop.addressFr}</p>
            </div>
            <div>
              <Clock />
              <h3>{t("hours")}</h3>
              <p>
                <bdi>{shop.hours}</bdi>
              </p>
            </div>
            <div>
              <Phone />
              <h3>{t("phone")}</h3>
              <a dir="ltr" href={`tel:+${shop.phone}`}>
                {shop.displayPhone}
              </a>
            </div>
          </div>
          <div className="contact-buttons">
            <a
              className="btn btn-gold"
              href={`https://wa.me/${shop.phone}`}
              target="_blank"
              rel="noreferrer"
            >
              <Message size={18} />
              {t("whatsapp")}
            </a>
            <a className="btn btn-outline" href={`tel:+${shop.phone}`}>
              {t("call")}
            </a>
          </div>
          <a
            className="map-card"
            href="https://www.google.com/maps/search/?api=1&query=El+Alia+Bizerte+Tunisia"
            target="_blank"
            rel="noreferrer"
          >
            <div className="map-pin">
              <Pin size={30} />
              <strong>{ar ? "العالية" : "El Alia"}</strong>
              <small>Bizerte, Tunisie</small>
            </div>
            <span className="map-cta">{t("location")}</span>
          </a>
          <div className="contact-appointment">
            <Calendar size={22} />
            <div>
              <h3>{t("appointment")}</h3>
              <Link className="text-link" to="/rendez-vous">
                {ar ? "حضّر طلب موعدك" : "Préparer ma demande"}
              </Link>
            </div>
          </div>
        </section>
        <section className="panel contact-form">
          <h2>{t("contactForm")}</h2>
          <DemoNotice />
          {sent && (
            <div className="success-message" role="status">
              {t("sent")}
            </div>
          )}
          <form onSubmit={submit}>
            <label>
              {t("name")}
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              {t("phone")}
              <input
                name="phone"
                type="tel"
                dir="ltr"
                placeholder="+216 53 000 000"
                required
              />
            </label>
            <label>
              {t("message")}
              <textarea rows="6" name="message" required maxLength={2000} />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn-gold full-width">{t("send")}</button>
          </form>
        </section>
      </div>
    </div>
  );
}
