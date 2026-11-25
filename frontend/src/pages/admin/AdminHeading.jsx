import { useStore } from "../../store";
export function AdminHeading({ title, description, children }) {
  const { t } = useStore();
  return (
    <header className="admin-heading">
      <div>
        <p className="eyebrow">MARAHI HANAN · {t("admin")}</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </header>
  );
}
