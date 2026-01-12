
import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'n0m3l0',
    database: process.env.DB_NAME || 'tienda_api',
        /*
    CREATE DATABASE tienda_api;
    USE tienda_api;

    CREATE TABLE usuario (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        direccion TEXT,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE producto (
        id_producto INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        imagen_url VARCHAR(255)
    );

    CREATE TABLE carrito (
        id_carrito INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT DEFAULT 1,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE
    );

    CREATE TABLE venta (
        id_venta INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    );

    CREATE TABLE detalle_venta (
        id_detalle INT AUTO_INCREMENT PRIMARY KEY,
        id_venta INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
    );
    */
});

db.getConnection()
    .then(connection => {
        console.log('Conexión exitosa a la base de datos MySQL');
        connection.release(); 
    })
    .catch(err => {
        console.error('Error de conexión a la base de datos:', err.message);
    });

export default db;