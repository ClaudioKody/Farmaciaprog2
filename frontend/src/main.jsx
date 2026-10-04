import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App.jsx";
import { NotifyProvider } from "./components/NotifyProvider.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#0f766e" },
    secondary: { main: "#b45309" },
    background: { default: "#f4f7f6" },
  },
  shape: { borderRadius: 8 },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotifyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotifyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
