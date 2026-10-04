import re

from flask import jsonify, request

from database import db
from models import Empleado
from controllers.utils import error, texto

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def listar():
    empleados = Empleado.query.order_by(Empleado.apellido, Empleado.nombre).all()
    return jsonify([e.to_dict() for e in empleados])


def obtener(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    return jsonify(empleado.to_dict())


def _validar(data, id_actual=None):
    errores = []
    limpio = {c: texto(data, c) for c in ("nombre", "apellido", "dni", "email", "cargo")}

    etiquetas = {"nombre": "nombre", "apellido": "apellido", "dni": "DNI", "cargo": "cargo"}
    for campo, etiqueta in etiquetas.items():
        if not limpio[campo]:
            errores.append(f"El {etiqueta} es obligatorio")

    if not EMAIL_RE.match(limpio["email"]):
        errores.append("El email no es válido")

    if limpio["dni"]:
        repetido = Empleado.query.filter_by(dni=limpio["dni"]).first()
        if repetido and repetido.id != id_actual:
            errores.append("Ya existe un empleado con ese DNI")

    return limpio, errores


def crear():
    datos, errores = _validar(request.get_json(silent=True) or {})
    if errores:
        return error("Datos inválidos", 400, errores)
    empleado = Empleado(**datos)
    db.session.add(empleado)
    db.session.commit()
    return jsonify(empleado.to_dict()), 201


def actualizar(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    datos, errores = _validar(request.get_json(silent=True) or {}, id)
    if errores:
        return error("Datos inválidos", 400, errores)
    for campo, valor in datos.items():
        setattr(empleado, campo, valor)
    db.session.commit()
    return jsonify(empleado.to_dict())


def eliminar(id):
    empleado = db.session.get(Empleado, id)
    if not empleado:
        return error("Empleado no encontrado", 404)
    db.session.delete(empleado)
    db.session.commit()
    return jsonify({"mensaje": "Empleado eliminado"})
