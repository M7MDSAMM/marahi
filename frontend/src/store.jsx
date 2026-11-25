import { createContext, useContext, useEffect, useState } from "react";
import { initialProducts, seedOrders, seedAppointments } from "./data";
import { messages } from "./i18n";

import { read } from "./services/storage";
import { useStoredState } from "./hooks/useStoredState";

const Store = createContext(null);
export function StoreProvider({ children }) {
  const [lang, setLang] = useStoredState("mh-language", "fr");
  const [theme, setTheme] = useStoredState("mh-theme", "dark");
  const [products, setProducts, productError] = useStoredState(
    "mh-products-v1",
    initialProducts,
  );
  const [cart, setCart, cartError] = useStoredState("mh-cart-v1", []);
  const [orders, setOrders, orderError] = useStoredState(
    "mh-orders-v1",
    seedOrders,
  );
  const [appointments, setAppointments, appointmentError] = useStoredState(
    "mh-appointments-v1",
    seedAppointments,
  );
  const [contacts, setContacts, contactError] = useStoredState(
    "mh-contacts-v1",
    [],
  );
  const [profile, setProfile, profileError] = useStoredState(
    "mh-profile-v1",
    {},
  );
  const [user, setUser] = useState(
    () => read("mh-user", null) || read("mh-user", null, sessionStorage),
  );
  const [toast, setToast] = useState("");
  const ar = lang === "ar";
  const t = (key) => messages[ar ? "ar" : "fr"][key] || key;
  const nameOf = (item) => (ar ? item.ar : item.fr);
  const money = (amount) =>
    `${new Intl.NumberFormat(ar ? "ar-TN" : "fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(amount)} ${ar ? "د.ت" : "DT"}`;
  const weightOf = (weight) =>
    weight >= 1000
      ? `${weight / 1000} ${ar ? "كغ" : "kg"}`
      : `${weight} ${ar ? "غ" : "g"}`;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = `${import.meta.env.BASE_URL}favicon-${theme}.svg`;
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = ar ? "ar" : "fr";
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [ar]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  function addToCart(
    product,
    weight = product.weights[0],
    variant = product.variants[0],
    quantity = 1,
    price = product.price,
  ) {
    const key = `${product.id}-${weight}-${variant.fr}`;
    setCart((previous) => {
      const existing = previous.find((item) => item.key === key);
      return existing
        ? previous.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
              : item,
          )
        : [
            ...previous,
            {
              key,
              id: product.id,
              fr: product.fr,
              ar: product.ar,
              image: product.image,
              customImage: product.customImage,
              weight,
              variantFr: variant.fr,
              variantAr: variant.ar,
              price,
              quantity,
            },
          ];
    });
    setToast(t("added"));
  }
  const changeQuantity = (key, quantity) =>
    setCart((previous) =>
      previous.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) }
          : item,
      ),
    );
  function login(data, remember = false) {
    const next = {
      name: data.name || profile.name || data.email.split("@")[0],
      email: data.email,
    };
    try {
      localStorage.removeItem("mh-user");
      sessionStorage.removeItem("mh-user");
      (remember ? localStorage : sessionStorage).setItem(
        "mh-user",
        JSON.stringify(next),
      );
    } catch {
      /* The in-memory session still works. */
    }
    setUser(next);
    setProfile((previous) => ({
      ...previous,
      ...next,
      ...(data.phone ? { phone: data.phone } : {}),
    }));
  }
  function logout() {
    setUser(null);
    localStorage.removeItem("mh-user");
    sessionStorage.removeItem("mh-user");
  }
  const storageError =
    productError ||
    cartError ||
    orderError ||
    appointmentError ||
    contactError ||
    profileError;
  return (
    <Store.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        ar,
        t,
        nameOf,
        money,
        weightOf,
        products,
        setProducts,
        cart,
        setCart,
        orders,
        setOrders,
        appointments,
        setAppointments,
        contacts,
        setContacts,
        profile,
        setProfile,
        user,
        login,
        logout,
        toast,
        setToast,
        addToCart,
        changeQuantity,
      }}
    >
      {children}
      {storageError && (
        <div className="storage-error" role="alert">
          {ar
            ? "تعذّر حفظ المعطيات في المتصفح. جرّب تنقص حجم الصور أو تفرّغ مساحة."
            : "Le stockage du navigateur est plein ou indisponible. Les modifications actuelles risquent de ne pas être conservées."}
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          ✓ {toast}
        </div>
      )}
    </Store.Provider>
  );
}
export const useStore = () => useContext(Store);
