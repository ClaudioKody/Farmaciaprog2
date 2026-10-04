import { createContext, useCallback, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const NotifyContext = createContext(() => {});

// Permite mostrar avisos (Snackbar + Alert) desde cualquier componente.
export function NotifyProvider({ children }) {
  const [aviso, setAviso] = useState({ open: false, mensaje: "", tipo: "success" });

  const notificar = useCallback((mensaje, tipo = "success") => {
    setAviso({ open: true, mensaje, tipo });
  }, []);

  return (
    <NotifyContext.Provider value={notificar}>
      {children}
      <Snackbar
        open={aviso.open}
        autoHideDuration={4000}
        onClose={() => setAviso((a) => ({ ...a, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={aviso.tipo} variant="filled" sx={{ width: "100%" }}>
          {aviso.tipo === "success" ? "✅ " : "❌ "}
          {aviso.mensaje}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}

export const useNotify = () => useContext(NotifyContext);
