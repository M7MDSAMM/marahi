import { Photo } from "../../components/Icons";
import { useStore } from "../../store";
import { categories } from "../../data";
import { Modal, ProductImage } from "../../components/UI";
import { useProductEditor } from "./useProductEditor";
export function ProductEditor({ product, onClose }) {
  const { t, nameOf } = useStore();
  const { customImage, error, uploading, upload, save } = useProductEditor(product, onClose);
  return (
    <Modal
      title={t(product.id ? "editProduct" : "newProduct")}
      onClose={onClose}
    >
      <form onSubmit={save}>
        <div className="form-columns">
          <label>
            Nom (français)
            <input
              name="fr"
              required
              defaultValue={product.fr}
              maxLength={100}
            />
          </label>
          <label lang="ar">
            الاسم بالعربية
            <input
              name="ar"
              required
              dir="rtl"
              defaultValue={product.ar}
              maxLength={100}
            />
          </label>
          <label>
            {t("category")}
            <select
              name="category"
              defaultValue={product.category || "traditional"}
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {nameOf(c)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("price")}
            <input
              type="number"
              name="price"
              min="0.001"
              max="9999"
              step="0.001"
              required
              defaultValue={product.price}
            />
          </label>
          <label>
            Variétés (français)
            <input
              name="variantsFr"
              defaultValue={
                product.variants?.map((v) => v.fr).join(", ") || "Nature"
              }
              required
            />
            <small>{t("variantsHelp")}</small>
          </label>
          <label>
            الأنواع بالعربية
            <input
              name="variantsAr"
              dir="rtl"
              defaultValue={
                product.variants?.map((v) => v.ar).join("، ") || "طبيعي"
              }
              required
            />
          </label>
          <label>
            {t("weight")}
            <input
              name="weights"
              required
              defaultValue={product.weights?.join(", ") || "250, 500, 1000"}
            />
            <small>{t("weightsHelp")}</small>
          </label>
          <label>
            {t("nuts")}
            <select name="type" defaultValue={product.type || "nuts"}>
              <option value="nuts">{t("nutsType")}</option>
              <option value="dried">{t("dried")}</option>
            </select>
          </label>
        </div>
        <label>
          Description (français)
          <textarea
            name="descriptionFr"
            rows="3"
            required
            defaultValue={product.descriptionFr}
            maxLength={2000}
          />
        </label>
        <label>
          الوصف بالعربية
          <textarea
            name="descriptionAr"
            dir="rtl"
            rows="3"
            required
            defaultValue={product.descriptionAr}
            maxLength={2000}
          />
        </label>
        <div className="editor-image-row">
          <div className="editor-preview">
            <ProductImage
              product={{
                ...product,
                customImage,
                image: product.image || "traditional",
              }}
            />
          </div>
          <label className="file-label">
            <Photo />
            {t("upload")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={upload}
            />
            <small>JPG / PNG / WEBP · 750 Ko max.</small>
          </label>
        </div>
        <div className="editor-options">
          <label className="check-label">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={product.visible !== false}
            />
            {t("visible")}
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product.featured}
            />
            {t("featured")}
          </label>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="button-row">
          <button className="btn btn-gold" disabled={uploading}>
            {t("save")}
          </button>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            {t("cancel")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
