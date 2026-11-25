import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "../../components/Icons";
import { useStore } from "../../store";
import { validPhone } from "../../data";
import WheatArtwork from "../../components/WheatArtwork";
import { Logo, LanguageButton, ThemeButton } from "../../components/Layout";
export function Auth({ mode = "login" }) {
  const { t, ar, login } = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [simulated, setSimulated] = useState(false);
  const register = mode === "register";
  const forgot = mode === "forgot";
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (forgot) {
      setSimulated(true);
      return;
    }
    if (register && !validPhone(data.phone)) {
      setError(t("phoneError"));
      return;
    }
    login(data, data.remember === "on");
    navigate("/compte");
  }
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <Logo />
        <WheatArtwork className="auth-wheat" />
        <span className="auth-calligraphy" lang="ar">
          من الحبّة
          <br />
          للـبنّة.
        </span>
        <p>{t("footerTag")}</p>
      </div>
      <div className="auth-main">
        <div className="auth-tools">
          <Link className="text-link" to="/">
            {t("home")}
          </Link>
          <ThemeButton />
          <LanguageButton />
        </div>
        <div className="auth-form-wrap" key={mode}>
          <p className="eyebrow">MARAHI HANAN</p>
          <h1>
            {t(
              simulated
                ? "emailCheck"
                : register
                  ? "register"
                  : forgot
                    ? "forgot"
                    : "login",
            )}
          </h1>
          <p className="auth-description">
            {t(
              simulated
                ? "emailCheckDesc"
                : register
                  ? "registerDesc"
                  : forgot
                    ? "forgotDesc"
                    : "loginDesc",
            )}
          </p>
          {simulated ? (
            <>
              <div className="confirmation-check small">
                <Check />
              </div>
              <button
                className="btn btn-gold full-width"
                onClick={() => setSimulated(false)}
              >
                {t("resend")}
              </button>
              <Link className="text-link center" to="/connexion">
                {t("login")}
              </Link>
            </>
          ) : (
            <>
              <p className="demo-notice">{t("authNote")}</p>
              <form onSubmit={submit}>
                {register && (
                  <>
                    <label>
                      {t("name")}
                      <input
                        name="name"
                        required
                        autoComplete="name"
                        maxLength={100}
                      />
                    </label>
                    <label>
                      {t("phone")}
                      <input
                        name="phone"
                        type="tel"
                        dir="ltr"
                        required
                        placeholder="+216 53 000 000"
                      />
                    </label>
                  </>
                )}
                <label>
                  {t("email")}
                  <input
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    placeholder="vous@exemple.com"
                  />
                </label>
                {!forgot && (
                  <label>
                    {t("password")}
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete={
                        register ? "new-password" : "current-password"
                      }
                      placeholder={
                        ar ? "8 أحرف على الأقل" : "8 caractères minimum"
                      }
                    />
                  </label>
                )}
                {!register && !forgot && (
                  <div className="auth-options">
                    <label className="check-label">
                      <input type="checkbox" name="remember" />
                      {t("remember")}
                    </label>
                    <Link to="/mot-de-passe-oublie">{t("forgot")}</Link>
                  </div>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="btn btn-gold full-width">
                  {t(
                    register
                      ? "registerButton"
                      : forgot
                        ? "forgotButton"
                        : "loginButton",
                  )}
                </button>
              </form>
              <p className="auth-bottom">
                {!forgot && t(register ? "already" : "noAccount")}{" "}
                <Link to={register || forgot ? "/connexion" : "/inscription"}>
                  {t(register || forgot ? "login" : "register")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
