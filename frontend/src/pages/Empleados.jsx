import CrudPage from "../components/CrudPage.jsx";

const columnas = [
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "dni", label: "DNI" },
  { key: "email", label: "Email" },
  { key: "cargo", label: "Cargo" },
];

const campos = [
  { name: "nombre", label: "Nombre", required: true },
  { name: "apellido", label: "Apellido", required: true },
  { name: "dni", label: "DNI", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "cargo", label: "Cargo", required: true },
];

export default function Empleados() {
  return <CrudPage titulo="Empleados" singular="Empleado" endpoint="/empleados" columnas={columnas} campos={campos} />;
}
