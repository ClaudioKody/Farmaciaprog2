import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import { NavLink, Outlet } from "react-router-dom";

const enlaces = [
  { to: "/", label: "Dashboard" },
  { to: "/medicamentos", label: "Medicamentos" },
  { to: "/categorias", label: "Categorías" },
  { to: "/empleados", label: "Empleados" },
];

export default function Layout() {
  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <LocalPharmacyIcon />
          <Typography variant="h6" sx={{ mr: 3, fontWeight: 700 }}>
            Farmacia
          </Typography>
          {enlaces.map((e) => (
            <Button
              key={e.to}
              component={NavLink}
              to={e.to}
              end={e.to === "/"}
              color="inherit"
              sx={{ "&.active": { bgcolor: "rgba(255,255,255,.18)" } }}
            >
              {e.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
