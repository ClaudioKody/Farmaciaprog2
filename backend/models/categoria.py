from database import db


class Categoria(db.Model):
    __tablename__ = "categorias"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False, unique=True)

    
    medicamentos = db.relationship("Medicamento", back_populates="categoria")

    def to_dict(self):
        return {"id": self.id, "nombre": self.nombre}
