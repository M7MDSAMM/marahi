import { useState } from "react";
import { Link } from "react-router-dom";
import { Next, Pin, Heart, Wallet } from "../components/Icons";
import { useStore } from "../store";
import { categories, imagePath } from "../data";
import { ProductCard, SectionHeading } from "../components/UI";
import Hero from "../components/home/Hero";
import StoryPhoto from "../components/StoryPhoto";
export default function Home() {
  const { t, ar, products, nameOf } = useStore();
  const [start, setStart] = useState(0);
  const featured = products.filter((p) => p.visible && p.featured);
  const shown = Array.from(
    { length: Math.min(featured.length, 3) },
    (_, i) => featured[(start + i) % featured.length],
  );
  return (
    <>
      <Hero />
      <div className="trust-strip">
        <div className="container">
          <span>
            <Pin size={18} />
            {t("local")}
          </span>
          <span>
            <Heart size={19} />
            {t("made")}
          </span>
          <span>
            <Wallet size={18} />
            {t("payment")}
          </span>
        </div>
      </div>
      <section className="section container">
        <SectionHeading small={t("categoriesSmall")} title={t("categories")} />
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link className="category-card" key={c.id} to={c.path}>
              <img src={imagePath(c.image)} alt={nameOf(c)} loading="lazy" />
              <div>
                <span className="category-number">
                  {["حبوب", "تقليدي", "فواكه جافة"][i]}
                </span>
                <h3>{nameOf(c)}</h3>
                <span className="category-discover">
                  {t("view")} <PlusSign />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section section-featured container">
        <SectionHeading
          small={t("featuredSmall")}
          title={t("featured")}
          link={t("seeAll")}
          to="/produits"
        />
        <div className="featured-wrap">
          <div className="product-grid featured-grid">
            {shown.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
          {featured.length > 3 && (
            <button
              className="featured-next icon-button"
              aria-label={ar ? "منتوجات أخرى" : "Autres produits"}
              onClick={() => setStart((start + 1) % featured.length)}
            >
              <Next />
            </button>
          )}
        </div>
      </section>
      <section className="how-section">
        <div className="container">
          <p className="eyebrow">{ar ? "ساهلة وبسيطة" : "C’EST TOUT SIMPLE"}</p>
          <h2>{t("how")}</h2>
          <div className="steps">
            {[1, 2, 3].map((i) => (
              <div className="step" key={i}>
                <span className="step-number">0{i}</span>
                <h3>{t(`step${i}`)}</h3>
                <p>{t(`step${i}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container story-block">
        <StoryPhoto />
        <div className="story-copy">
          <p className="eyebrow">{t("about")}</p>
          <h2>{t("storyTitle")}</h2>
          <p>{t("storyDesc")}</p>
          <Link className="btn btn-outline" to="/a-propos">
            {t("storyLink")}
          </Link>
        </div>
      </section>
    </>
  );
}
function PlusSign() {
  return <span aria-hidden="true">+</span>;
}
