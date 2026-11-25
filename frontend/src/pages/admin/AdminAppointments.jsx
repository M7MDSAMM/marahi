import { useState } from "react";
import { Eye } from "../../components/Icons";
import { useStore } from "../../store";
import { Status, Modal } from "../../components/UI";
import { AdminHeading } from "./AdminHeading";
export function AdminAppointments() {
  const { t, ar, appointments, setAppointments, contacts } = useStore();
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const list = appointments.filter(
    (a) => filter === "all" || a.status === filter,
  );
  function update(id, status) {
    setAppointments((previous) =>
      previous.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }
  return (
    <>
      <AdminHeading
        title={t("appointments")}
        description={
          ar
            ? "طلبات الرحية اللي تسجّلت في المتصفح."
            : "Les demandes de mouture enregistrées dans ce navigateur."
        }
      />
      <div className="pills admin-filters">
        {["all", "pending", "confirmed", "done", "rejected"].map((s) => (
          <button
            key={s}
            className={`pill ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {t(s)}
          </button>
        ))}
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("client")}</th>
              <th>{t("phone")}</th>
              <th>{t("date")}</th>
              <th>{t("grainType")}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.name}
                  {a.demo && <small>{t("demoRecord")}</small>}
                </td>
                <td dir="ltr">{a.phone}</td>
                <td>{a.date}</td>
                <td>
                  {a.grain}
                  <small>{a.quantity} kg</small>
                </td>
                <td>
                  <Status status={a.status} />
                </td>
                <td>
                  <div className="table-actions">
                    {a.status === "pending" ? (
                      <>
                        <button
                          className="text-button"
                          onClick={() => update(a.id, "confirmed")}
                        >
                          {t("confirm")}
                        </button>
                        <button
                          className="text-button danger"
                          onClick={() => update(a.id, "rejected")}
                        >
                          {t("refuse")}
                        </button>
                      </>
                    ) : a.status === "confirmed" ? (
                      <button
                        className="text-button"
                        onClick={() => update(a.id, "done")}
                      >
                        {t("finished")}
                      </button>
                    ) : null}
                    <button
                      className="icon-button"
                      aria-label={`${t("details")} ${a.name}`}
                      onClick={() => setDetail(a)}
                    >
                      <Eye size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="empty-table">{t("noRecords")}</p>}
      </div>
      <section className="panel contact-messages">
        <h2>{t("contactForm")}</h2>
        {!contacts.length ? (
          <p className="muted">{t("noRecords")}</p>
        ) : (
          contacts.map((c) => (
            <details className="message-record" key={c.id}>
              <summary>
                <strong>{c.name}</strong>
                <bdi>{c.phone}</bdi>
                <small>
                  {new Date(c.date).toLocaleDateString(ar ? "ar-TN" : "fr-TN")}
                </small>
              </summary>
              <p>{c.message}</p>
            </details>
          ))
        )}
      </section>
      {detail && (
        <Modal title={detail.id} onClose={() => setDetail(null)}>
          <p>
            {detail.name} · <bdi>{detail.phone}</bdi>
          </p>
          <p>
            {detail.grain} · {detail.quantity} kg · {detail.date}
          </p>
          <Status status={detail.status} />
          <p>{detail.note || t("noRecords")}</p>
        </Modal>
      )}
    </>
  );
}
