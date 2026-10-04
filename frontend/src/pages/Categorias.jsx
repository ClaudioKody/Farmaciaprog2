import CrudPage from "../components/CrudPage.jsx";

const columnas = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Nombre" },
];

const campos = [{ name: "nombre", label: "Nombre", required: true }];

export default function Categorias() {
  return <CrudPage titulo="Categorías" singular="Categoría" femenino endpoint="/categorias" columnas={columnas} campos={campos} />;
}
