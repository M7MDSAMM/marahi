import { Link } from "react-router-dom";
import { Phone, Pin, Clock } from "../Icons";
import { useStore } from "../../store";
import { shop } from "../../data";
import { Logo } from "./BrandControls";
export default function Footer() {
  const { t, ar } = useStore();
  return (
      <footer className="site-footer">
        <div className="footer-main container">
          <div>
            <Logo />
            <p>{t("footerTag")}</p>
            <span className="footer-arabic" lang="ar">
              بنّة بلادنا
            </span>
          </div>
          <div>
            <h3>{t("explore")}</h3>
            <Link to="/grains">{t("grains")}</Link>
            <Link to="/produits">{t("products")}</Link>
            <Link to="/a-propos">{t("about")}</Link>
            <Link to="/rendez-vous">{t("appointment")}</Link>
          </div>
          <div>
            <h3>{t("follow")}</h3>
            <a href={`tel:+${shop.phone}`}>
              <Phone size={15} />
              <bdi>{shop.displayPhone}</bdi>
            </a>
            <p>
              <Pin size={15} />
              {ar ? shop.addressAr : shop.addressFr}
            </p>
            <p>
              <Clock size={15} />
              <bdi>{shop.hours}</bdi>
            </p>
            <Link to="/contact">{t("contact")}</Link>
            <Link to="/credits">{ar ? "صور المشروع" : "Visuels du projet"}</Link>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>
            © {new Date().getFullYear()} {t("copyright")}
          </span>
          <span>{t("demo")}</span>
          <Link to="/admin">{t("admin")}</Link>
        </div>
      </footer>
  );
}
