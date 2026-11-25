import { Link } from "react-router-dom";
import { Sun, Moon } from "../Icons";
import { useStore } from "../../store";
import LogoArtwork from "../LogoArtwork";
export function Logo() {
  const { ar } = useStore();
  return (
    <Link
      className="brand"
      to="/"
      aria-label={ar ? "مراحي حنان، الرئيسية" : "Marahi Hanan, accueil"}
    >
      <LogoArtwork />
    </Link>
  );
}
export function LanguageButton() {
  const { t, setLang, ar } = useStore();
  return (
    <button
      className="language-button"
      onClick={() => setLang(ar ? "fr" : "ar")}
      lang={ar ? "fr" : "ar"}
    >
      {t("language")}
    </button>
  );
}
export function ThemeButton() {
  const { theme, setTheme, ar } = useStore();
  return (
    <button
      className="icon-button theme-toggle"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={
        ar
          ? theme === "dark"
            ? "الوضع الفاتح"
            : "الوضع الداكن"
          : theme === "dark"
            ? "Mode clair"
            : "Mode sombre"
      }
      title={
        ar
          ? theme === "dark"
            ? "الوضع الفاتح"
            : "الوضع الداكن"
          : theme === "dark"
            ? "Mode clair"
            : "Mode sombre"
      }
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
