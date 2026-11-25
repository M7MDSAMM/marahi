import { useState } from "react";
import { useStore } from "../../store";
import { validPhone } from "../../data";
import { DemoNotice } from "../../components/UI";
import WheatArtwork from "../../components/WheatArtwork";
export function Appointment() {
  const { t, ar, products, setAppointments } = useStore();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const now = new Date();
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!validPhone(data.phone)) {
      setError(t("phoneError"));
      return;
    }
    if (data.date < minDate) {
      setError(
        ar
          ? "اختار نهار اليوم ولا بعده."
          : "Choisissez aujourd’hui ou une date à venir.",
      );
      return;
    }
    setAppointments((previous) => [
      {
        ...data,
        id: `RDV-${Date.now().toString(36).toUpperCase()}`,
        status: "pending",
        demo: false,
      },
      ...previous,
    ]);
    setSent(true);
    setError("");
    e.currentTarget.reset();
  }
  return (
    <div className="container page appointment-page">
      <div className="appointment-intro">
        <p className="eyebrow">{t("terroir")}</p>
        <h1>{t("appointmentTitle")}</h1>
        <p>{t("appointmentDesc")}</p>
        <div className="appointment-art">
          <WheatArtwork />
          <span lang="ar">على كيفك.</span>
        </div>
      </div>
      <div className="panel">
        <h2>{t("appointment")}</h2>
        <DemoNotice />
        {sent && (
          <p className="success-message" role="status">
            {t("booked")}
          </p>
        )}
        <form onSubmit={submit}>
          <label>
            {t("name")}
            <input name="name" required autoComplete="name" maxLength={100} />
          </label>
          <label>
            {t("phone")}
            <input
              name="phone"
              type="tel"
              dir="ltr"
              required
              placeholder="+216 53 000 000"
            />
          </label>
          <div className="form-columns">
            <label>
              {t("grainType")}
              <select name="grain">
                {products
                  .filter((p) => p.category === "grains")
                  .map((p) => (
                    <option key={p.id} value={`${p.fr} / ${p.ar}`}>
                      {ar ? p.ar : p.fr}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              {t("kg")}
              <input
                type="number"
                name="quantity"
                min="1"
                max="1000"
                defaultValue="5"
                required
              />
            </label>
          </div>
          <label>
            {t("date")}
            <input type="date" name="date" min={minDate} required />
          </label>
          <label>
            {t("note")}
            <textarea name="note" rows="3" maxLength={1000} />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-gold full-width">{t("book")}</button>
        </form>
      </div>
    </div>
  );
}
