import { Link, NavLink, Outlet } from "react-router-dom";
import { Dashboard as DashboardIcon, Box, Bag, Calendar } from "../../components/Icons";
import { useStore } from "../../store";
import { Logo, ThemeButton, LanguageButton } from "../../components/Layout";
import { DemoNotice } from "../../components/UI";
export function AdminLayout() {
  const { t } = useStore();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Logo />
        <p className="admin-label">{t("admin")}</p>
        <nav>
          {[
            ["/admin", "dashboard", DashboardIcon],
            ["/admin/produits", "manageProducts", Box],
            ["/admin/commandes", "orders", Bag],
            ["/admin/rendez-vous", "appointments", Calendar],
          ].map(([path, key, Icon]) => (
            <NavLink to={path} end={path === "/admin"} key={path}>
              <Icon size={19} />
              {t(key)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/">{t("viewSite")}</Link>
          <div>
            <ThemeButton />
            <LanguageButton />
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <DemoNotice admin />
        <Outlet />
      </main>
    </div>
  );
}
