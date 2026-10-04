from flask import jsonify


def error(mensaje, codigo=400, detalles=None):
    cuerpo = {"error": mensaje}
    if detalles:
        cuerpo["detalles"] = detalles
    return jsonify(cuerpo), codigo


def texto(data, campo):
    return str(data.get(campo) or "").strip()
