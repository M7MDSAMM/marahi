import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Close, Basket, Wheat } from "./Icons";
import { useStore } from "../store";
import { imagePath } from "../data";

export function ProductImage({ product, ...props }) {
  return (
    <img
      src={product.customImage || imagePath(product.image)}
      alt={product.fr && product.ar ? `${product.fr} — ${product.ar}` : ""}
      loading="lazy"
      {...props}
    />
  );
}
export function SectionHeading({ small, title, link, to }) {
  return (
    <div className="section-heading">
      <div>
        {small && <p className="eyebrow">{small}</p>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" to={to}>
          {link}
        </Link>
      )}
    </div>
  );
}
export function Quantity({ value, onChange }) {
  const { t } = useStore();
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`${t("quantity")} −`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label={`${t("quantity")} +`}
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function ProductCard({ product }) {
  const { t, nameOf, money, weightOf, addToCart, ar } = useStore();
  return (
    <article className="product-card">
      <Link className="product-photo" to={`/produit/${product.id}`}>
        <ProductImage product={product} />
        {product.featured && (
          <span className="product-badge">
            {ar ? "من اختيارنا" : "Notre favori"}
          </span>
        )}
      </Link>
      <div className="product-info">
        <span className="product-subtitle" lang={ar ? "fr" : "ar"}>
          {ar ? product.fr : product.ar}
        </span>
        <Link to={`/produit/${product.id}`}>
          <h3>{nameOf(product)}</h3>
        </Link>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <span>{weightOf(product.weights[0])}</span>
        </div>
        <button
          className="btn btn-gold card-add"
          onClick={() => addToCart(product)}
        >
          <Plus size={16} />
          {t("add")}
        </button>
      </div>
    </article>
  );
}
export function EmptyState({ text, children }) {
  return (
    <div className="empty-state">
      <Basket size={42} strokeWidth={1} />
      <h2>{text}</h2>
      {children}
    </div>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const { t } = useStore();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="modal"
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label={t("close")}
        >
          <Close />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function DemoNotice({ admin = false }) {
  const { t } = useStore();
  return (
    <p className="demo-notice">
      <Wheat size={17} />
      {t(admin ? "adminNote" : "demoNotice")}
    </p>
  );
}
export function Status({ status }) {
  const { t } = useStore();
  return <span className={`status status-${status}`}>{t(status)}</span>;
}
