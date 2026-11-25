import { useState } from "react";
import { Eye } from "../../components/Icons";
import { useStore } from "../../store";
import { Modal, ProductImage } from "../../components/UI";
import { AdminHeading } from "./AdminHeading";
export function AdminOrders() {
  const { t, ar, orders, setOrders, money, weightOf } = useStore();
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const statuses = [
    "pending",
    "preparing",
    "shipping",
    "delivered",
    "cancelled",
  ];
  const list = orders.filter((o) => filter === "all" || o.status === filter);
  function update(id, status) {
    setOrders((previous) =>
      previous.map((o) => (o.id === id ? { ...o, status } : o)),
    );
  }
  return (
    <>
      <AdminHeading title={t("orders")} description={t("payment")} />
      <div className="pills admin-filters">
        {["all", ...statuses].map((s) => (
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
              <th>{t("reference")}</th>
              <th>{t("client")}</th>
              <th>{t("mode")}</th>
              <th>{t("total")}</th>
              <th>{t("status")}</th>
              <th>{t("details")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>{o.id}</strong>
                  <small>
                    {new Date(o.date).toLocaleDateString(
                      ar ? "ar-TN" : "fr-TN",
                    )}
                  </small>
                  {o.demo && <small className="muted">{t("demoRecord")}</small>}
                </td>
                <td>
                  {o.name}
                  <small dir="ltr">{o.phone}</small>
                </td>
                <td>
                  {t(o.mode === "pickup" ? "pickup" : "delivery")}
                  <small>{o.address}</small>
                </td>
                <td>
                  <bdi>{money(o.total)}</bdi>
                </td>
                <td>
                  <select
                    className={`status-select status-${o.status}`}
                    aria-label={`${t("status")} ${o.id}`}
                    value={o.status}
                    onChange={(e) => update(o.id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {t(s)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`${t("details")} ${o.id}`}
                    onClick={() => setDetail(o)}
                  >
                    <Eye size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="empty-table">{t("noRecords")}</p>}
      </div>
      {detail && (
        <Modal
          title={`${t("orders")} ${detail.id}`}
          onClose={() => setDetail(null)}
        >
          <p>
            {detail.name} · <bdi>{detail.phone}</bdi>
          </p>
          <p>
            {detail.address} {detail.city}
          </p>
          {detail.items.map((item, i) => (
            <div className="order-detail-item" key={i}>
              <ProductImage product={item} />
              <div>
                <strong>{ar ? item.ar : item.fr}</strong>
                <p>
                  {ar ? item.variantAr : item.variantFr} ·{" "}
                  {weightOf(item.weight)} × {item.quantity}
                </p>
              </div>
              <bdi>{money(item.price * item.quantity)}</bdi>
            </div>
          ))}
          <p>
            {t("deliveryFee")}:{" "}
            {money(detail.fee || (detail.mode === "delivery" ? 7 : 0))}
          </p>
          <div className="grand-total">
            {t("total")} <strong>{money(detail.total)}</strong>
          </div>
          {detail.note && (
            <p>
              {t("note")}: {detail.note}
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
