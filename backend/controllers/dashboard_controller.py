from flask import jsonify

from models import Categoria, Empleado, Medicamento


def resumen():
    return jsonify({
        "medicamentos": Medicamento.query.count(),
        "categorias": Categoria.query.count(),
        "empleados": Empleado.query.count(),
    })