import sqlite3
import os

# Crear la carpeta 'database' si no existe
os.makedirs('database', exist_ok=True)

# Conectar a la base de datos (se creará si no existe)
conn = sqlite3.connect('database/flights.db')
cursor = conn.cursor()

try:
    # Crear tabla de aerolíneas
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS aerolineas (
        id_aerolinea INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_aerolinea TEXT NOT NULL
    );
    ''')

    # Crear tabla de aeropuertos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS aeropuertos (
        id_aeropuerto INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_aeropuerto TEXT NOT NULL
    );
    ''')

    # Crear tabla de movimientos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS movimientos (
        id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
        descripcion TEXT NOT NULL
    );
    ''')

    # Crear tabla de vuelos
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vuelos (
        id_vuelo INTEGER PRIMARY KEY AUTOINCREMENT,
        id_aerolinea INTEGER,
        id_aeropuerto INTEGER,
        id_movimiento INTEGER,
        dia TEXT NOT NULL,
        FOREIGN KEY (id_aerolinea) REFERENCES aerolineas(id_aerolinea),
        FOREIGN KEY (id_aeropuerto) REFERENCES aeropuertos(id_aeropuerto),
        FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento)
    );
    ''')

    # Verificar si ya hay datos en las tablas
    cursor.execute("SELECT COUNT(*) FROM aerolineas")
    if cursor.fetchone()[0] == 0:
        # Insertar datos de prueba en la tabla de aerolíneas
        cursor.execute("INSERT INTO aerolineas (nombre_aerolinea) VALUES ('Volaris')")
        cursor.execute("INSERT INTO aerolineas (nombre_aerolinea) VALUES ('Aeromar')")
        cursor.execute("INSERT INTO aerolineas (nombre_aerolinea) VALUES ('Interjet')")
        cursor.execute("INSERT INTO aerolineas (nombre_aerolinea) VALUES ('Aeromexico')")

        # Insertar datos de prueba en la tabla de aeropuertos
        cursor.execute("INSERT INTO aeropuertos (nombre_aeropuerto) VALUES ('Benito Juarez')")
        cursor.execute("INSERT INTO aeropuertos (nombre_aeropuerto) VALUES ('Guanajuato')")
        cursor.execute("INSERT INTO aeropuertos (nombre_aeropuerto) VALUES ('La Paz')")
        cursor.execute("INSERT INTO aeropuertos (nombre_aeropuerto) VALUES ('Oaxaca')")

        # Insertar datos de prueba en la tabla de movimientos
        cursor.execute("INSERT INTO movimientos (descripcion) VALUES ('Salida')")
        cursor.execute("INSERT INTO movimientos (descripcion) VALUES ('Llegada')")

        # Insertar datos de prueba en la tabla de vuelos
        vuelos_data = [
            (1, 1, 1, '2021-05-02'),
            (2, 1, 1, '2021-05-02'),
            (3, 2, 2, '2021-05-02'),
            (4, 3, 2, '2021-05-02'),
            (1, 3, 2, '2021-05-02'),
            (2, 1, 1, '2021-05-02'),
            (2, 3, 1, '2021-05-04'),
            (3, 4, 1, '2021-05-04'),
            (3, 4, 1, '2021-05-04'),
        ]
        cursor.executemany('''
        INSERT INTO vuelos (id_aerolinea, id_aeropuerto, id_movimiento, dia)
        VALUES (?, ?, ?, ?)
        ''', vuelos_data)

    # Guardar cambios
    conn.commit()
    print("Base de datos creada y poblada con datos de prueba.")

except sqlite3.Error as e:
    print(f"Error al crear la base de datos: {e}")

finally:
    # Cerrar la conexión
    conn.close()