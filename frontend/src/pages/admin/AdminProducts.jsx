import { useState } from "react";
import { Plus, Search, Pencil, Trash } from "../../components/Icons";
import { useStore } from "../../store";
import { categories } from "../../data";
import { Modal, ProductImage } from "../../components/UI";
import { AdminHeading } from "./AdminHeading";
import { ProductEditor } from "./ProductEditor";
export function AdminProducts() {
  const { t, ar, products, setProducts, nameOf, money, setToast } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const list = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      `${p.fr} ${p.ar}`.toLowerCase().includes(query.toLowerCase()),
  );
  function remove() {
    setProducts((previous) => previous.filter((p) => p.id !== deleting.id));
    setDeleting(null);
    setToast(t("saved"));
  }
  return (
    <>
      <AdminHeading
        title={t("manageProducts")}
        description={`${products.length} ${t("results")}`}
      >
        <button className="btn btn-gold" onClick={() => setEditing({})}>
          <Plus size={18} />
          {t("newProduct")}
        </button>
      </AdminHeading>
      <div className="catalog-tools">
        <label className="search-field">
          <Search size={18} />
          <input
            placeholder={t("search")}
            aria-label={t("search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label={t("category")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">{t("all")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {nameOf(c)}
            </option>
          ))}
        </select>
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("products")}</th>
              <th>{t("category")}</th>
              <th>{t("price")}</th>
              <th>{t("status")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="table-product">
                    <ProductImage product={p} />
                    <span>
                      <strong>{nameOf(p)}</strong>
                      <small>{ar ? p.fr : p.ar}</small>
                    </span>
                  </div>
                </td>
                <td>
                  {nameOf(
                    categories.find((c) => c.id === p.category) ||
                      categories[0],
                  )}
                </td>
                <td>
                  <bdi>{money(p.price)}</bdi>
                </td>
                <td>
                  <span className={`visibility ${p.visible ? "visible" : ""}`}>
                    {p.visible ? t("online") : ar ? "مخفي" : "Masqué"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="icon-button"
                      title={t("edit")}
                      aria-label={`${t("edit")} ${nameOf(p)}`}
                      onClick={() => setEditing(p)}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button danger"
                      title={t("delete")}
                      aria-label={`${t("delete")} ${nameOf(p)}`}
                      onClick={() => setDeleting(p)}
                    >
                      <Trash size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="empty-table">{t("noRecords")}</p>}
      </div>
      {editing && (
        <ProductEditor product={editing} onClose={() => setEditing(null)} />
      )}{" "}
      {deleting && (
        <Modal title={t("deleteQuestion")} onClose={() => setDeleting(null)}>
          <p>{nameOf(deleting)}</p>
          <div className="button-row">
            <button className="btn btn-danger" onClick={remove}>
              {t("deleteConfirm")}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setDeleting(null)}
            >
              {t("cancel")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
