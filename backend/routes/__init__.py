from .categorias_routes import bp as categorias_bp
from .dashboard_routes import bp as dashboard_bp
from .empleados_routes import bp as empleados_bp
from .medicamentos_routes import bp as medicamentos_bp


def register_routes(app):
    for bp in (medicamentos_bp, categorias_bp, empleados_bp, dashboard_bp):
        app.register_blueprint(bp)