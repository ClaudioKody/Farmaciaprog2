// Cliente HTTP (Axios). Todas las llamadas van a /api (proxy hacia Flask).
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Convierte cualquier error de Axios en un mensaje legible para el usuario.
export function mensajeDeError(err, porDefecto = "Ocurrió un error") {
  const data = err.response?.data;
  if (data?.detalles?.length) return data.detalles.join(". ");
  if (data?.error) return data.error;
  if (err.code === "ERR_NETWORK") return "No se pudo conectar con el servidor";
  return porDefecto;
}

export default api;
