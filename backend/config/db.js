
import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({ 
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Luis2008',
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

INSERT INTO producto (nombre, descripcion, precio, stock, imagen_url) VALUES
-- Destacado
('War Thunder', 'MMO de combate militar gratuito con aviones, tanques y barcos.', 0.00, 999, 'https://via.placeholder.com/250x200?text=War+Thunder'),

-- RPG y Acción
('Elden Ring', 'Explora las Tierras Intermedias en este épico RPG de acción.', 1299.00, 45, 'https://via.placeholder.com/250x200?text=Elden+Ring'),
('The Witcher 3', 'La caza de monstruos definitiva en un mundo abierto masivo.', 599.00, 30, 'https://via.placeholder.com/250x200?text=The+Witcher+3'),
('Cyberpunk 2077', 'Conviértete en un mercenario urbano en la ciudad del futuro.', 749.00, 50, 'https://via.placeholder.com/250x200?text=Cyberpunk+2077'),
('Baldur''s Gate 3', 'Una aventura sin precedentes basada en el universo de D&D.', 1299.00, 25, 'https://via.placeholder.com/250x200?text=Baldurs+Gate+3'),
('God of War Ragnarök', 'Kratos y Atreus enfrentan el fin de la mitología nórdica.', 1499.00, 40, 'https://via.placeholder.com/250x200?text=God+of+War'),
('Final Fantasy VII Rebirth', 'La épica continuación de la historia de Cloud Strife.', 1499.00, 15, 'https://via.placeholder.com/250x200?text=FFVII+Rebirth'),
('Hades II', 'Enfréntate al Titán del Tiempo en este roguelike de acción.', 599.00, 60, 'https://via.placeholder.com/250x200?text=Hades+II'),
('Sekiro: Shadows Die Twice', 'Venganza y honor en el Japón de la era Sengoku.', 1299.00, 20, 'https://via.placeholder.com/250x200?text=Sekiro'),
('Skyrim: Special Edition', 'El RPG de fantasía que definió una generación entera.', 399.00, 100, 'https://via.placeholder.com/250x200?text=Skyrim'),

-- Shooters y Supervivencia
('Call of Duty: MW III', 'Acción frenética en mapas icónicos de la saga.', 1499.00, 80, 'https://via.placeholder.com/250x200?text=COD+MWIII'),
('Helldivers 2', 'Lucha por la democracia galáctica con tus amigos.', 899.00, 55, 'https://via.placeholder.com/250x200?text=Helldivers+2'),
('Resident Evil 4 Remake', 'Sobrevive al horror en este clásico totalmente renovado.', 999.00, 35, 'https://via.placeholder.com/250x200?text=RE4+Remake'),
('Rust', 'Sobrevivencia extrema en un mundo dominado por otros jugadores.', 799.00, 40, 'https://via.placeholder.com/250x200?text=Rust'),
('Escape from Tarkov', 'Shooter táctico realista con mecánicas de extracción.', 949.00, 99, 'https://via.placeholder.com/250x200?text=Tarkov'),
('Destiny 2: Final Shape', 'La conclusión de la saga de Luz y Oscuridad.', 999.00, 150, 'https://via.placeholder.com/250x200?text=Destiny+2'),

-- Deportes y Carreras
('EA SPORTS FC 24', 'La experiencia de fútbol más auténtica del mercado.', 1399.00, 120, 'https://via.placeholder.com/250x200?text=FC24'),
('NBA 2K24', 'Domina la liga de baloncesto más importante del mundo.', 1299.00, 90, 'https://via.placeholder.com/250x200?text=NBA2K24'),
('Forza Horizon 5', 'Conduce por los paisajes más bellos de México.', 1299.00, 50, 'https://via.placeholder.com/250x200?text=Forza+5'),
('Gran Turismo 7', 'El simulador de conducción real definitivo.', 1499.00, 30, 'https://via.placeholder.com/250x200?text=GT7'),
('Rocket League', 'Fútbol con autos propulsados por cohetes.', 0.00, 999, 'https://via.placeholder.com/250x200?text=Rocket+League'),

-- Indie y Creatividad
('Minecraft', 'El límite es tu imaginación en un mundo de bloques.', 549.00, 200, 'https://via.placeholder.com/250x200?text=Minecraft'),
('Stardew Valley', 'Construye la granja de tus sueños y haz amigos.', 299.00, 300, 'https://via.placeholder.com/250x200?text=Stardew+Valley'),
('Terraria', 'Explora, lucha y construye en un mundo 2D infinito.', 199.00, 250, 'https://via.placeholder.com/250x200?text=Terraria'),
('Hollow Knight', 'Una obra maestra metroidvania en un reino olvidado.', 299.00, 100, 'https://via.placeholder.com/250x200?text=Hollow+Knight'),
('Among Us', 'Descubre al impostor antes de que sea demasiado tarde.', 99.00, 500, 'https://via.placeholder.com/250x200?text=Among+Us'),

-- Estrategia y Simulación
('Age of Empires IV', 'Revive la historia con esta entrega de estrategia clásica.', 799.00, 70, 'https://via.placeholder.com/250x200?text=AOE+IV'),
('Civilization VI', 'Construye un imperio que resista el paso del tiempo.', 999.00, 50, 'https://via.placeholder.com/250x200?text=Civ+VI'),
('The Sims 4', 'Crea historias únicas con tus propios personajes.', 0.00, 999, 'https://via.placeholder.com/250x200?text=The+Sims+4'),
('Cities: Skylines II', 'Construye y gestiona la metrópolis más moderna.', 999.00, 45, 'https://via.placeholder.com/250x200?text=Cities+II');


SET SQL_SAFE_UPDATES = 0;

ALTER TABLE producto ADD COLUMN genero VARCHAR(50);

UPDATE producto SET genero = 'Acción/RPG' WHERE nombre IN ('Elden Ring', 'The Witcher 3', 'God of War Ragnarök', 'Sekiro: Shadows Die Twice', 'Hades II', 'Cyberpunk 2077', 'Baldur''s Gate 3', 'Skyrim: Special Edition', 'Final Fantasy VII Rebirth');
UPDATE producto SET genero = 'Shooter' WHERE nombre IN ('War Thunder', 'Call of Duty: MW III', 'Helldivers 2', 'Resident Evil 4 Remake', 'Rust', 'Escape from Tarkov', 'Destiny 2: Final Shape');
UPDATE producto SET genero = 'Deportes' WHERE nombre IN ('EA SPORTS FC 24', 'NBA 2K24', 'Forza Horizon 5', 'Gran Turismo 7', 'Rocket League');
UPDATE producto SET genero = 'Indie/Simulación' WHERE nombre IN ('Minecraft', 'Stardew Valley', 'Terraria', 'Hollow Knight', 'Among Us', 'Age of Empires IV', 'Civilization VI', 'The Sims 4', 'Cities: Skylines II');

SET SQL_SAFE_UPDATES = 1;

ALTER TABLE usuario ADD COLUMN rol VARCHAR(20) DEFAULT 'user';

UPDATE usuario SET rol = 'admin' WHERE id_usuario = 1;
ALTER TABLE producto MODIFY stock INT DEFAULT 0;

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