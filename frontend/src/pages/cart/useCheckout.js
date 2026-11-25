import { useState } from "react";
import { useStore } from "../../store";
import { validPhone } from "../../data";
export function useCheckout() {
  const {
    t,
    ar,
    cart,
    setCart,
    changeQuantity,
    money,
    weightOf,
    nameOf,
    setOrders,
    profile,
    user,
  } = useStore();
  const [mode, setMode] = useState("pickup");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const fee = mode === "delivery" ? 7 : 0;
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!validPhone(data.phone)) {
      setError(t("phoneError"));
      return;
    }
    const order = {
      ...data,
      id: `MH-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      mode,
      items: cart.map((i) => ({ ...i })),
      subtotal,
      fee,
      total: Math.round((subtotal + fee) * 1000) / 1000,
      status: "pending",
      demo: false,
    };
    setOrders((previous) => [order, ...previous]);
    setConfirmed(order);
    setCart([]);
    setError("");
    window.scrollTo(0, 0);
  }
  return { mode, setMode, error, confirmed, subtotal, fee, submit };
}
