import { useState } from "react";
import { Search, Settings } from "../../components/Icons";
import { useStore } from "../../store";
import { ProductCard, EmptyState } from "../../components/UI";
export function Catalog({ category }) {
  const { t, products, ar } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");
  let list = products.filter(
    (p) =>
      p.visible &&
      p.category === category &&
      (filter === "all" || p.type === filter) &&
      `${p.fr} ${p.ar}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  if (sort !== "default")
    list = [...list].sort((a, b) =>
      sort === "asc" ? a.price - b.price : b.price - a.price,
    );
  return (
    <div className="container page catalog-page">
      <header className="page-heading">
        <p className="eyebrow">
          {ar ? "مختارين بعناية" : "SÉLECTIONNÉS AVEC SOIN"}
        </p>
        <h1>{t(category === "nuts" ? "nuts" : "catalogTitle")}</h1>
        <p>{t(category === "nuts" ? "nutsDesc" : "catalogDesc")}</p>
      </header>
      <div className="catalog-tools">
        <label className="search-field">
          <Search size={19} />
          <input
            aria-label={t("search")}
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="sort-field">
          <Settings size={17} />
          <select
            aria-label={t("sort")}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">{t("sortDefault")}</option>
            <option value="asc">{t("sortAsc")}</option>
            <option value="desc">{t("sortDesc")}</option>
          </select>
        </div>
      </div>
      {category === "nuts" && (
        <div className="pills">
          {[
            ["all", "all"],
            ["nuts", "nutsType"],
            ["dried", "dried"],
          ].map(([v, key]) => (
            <button
              className={`pill ${filter === v ? "active" : ""}`}
              key={v}
              onClick={() => setFilter(v)}
            >
              {t(key)}
            </button>
          ))}
        </div>
      )}
      <p className="result-count">
        {list.length} {t("results")}
      </p>
      <div className="product-grid catalog-grid">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {list.length === 0 && <EmptyState text={t("empty")} />}
    </div>
  );
}
