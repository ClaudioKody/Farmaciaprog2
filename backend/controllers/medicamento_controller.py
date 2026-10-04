from datetime import date
from decimal import Decimal, InvalidOperation

from flask import jsonify, request

from database import db
from models import Categoria, Medicamento
from controllers.utils import error, texto


def listar():
    medicamentos = Medicamento.query.order_by(Medicamento.nombre).all()
    return jsonify([m.to_dict() for m in medicamentos])


def obtener(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    return jsonify(medicamento.to_dict())


def _validar(data):
    errores = []
    limpio = {}

    limpio["nombre"] = texto(data, "nombre")
    if not limpio["nombre"]:
        errores.append("El nombre es obligatorio")

    limpio["descripcion"] = texto(data, "descripcion") or None

    try:
        precio = Decimal(str(data.get("precio")))
        if precio <= 0:
            errores.append("El precio debe ser mayor a 0")
        limpio["precio"] = precio
    except (InvalidOperation, TypeError):
        errores.append("El precio debe ser un número válido")

    try:
        stock = int(data.get("stock"))
        if stock < 0:
            errores.append("El stock no puede ser negativo")
        limpio["stock"] = stock
    except (ValueError, TypeError):
        errores.append("El stock debe ser un número entero")

    categoria_id = data.get("categoria_id")
    if not categoria_id:
        errores.append("La categoría es obligatoria")
    elif not db.session.get(Categoria, categoria_id):
        errores.append("La categoría indicada no existe")
    limpio["categoria_id"] = categoria_id

    try:
        limpio["fecha_vencimiento"] = date.fromisoformat(texto(data, "fecha_vencimiento"))
    except ValueError:
        errores.append("La fecha de vencimiento no es válida (formato AAAA-MM-DD)")

    return limpio, errores


def crear():
    datos, errores = _validar(request.get_json(silent=True) or {})
    if errores:
        return error("Datos inválidos", 400, errores)
    medicamento = Medicamento(**datos)
    db.session.add(medicamento)
    db.session.commit()
    return jsonify(medicamento.to_dict()), 201


def actualizar(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    datos, errores = _validar(request.get_json(silent=True) or {})
    if errores:
        return error("Datos inválidos", 400, errores)
    for campo, valor in datos.items():
        setattr(medicamento, campo, valor)
    db.session.commit()
    return jsonify(medicamento.to_dict())


def eliminar(id):
    medicamento = db.session.get(Medicamento, id)
    if not medicamento:
        return error("Medicamento no encontrado", 404)
    db.session.delete(medicamento)
    db.session.commit()
    return jsonify({"mensaje": "Medicamento eliminado"})
