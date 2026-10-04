import { useEffect, useState } from "react";
import { Alert, Box, Card, CardActionArea, CardContent, CircularProgress, Typography } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import BadgeIcon from "@mui/icons-material/Badge";
import { Link } from "react-router-dom";

import api, { mensajeDeError } from "../api.js";

const tarjetas = [
  { clave: "medicamentos", titulo: "Medicamentos", icono: <MedicationIcon fontSize="large" />, ruta: "/medicamentos" },
  { clave: "categorias", titulo: "Categorías", icono: <CategoryIcon fontSize="large" />, ruta: "/categorias" },
  { clave: "empleados", titulo: "Empleados", icono: <BadgeIcon fontSize="large" />, ruta: "/empleados" },
];

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((r) => setDatos(r.data))
      .catch((err) => setError(mensajeDeError(err, "Error al cargar el dashboard")));
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Dashboard</Typography>
      {error && <Alert severity="error">❌ {error}</Alert>}
      {!datos && !error && <CircularProgress />}
      {datos && (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
          {tarjetas.map((t) => (
            <Card key={t.clave} variant="outlined">
              <CardActionArea component={Link} to={t.ruta}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, color: "primary.main" }}>
                  {t.icono}
                  <Box>
                    <Typography variant="h3" fontWeight={700} lineHeight={1}>{datos[t.clave]}</Typography>
                    <Typography color="text.secondary">{t.titulo}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
