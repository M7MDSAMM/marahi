import { Link } from "react-router-dom";
import { useStore } from "../../store";
import StoryPhoto from "../../components/StoryPhoto";
import { Wheat } from "../../components/Icons";
export function About() {
  const { t, ar } = useStore();
  return (
    <div className="container page about-page">
      <div className="about-top">
        <div>
          <p className="eyebrow">{t("aboutSub")}</p>
          <h1>{t("aboutTitle")}</h1>
          <p>{t("aboutText")}</p>
          <p>{t("aboutText2")}</p>
          <Link className="btn btn-gold" to="/produits">
            {t("discover")}
          </Link>
        </div>
        <StoryPhoto />
      </div>
      <section className="section">
        <h2>{t("valuesTitle")}</h2>
        <div className="value-grid">
          {[1, 2, 3].map((i) => (
            <div className="value-card" key={i}>
              <Wheat size={26} />
              <h3>{t(`value${i}`)}</h3>
              <p>{t(`value${i}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
