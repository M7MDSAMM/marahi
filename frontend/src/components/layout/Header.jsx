import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Basket, User, Menu, Close, Pin } from "../Icons";
import { useStore } from "../../store";
import { Logo, LanguageButton, ThemeButton } from "./BrandControls";
export default function Header() {
  const { t, cart, user, ar } = useStore();
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll(
      ".section-heading, .category-card, .product-card, .step, .story-block, .value-card",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${(index % 3) * 60}ms`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);
  const links = [
    ["/", "home"],
    ["/grains", "grains"],
    ["/produits", "products"],
    ["/fruits-secs", "nuts"],
    ["/a-propos", "about"],
    ["/contact", "contact"],
  ];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (<>
      <div className="topline">
        <span>
          {ar
            ? "من الحبّة للمنتوج، بمحبة."
            : "Du grain au produit, avec amour."}
        </span>
        <span>
          <Pin size={12} />
          {ar ? "العالية، بنزرت" : "El Alia, Bizerte"}
        </span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav
            aria-label={ar ? "التنقل الرئيسي" : "Navigation principale"}
            className={menu ? "main-nav is-open" : "main-nav"}
          >
            {links.map(([to, key]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeButton />
            <LanguageButton />
            <Link
              className="icon-button basket-link"
              to="/panier"
              aria-label={`${t("cart")} (${count})`}
            >
              <Basket size={25} />
              {count > 0 && (
                <span className="basket-count" key={count}>
                  {count}
                </span>
              )}
            </Link>
            <Link
              className="icon-button user-link"
              to={user ? "/compte" : "/connexion"}
              aria-label={t("account")}
            >
              <User size={23} />
            </Link>
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={menu ? t("close") : t("menu")}
            >
              {menu ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
  </>);
}
