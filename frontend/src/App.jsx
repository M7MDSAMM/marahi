import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { StoreProvider, useStore } from "./store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Credits from "./pages/Credits";
import { Catalog, Grains, Product } from "./pages/Catalog";
import Cart from "./pages/Cart";
import { Contact, Appointment, About } from "./pages/Contact";
import { Auth, Account } from "./pages/Account";
import {
  AdminLayout,
  Dashboard,
  AdminProducts,
  AdminOrders,
  AdminAppointments,
} from "./pages/Admin";
function NotFound() {
  const { t } = useStore();
  return (
    <div className="container page empty-state">
      <h1>404</h1>
      <p>{t("notFound")}</p>
      <Link to="/" className="btn btn-gold">
        {t("home")}
      </Link>
    </div>
  );
}
export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="grains" element={<Grains />} />
            <Route
              path="produits"
              element={<Catalog category="traditional" />}
            />
            <Route path="fruits-secs" element={<Catalog category="nuts" />} />
            <Route path="produit/:id" element={<ProductRoute />} />
            <Route path="panier" element={<Cart />} />
            <Route path="a-propos" element={<About />} />
            <Route path="credits" element={<Credits />} />
            <Route path="contact" element={<Contact />} />
            <Route path="rendez-vous" element={<Appointment />} />
            <Route path="compte" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="connexion" element={<Auth key="login" />} />
          <Route
            path="inscription"
            element={<Auth key="register" mode="register" />}
          />
          <Route
            path="mot-de-passe-oublie"
            element={<Auth key="forgot" mode="forgot" />}
          />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produits" element={<AdminProducts />} />
            <Route path="commandes" element={<AdminOrders />} />
            <Route path="rendez-vous" element={<AdminAppointments />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
// Reset the product options when moving directly from one product to another.
function ProductRoute() {
  const { id } = useParams();
  return <Product key={id} />;
}
