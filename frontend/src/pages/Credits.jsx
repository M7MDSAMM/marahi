import { useStore } from "../store";
import { categories, imagePath } from "../data";

export default function Credits() {
  const { ar, products, nameOf } = useStore();
  const visuals = [...categories, ...products];
  return (
    <div className="container page credits-page">
      <header className="page-heading">
        <h1>{ar ? "صور المشروع" : "Visuels du projet"}</h1>
        <p>{ar ? "صور الفئات والمنتوجات مبنية على المراجع المقدّمة للمشروع. حُسّنت صور العبوات مع المحافظة على شكلها. هي صور توضيحية للعرض وليست تصويرًا لمنتوجات المحل الفعلية." : "Les visuels des catégories et des produits proviennent des maquettes fournies avec le projet. Les images des trois pots ont été retravaillées en conservant leur présentation. Ce sont des visuels illustratifs, pas des photographies des produits réels de la boutique."}</p>
      </header>
      <div className="credits-grid">
        {visuals.map(item => (
          <article className="credit-card" key={item.id}>
            <img src={imagePath(item.image)} alt="" loading="lazy" />
            <div><h2>{nameOf(item)}</h2><p>{ar ? "مرجع المشروع" : "Maquette du projet"}</p></div>
          </article>
        ))}
      </div>
      <p className="credits-icons">{ar ? "الأيقونات:" : "Icônes :"} <a href="https://fontawesome.com/license/free" target="_blank" rel="noreferrer">Font Awesome Free — CC BY 4.0</a></p>
    </div>
  );
}
