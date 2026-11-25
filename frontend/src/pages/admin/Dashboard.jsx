import { Link } from "react-router-dom";
import { Dashboard as DashboardIcon, Box, Bag, Calendar, Wheat } from "../../components/Icons";
import { useStore } from "../../store";
import { Status } from "../../components/UI";
import { AdminHeading } from "./AdminHeading";
export function Dashboard() {
  const { t, ar, orders, appointments, products, profile, money } = useStore();
  const stats = [
    [
      "pendingOrders",
      orders.filter((o) => ["pending", "preparing"].includes(o.status)).length,
      Bag,
    ],
    [
      "pendingAppointments",
      appointments.filter((a) => a.status === "pending").length,
      Calendar,
    ],
    ["online", products.filter((p) => p.visible).length, Box],
    ["customers", profile.email ? 1 : 0, DashboardIcon],
  ];
  return (
    <>
      <AdminHeading title={t("dashboard")} description={t("adminDesc")} />
      <div className="stat-grid">
        {stats.map(([key, value, Icon]) => (
          <div className="stat-card" key={key}>
            <div>
              <span>{t(key)}</span>
              <Icon size={21} />
            </div>
            <strong>{value}</strong>
            <Wheat className="stat-wheat" />
          </div>
        ))}
      </div>
      <div className="dashboard-panels">
        <section className="panel">
          <div className="panel-heading">
            <h2>{t("recentOrders")}</h2>
            <Link to="/admin/commandes">{t("all")}</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t("reference")}</th>
                  <th>{t("client")}</th>
                  <th>{t("total")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.name}</td>
                    <td>
                      <bdi>{money(o.total)}</bdi>
                    </td>
                    <td>
                      <Status status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length && <p>{t("noRecords")}</p>}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>{t("recentAppointments")}</h2>
            <Link to="/admin/rendez-vous">{t("all")}</Link>
          </div>
          {appointments.slice(0, 4).map((a) => (
            <div className="appointment-summary" key={a.id}>
              <div>
                <strong>{a.name}</strong>
                <p>
                  {a.grain} · {a.quantity} kg
                </p>
                <small>{a.date}</small>
              </div>
              <Status status={a.status} />
            </div>
          ))}
          {!appointments.length && <p>{t("noRecords")}</p>}
        </section>
      </div>
    </>
  );
}
