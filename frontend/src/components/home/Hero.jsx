import { useState } from "react";
import { Link } from "react-router-dom";
import { Previous, Next } from "../Icons";
import { useStore } from "../../store";
import WheatArtwork from "../WheatArtwork";

export default function Hero() {
  const { t, ar } = useStore();
  const [slide, setSlide] = useState(0);
  const titles = [
    ["heroTitle", "heroAccent", "heroDesc"],
    ["hero2", "hero2Accent", "hero2Desc"],
    ["hero3", "hero3Accent", "hero3Desc"],
  ];
  return (
      <section className="hero">
        <div className="hero-inner container">
          <WheatArtwork className="hero-wheat" />
          <div className="hero-copy" key={slide}>
            <p className="eyebrow">{t("terroir")}</p>
            <h1>
              {t(titles[slide][0])}
              <em>{t(titles[slide][1])}</em>
            </h1>
            <p className="hero-description">{t(titles[slide][2])}</p>
            <div className="hero-buttons">
              <Link
                className="btn btn-gold"
                to={slide === 1 ? "/rendez-vous" : "/produits"}
              >
                {t(slide === 1 ? "appointment" : "discover")}
              </Link>
              <Link className="hero-secondary" to="/a-propos">
                {t("about")}
              </Link>
            </div>
          </div>
          <div className="hero-wordmark" aria-hidden="true">
            MARAHI HANAN
          </div>
          <div className="hero-pagination">
            <button
              className="icon-button"
              aria-label={ar ? "الشريحة السابقة" : "Diapositive précédente"}
              onClick={() => setSlide((slide + 2) % 3)}
            >
              <Previous size={18} />
            </button>
            {titles.map((_, i) => (
              <button
                className={`slide-dot ${i === slide ? "active" : ""}`}
                key={i}
                aria-label={`${ar ? "شريحة" : "Diapositive"} ${i + 1}`}
                aria-pressed={i === slide}
                onClick={() => setSlide(i)}
              />
            ))}
            <button
              className="icon-button"
              aria-label={ar ? "الشريحة التالية" : "Diapositive suivante"}
              onClick={() => setSlide((slide + 1) % 3)}
            >
              <Next size={18} />
            </button>
          </div>
        </div>
      </section>
  );
}
