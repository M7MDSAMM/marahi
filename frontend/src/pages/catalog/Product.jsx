import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Wheat, Basket } from "../../components/Icons";
import { useStore } from "../../store";
import { priceFor } from "../../data";
import { ProductImage, Quantity, EmptyState } from "../../components/UI";
export function Product() {
  const { id } = useParams();
  const { t, ar, products, nameOf, money, weightOf, addToCart } = useStore();
  const product = products.find((p) => p.id === id && p.visible);
  const [weight, setWeight] = useState(null);
  const [variant, setVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  if (!product)
    return (
      <div className="container page">
        <EmptyState text={t("notFound")}>
          <Link to="/produits" className="btn btn-gold">
            {t("products")}
          </Link>
        </EmptyState>
      </div>
    );
  const selectedWeight = product.weights.includes(weight)
    ? weight
    : product.weights[0];
  const chosenVariant = product.variants[variant] || product.variants[0];
  const price = priceFor(product, selectedWeight);
  return (
    <div className="container page">
      <div className="breadcrumbs">
        <Link to="/">{t("home")}</Link>
        <span>/</span>
        <Link
          to={
            product.category === "grains"
              ? "/grains"
              : product.category === "nuts"
                ? "/fruits-secs"
                : "/produits"
          }
        >
          {t(
            product.category === "grains"
              ? "grains"
              : product.category === "nuts"
                ? "nuts"
                : "products",
          )}
        </Link>
        <span>/</span>
        <span>{nameOf(product)}</span>
      </div>
      <div className="product-detail">
        <div className="detail-image">
          <ProductImage product={product} />
          <span className="detail-stamp">
            <Wheat size={19} />
            {t("made")}
          </span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">MARAHI HANAN · EL ALIA</p>
          <h1>{nameOf(product)}</h1>
          <p className="alternate-name" lang={ar ? "fr" : "ar"}>
            {ar ? product.fr : product.ar}
          </p>
          <p className="detail-description">
            {ar ? product.descriptionAr : product.descriptionFr}
          </p>
          <fieldset className="option-group">
            <legend>{t("variety")}</legend>
            <div className="pills">
              {product.variants.map((v, i) => (
                <button
                  type="button"
                  key={i}
                  className={`pill ${variant === i ? "active" : ""}`}
                  aria-pressed={variant === i}
                  onClick={() => setVariant(i)}
                >
                  {ar ? v.ar : v.fr}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="option-group">
            <legend>{t("weight")}</legend>
            <div className="pills">
              {product.weights.map((w) => (
                <button
                  type="button"
                  key={w}
                  className={`weight-option ${selectedWeight === w ? "active" : ""}`}
                  aria-pressed={selectedWeight === w}
                  onClick={() => setWeight(w)}
                >
                  {weightOf(w)}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="detail-buy-row">
            <strong className="detail-price">{money(price * quantity)}</strong>
            <Quantity value={quantity} onChange={setQuantity} />
          </div>
          <button
            className="btn btn-gold detail-add"
            onClick={() =>
              addToCart(product, selectedWeight, chosenVariant, quantity, price)
            }
          >
            <Basket size={20} />
            {t("add")}
          </button>
          <p className="payment-note">
            {t("payment")} · {t("pickup")}
          </p>
          <details className="allergen-info">
            <summary>{t("ingredients")}</summary>
            <p>{t("allergens")}</p>
          </details>
        </div>
      </div>
    </div>
  );
}
