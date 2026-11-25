import { useState } from "react";
import { Link } from "react-router-dom";
import { Wheat } from "../../components/Icons";
import WheatArtwork from "../../components/WheatArtwork";
import { useStore } from "../../store";
import { ProductImage, EmptyState } from "../../components/UI";
export function Grains() {
  const { t, products, ar, nameOf } = useStore();
  const grains = products.filter((p) => p.category === "grains" && p.visible);
  const [selected, setSelected] = useState("barley");
  const product = grains.find((p) => p.id === selected) || grains[0];
  return (
    <div className="container page grains-page">
      <header className="page-heading">
        <p className="eyebrow">{ar ? "على كيفك" : "À VOTRE ENVIE"}</p>
        <h1>
          {ar ? "خير الحبّة، وصنعة الرحية." : "Ce que la meule nous donne."}
        </h1>
        <p>
          {ar
            ? "اختار حبوبك، والرحية علينا."
            : "Choisissez vos grains, nous prenons soin de la mouture."}
        </p>
      </header>
      <div className="grain-experience">
        <div className="grain-wheel">
          <div className="wheel-orbit" />
          <div className="wheel-center">
            <WheatArtwork />
          </div>
          {grains.map((p, i) => {
            const angle = ((360 * i) / grains.length - 90) * Math.PI / 180;
            const frenchLabel = p.fr.replace(" (droô)", "");
            return (
              <button
                key={p.id}
                className={`grain-node ${product?.id === p.id ? "selected" : ""}`}
                style={{
                  left: `${50 + 37 * Math.cos(angle)}%`,
                  top: `${50 + 37 * Math.sin(angle)}%`,
                }}
                aria-label={`${p.fr} — ${p.ar}`}
                aria-pressed={product?.id === p.id}
                onClick={() => setSelected(p.id)}
              >
                <span className="grain-node-label">
                  <span className="grain-name" lang={ar ? "ar" : "fr"}>
                    {ar ? p.ar : frenchLabel}
                  </span>
                  <span className="grain-translation" lang={ar ? "fr" : "ar"}>
                    {ar ? frenchLabel : p.ar}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {product ? (
          <div className="grain-preview" key={product.id}>
            <ProductImage product={product} />
            <div>
              <span className="eyebrow">
                {ar ? "من خيرات بلادنا" : "LE GOÛT DU GRAIN"}
              </span>
              <h2 aria-live="polite">{nameOf(product)}</h2>
              <p>{ar ? product.descriptionAr : product.descriptionFr}</p>
              <Link className="btn btn-gold" to={`/produit/${product.id}`}>
                {ar ? "اختار رحيتك" : "Choisir ma mouture"}
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState text={t("empty")} />
        )}
      </div>
      <div className="grain-appointment">
        <Wheat size={25} />
        <div>
          <h3>{ar ? "عندك حبوبك؟" : "Vous avez vos propres grains ?"}</h3>
          <p>{ar ? "اختار النهار المناسب ليك، والطاحونة تتصل بيك باش تأكّد التوفّر." : "Choisissez le jour qui vous convient, la tahouna vous confirme la disponibilité."}</p>
        </div>
        <Link className="btn btn-outline" to="/rendez-vous">
          {t("appointment")}
        </Link>
      </div>
    </div>
  );
}
