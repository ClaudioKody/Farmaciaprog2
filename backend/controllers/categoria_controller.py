from flask import jsonify, request

from database import db
from models import Categoria
from controllers.utils import error, texto


def listar():
    categorias = Categoria.query.order_by(Categoria.nombre).all()
    return jsonify([c.to_dict() for c in categorias])


def obtener(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    return jsonify(categoria.to_dict())


def _validar(data, id_actual=None):
    nombre = texto(data, "nombre")
    if not nombre:
        return None, ["El nombre es obligatorio"]
    existente = Categoria.query.filter(db.func.lower(Categoria.nombre) == nombre.lower()).first()
    if existente and existente.id != id_actual:
        return None, ["Ya existe una categoría con ese nombre"]
    return nombre, []


def crear():
    nombre, errores = _validar(request.get_json(silent=True) or {})
    if errores:
        return error("Datos inválidos", 400, errores)
    categoria = Categoria(nombre=nombre)
    db.session.add(categoria)
    db.session.commit()
    return jsonify(categoria.to_dict()), 201


def actualizar(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    nombre, errores = _validar(request.get_json(silent=True) or {}, id)
    if errores:
        return error("Datos inválidos", 400, errores)
    categoria.nombre = nombre
    db.session.commit()
    return jsonify(categoria.to_dict())


def eliminar(id):
    categoria = db.session.get(Categoria, id)
    if not categoria:
        return error("Categoría no encontrada", 404)
    if categoria.medicamentos:
        return error("No se puede eliminar: la categoría tiene medicamentos asociados", 409)
    db.session.delete(categoria)
    db.session.commit()
    return jsonify({"mensaje": "Categoría eliminada"})
