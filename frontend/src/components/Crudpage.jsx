import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, MenuItem, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import api, { mensajeDeError } from "../api.js";
import { useNotify } from "./NotifyProvider.jsx";

/**
 * Pantalla CRUD reutilizable. Cada entidad solo define su configuración:
 *  - titulo / singular / femenino: textos
 *  - endpoint: ruta de la API (ej. "/medicamentos")
 *  - columnas: [{ key, label, render? }]
 *  - campos:   [{ name, label, type, required, optionsFrom? }]
 */
export default function CrudPage({ titulo, singular, femenino = false, endpoint, columnas, campos }) {
  const notificar = useNotify();
  const sufijo = femenino ? "a" : "o";

  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [opciones, setOpciones] = useState({}); // opciones de los <select>

  const [form, setForm] = useState(null); // null = cerrado
  const [editandoId, setEditandoId] = useState(null);
  const [errorForm, setErrorForm] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");
    try {
      const { data } = await api.get(endpoint);
      setFilas(data);
    } catch (err) {
      setErrorCarga(mensajeDeError(err, `Error al cargar ${titulo.toLowerCase()}`));
    } finally {
      setCargando(false);
    }
  }, [endpoint, titulo]);

  useEffect(() => { cargar(); }, [cargar]);

  // Carga las opciones de los campos tipo "select" (ej. categorías)
  useEffect(() => {
    campos.filter((c) => c.optionsFrom).forEach(async (c) => {
      try {
        const { data } = await api.get(c.optionsFrom);
        setOpciones((o) => ({ ...o, [c.name]: data.map((d) => ({ value: d.id, label: d.nombre })) }));
      } catch (err) {
        notificar(mensajeDeError(err, "Error al cargar las opciones"), "error");
      }
    });
  }, [campos, notificar]);

  const abrirNuevo = () => {
    setForm(Object.fromEntries(campos.map((c) => [c.name, ""])));
    setEditandoId(null);
    setErrorForm("");
  };

  const abrirEditar = (fila) => {
    setForm(Object.fromEntries(campos.map((c) => [c.name, fila[c.name] ?? ""])));
    setEditandoId(fila.id);
    setErrorForm("");
  };

  const verDetalle = async (id) => {
    try {
      const { data } = await api.get(`${endpoint}/${id}`); // GET por id
      setDetalle(data);
    } catch (err) {
      notificar(mensajeDeError(err, "No se pudo consultar el registro"), "error");
    }
  };

  const guardar = async () => {
    try {
      if (editandoId) await api.put(`${endpoint}/${editandoId}`, form);
      else await api.post(endpoint, form);
      notificar(`${singular} ${editandoId ? "modificad" : "cread"}${sufijo} correctamente`);
      setForm(null);
      cargar();
    } catch (err) {
      setErrorForm(mensajeDeError(err, `Error al guardar ${singular.toLowerCase()}`));
    }
  };

  const eliminar = async () => {
    try {
      await api.delete(`${endpoint}/${aEliminar.id}`);
      notificar(`${singular} eliminad${sufijo} correctamente`);
    } catch (err) {
      notificar(mensajeDeError(err, `Error al eliminar ${singular.toLowerCase()}`), "error");
    } finally {
      setAEliminar(null);
      cargar();
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" fontWeight={700}>{titulo}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirNuevo}>
          Nuev{sufijo} {singular.toLowerCase()}
        </Button>
      </Box>

      {errorCarga && (
        <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" onClick={cargar}>Reintentar</Button>}>
          ❌ {errorCarga}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columnas.map((c) => <TableCell key={c.key} sx={{ fontWeight: 700 }}>{c.label}</TableCell>)}
              <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargando ? (
              <TableRow><TableCell colSpan={columnas.length + 1} align="center"><CircularProgress size={28} /></TableCell></TableRow>
            ) : filas.length === 0 ? (
              <TableRow><TableCell colSpan={columnas.length + 1} align="center">No hay registros. Creá el primero con el botón de arriba.</TableCell></TableRow>
            ) : (
              filas.map((f) => (
                <TableRow key={f.id} hover>
                  {columnas.map((c) => <TableCell key={c.key}>{c.render ? c.render(f) : f[c.key]}</TableCell>)}
                  <TableCell align="right">
                    <Tooltip title="Ver"><IconButton onClick={() => verDetalle(f.id)}><VisibilityIcon /></IconButton></Tooltip>
                    <Tooltip title="Modificar"><IconButton color="primary" onClick={() => abrirEditar(f)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Eliminar"><IconButton color="error" onClick={() => setAEliminar(f)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulario crear / modificar */}
      <Dialog open={!!form} onClose={() => setForm(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editandoId ? "Modificar" : "Crear"} {singular.toLowerCase()}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
          {errorForm && <Alert severity="error">{errorForm}</Alert>}
          {form && campos.map((c) => (
            <TextField
              key={c.name}
              label={c.label}
              type={c.type === "select" ? undefined : c.type || "text"}
              select={c.type === "select"}
              required={c.required}
              value={form[c.name]}
              onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
              slotProps={{ inputLabel: { shrink: c.type === "date" ? true : undefined } }}
              fullWidth
            >
              {c.type === "select" && (opciones[c.name] || []).map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForm(null)}>Cancelar</Button>
          <Button variant="contained" onClick={guardar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Consulta por id */}
      <Dialog open={!!detalle} onClose={() => setDetalle(null)} fullWidth maxWidth="xs">
        <DialogTitle>Detalle de {singular.toLowerCase()}</DialogTitle>
        <DialogContent>
          {detalle && columnas.map((c) => (
            <Typography key={c.key} sx={{ mb: 0.5 }}>
              <b>{c.label}:</b> {c.render ? c.render(detalle) : detalle[c.key]}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions><Button onClick={() => setDetalle(null)}>Cerrar</Button></DialogActions>
      </Dialog>

      {/* Confirmación de borrado */}
      <Dialog open={!!aEliminar} onClose={() => setAEliminar(null)}>
        <DialogTitle>Eliminar {singular.toLowerCase()}</DialogTitle>
        <DialogContent>
          <DialogContentText>Esta acción no se puede deshacer. ¿Querés continuar?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAEliminar(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={eliminar}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
