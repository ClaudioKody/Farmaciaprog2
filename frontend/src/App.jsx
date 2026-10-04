import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Medicamentos from "./pages/Medicamentos.jsx";
import Categorias from "./pages/Categorias.jsx";
import Empleados from "./pages/Empleados.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/empleados" element={<Empleados />} />
      </Route>
    </Routes>
  );
}
