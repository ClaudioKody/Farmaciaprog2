import CrudPage from "../components/CrudPage.jsx";

const columnas = [
  { key: "nombre", label: "Nombre" },
  { key: "descripcion", label: "Descripción" },
  { key: "precio", label: "Precio", render: (m) => `$ ${Number(m.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}` },
  { key: "stock", label: "Stock" },
  { key: "fecha_vencimiento", label: "Vencimiento" },
  { key: "categoria", label: "Categoría" },
];

const campos = [
  { name: "nombre", label: "Nombre", required: true },
  { name: "descripcion", label: "Descripción" },
  { name: "precio", label: "Precio", type: "number", required: true },
  { name: "stock", label: "Stock", type: "number", required: true },
  { name: "fecha_vencimiento", label: "Fecha de vencimiento", type: "date", required: true },
  { name: "categoria_id", label: "Categoría", type: "select", required: true, optionsFrom: "/categorias" },
];

export default function Medicamentos() {
  return <CrudPage titulo="Medicamentos" singular="Medicamento" endpoint="/medicamentos" columnas={columnas} campos={campos} />;
}
