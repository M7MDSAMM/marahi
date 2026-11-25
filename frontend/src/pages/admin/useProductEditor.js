import { useState } from "react";
import { useStore } from "../../store";
export function useProductEditor(product, onClose) {
  const { t, ar, setProducts, nameOf, setToast } = useStore();
  const [customImage, setCustomImage] = useState(product.customImage || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 750000
    ) {
      setError(
        ar
          ? "اختار صورة JPG أو PNG أو WEBP أصغر من 750 كيلوبايت."
          : "Choisissez une image JPG, PNG ou WEBP de moins de 750 Ko.",
      );
      e.target.value = "";
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCustomImage(reader.result);
      setUploading(false);
      setError("");
    };
    reader.onerror = () => {
      setUploading(false);
      setError(ar ? "تعذّرت قراءة الصورة." : "Impossible de lire cette image.");
    };
    reader.readAsDataURL(file);
  }
  function save(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const weights = [
      ...new Set(data.weights.split(/[,،]/).map((v) => Number(v.trim()))),
    ];
    const fr = data.variantsFr
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const arabic = data.variantsAr
      .split(/[,،]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (
      !weights.length ||
      weights.some((w) => !Number.isFinite(w) || w <= 0) ||
      !fr.length ||
      fr.length !== arabic.length
    ) {
      setError(
        ar
          ? "تثبّت من الأوزان، ويلزم عدد الأنواع بالفرنسي والعربي يكون كيف كيف."
          : "Vérifiez les poids et renseignez le même nombre de variétés en français et en arabe.",
      );
      return;
    }
    const updated = {
      ...product,
      id: product.id || `p-${Date.now()}`,
      fr: data.fr.trim(),
      ar: data.ar.trim(),
      category: data.category,
      price: Number(data.price),
      weights,
      variants: fr.map((name, i) => ({ fr: name, ar: arabic[i] })),
      image:
        product.image ||
        (data.category === "grains"
          ? "grains"
          : data.category === "nuts"
            ? "nuts"
            : "traditional"),
      customImage,
      descriptionFr: data.descriptionFr.trim(),
      descriptionAr: data.descriptionAr.trim(),
      visible: data.visible === "on",
      featured: data.featured === "on",
      type: data.type,
    };
    setProducts((previous) =>
      product.id
        ? previous.map((p) => (p.id === product.id ? updated : p))
        : [...previous, updated],
    );
    setToast(t("saved"));
    onClose();
  }
  return { customImage, error, uploading, upload, save };
}
