export { categories } from "./data/categories";
export { initialProducts } from "./data/products";
export { seedOrders, seedAppointments } from "./data/demo";
export const shop = {
  phone: "21653002415",
  displayPhone: "+216 53 002 415",
  addressFr: "El Alia, Bizerte, Tunisie",
  addressAr: "العالية، بنزرت، تونس",
  hours: "08:00 – 16:00",
};
const retouchedPhotos = ["bsissa", "zrir", "sesame"];
export const imagePath = (name) =>
  `${import.meta.env.BASE_URL}images/catalog/${name}.${retouchedPhotos.includes(name) ? "png" : "webp"}`;
export const priceFor = (product, weight) =>
  Math.round(((product.price * weight) / product.weights[0]) * 1000) / 1000;
export const validPhone = (value) =>
  /^(?:\+?216)?[24579]\d{7}$/.test(value.replace(/[\s()-]/g, ""));
