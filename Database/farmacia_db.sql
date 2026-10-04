

DROP DATABASE IF EXISTS farmacia_db;
CREATE DATABASE farmacia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmacia_db;

-- ---------- Tablas ----------
CREATE TABLE categorias (
    id     INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE medicamentos (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(120)  NOT NULL,
    descripcion       VARCHAR(255),
    precio            DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock             INT           NOT NULL DEFAULT 0 CHECK (stock >= 0),
    fecha_vencimiento DATE          NOT NULL,
    categoria_id      INT           NOT NULL,
    CONSTRAINT fk_medicamento_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE empleados (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(80)  NOT NULL,
    apellido VARCHAR(80)  NOT NULL,
    dni      VARCHAR(15)  NOT NULL UNIQUE,
    email    VARCHAR(120) NOT NULL,
    cargo    VARCHAR(80)  NOT NULL
);

-- ---------- Datos iniciales ----------
INSERT INTO categorias (nombre) VALUES
    ('Analgésicos'),
    ('Antibióticos'),
    ('Antiinflamatorios'),
    ('Vitaminas y suplementos'),
    ('Antialérgicos');

INSERT INTO medicamentos (nombre, descripcion, precio, stock, fecha_vencimiento, categoria_id) VALUES
    ('Paracetamol 500 mg',   'Caja x 16 comprimidos',        1850.00, 120, '2027-08-31', 1),
    ('Ibuprofeno 400 mg',    'Caja x 20 comprimidos',        2600.50,  85, '2027-05-15', 3),
    ('Amoxicilina 500 mg',   'Caja x 21 cápsulas',           6300.00,  40, '2027-01-20', 2),
    ('Azitromicina 500 mg',  'Caja x 3 comprimidos',         7450.00,  30, '2027-03-10', 2),
    ('Diclofenac 50 mg',     'Caja x 20 comprimidos',        3100.00,  60, '2027-11-30', 3),
    ('Vitamina C 1 g',       'Tubo x 10 efervescentes',      2900.00, 150, '2028-02-28', 4),
    ('Complejo B',           'Frasco x 60 comprimidos',      5200.00,  45, '2028-06-30', 4),
    ('Loratadina 10 mg',     'Caja x 10 comprimidos',        2200.00,  70, '2027-09-30', 5),
    ('Cetirizina 10 mg',     'Caja x 10 comprimidos',        2450.00,  55, '2027-10-31', 5),
    ('Aspirina 100 mg',      'Caja x 30 comprimidos',        3800.00,  95, '2028-01-31', 1);

INSERT INTO empleados (nombre, apellido, dni, email, cargo) VALUES
    ('Laura',   'Fernández', '30123456', 'laura.fernandez@farmacia.com', 'Farmacéutica'),
    ('Martín',  'Gómez',     '32456789', 'martin.gomez@farmacia.com',    'Cajero'),
    ('Sofía',   'Herrera',   '35111222', 'sofia.herrera@farmacia.com',   'Auxiliar de farmacia'),
    ('Diego',   'Ramírez',   '28999888', 'diego.ramirez@farmacia.com',   'Encargado'),
    ('Carolina','Suárez',    '36777123', 'carolina.suarez@farmacia.com', 'Repositora');
