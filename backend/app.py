from flask import Flask, jsonify
from flask_cors import CORS  # Importa CORS
import requests
import sqlite3

# Crear la aplicación Flask
app = Flask(__name__)


# Configurar CORS para permitir solicitudes desde http://localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Función para obtener datos de StackExchange
def get_stackexchange_data():
    url = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=perl&site=stackoverflow"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lanza una excepción si la solicitud no fue exitosa
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener datos de StackExchange: {e}")
        return None

# Función para procesar datos de StackExchange
def process_data(data):
    if not data or 'items' not in data:
        return None

    items = data['items']
    
    # 1. Obtener el número de respuestas contestadas y no contestadas
    answered = sum(1 for item in items if item['is_answered'])
    unanswered = len(items) - answered
    
    # 2. Obtener la respuesta con mayor reputación
    items_with_reputation = [item for item in items if 'owner' in item and 'reputation' in item['owner']]
    max_reputation = max(items_with_reputation, key=lambda x: x['owner']['reputation']) if items_with_reputation else None
    
    # 3. Obtener la respuesta con menor número de vistas
    min_views = min(items, key=lambda x: x['view_count']) if items else None
    
    # 4. Obtener la respuesta más vieja y más actual
    oldest = min(items, key=lambda x: x['creation_date']) if items else None
    newest = max(items, key=lambda x: x['creation_date']) if items else None
    
    # 5. Imprimir en consola del punto 2 al 5
    print("Respuesta con mayor reputación:", max_reputation)
    print("Respuesta con menor número de vistas:", min_views)
    print("Respuesta más vieja:", oldest)
    print("Respuesta más actual:", newest)
    
    return {
        'answered': answered,
        'unanswered': unanswered,
        'max_reputation': max_reputation,
        'min_views': min_views,
        'oldest': oldest,
        'newest': newest
    }

# Función para conectar a la base de datos SQLite
def get_db_connection():
    try:
        conn = sqlite3.connect('database/flights.db')
        conn.row_factory = sqlite3.Row 
        return conn
    except sqlite3.Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

# Ruta para obtener datos de StackExchange
@app.route('/stackexchange', methods=['GET'])
def stackexchange():
    data = get_stackexchange_data()
    if not data:
        return jsonify({"error": "No se pudieron obtener los datos de StackExchange"}), 500
    processed_data = process_data(data)
    return jsonify(processed_data)


# Ruta para obtener el aeropuerto con mayor movimiento
@app.route('/aeropuerto_mayor_movimiento', methods=['GET'])
def aeropuerto_mayor_movimiento():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT a.nombre_aeropuerto, COUNT(*) as movimientos
            FROM vuelos v
            JOIN aeropuertos a ON v.id_aeropuerto = a.id_aeropuerto
            GROUP BY v.id_aeropuerto
            ORDER BY movimientos DESC
            LIMIT 1
        ''')
        result = cursor.fetchone()
        return jsonify(dict(result)) 
    except sqlite3.Error as e:
        print(f"Error al ejecutar la consulta: {e}")
        return jsonify({"error": "Error en la base de datos"}), 500
    finally:
        conn.close()

# Ruta para obtener la aerolínea con mayor número de vuelos
@app.route('/aerolinea_mayor_vuelos', methods=['GET'])
def aerolinea_mayor_vuelos():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT al.nombre_aerolinea, COUNT(*) as vuelos
            FROM vuelos v
            JOIN aerolineas al ON v.id_aerolinea = al.id_aerolinea
            GROUP BY v.id_aerolinea
            ORDER BY vuelos DESC
            LIMIT 1
        ''')
        result = cursor.fetchone()
        return jsonify(dict(result))
    except sqlite3.Error as e:
        print(f"Error al ejecutar la consulta: {e}")
        return jsonify({"error": "Error en la base de datos"}), 500
    finally:
        conn.close()

# Ruta para obtener el día con mayor número de vuelos
@app.route('/dia_mayor_vuelos', methods=['GET'])
def dia_mayor_vuelos():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT dia, COUNT(*) as vuelos
            FROM vuelos
            GROUP BY dia
            ORDER BY vuelos DESC
            LIMIT 1
        ''')
        result = cursor.fetchone()
        return jsonify(dict(result))
    except sqlite3.Error as e:
        print(f"Error al ejecutar la consulta: {e}")
        return jsonify({"error": "Error en la base de datos"}), 500
    finally:
        conn.close()

# Ruta para obtener aerolíneas con más de 2 vuelos por día
@app.route('/aerolineas_mas_de_dos_vuelos', methods=['GET'])
def aerolineas_mas_de_dos_vuelos():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT al.nombre_aerolinea, COUNT(*) as vuelos
            FROM vuelos v
            JOIN aerolineas al ON v.id_aerolinea = al.id_aerolinea
            GROUP BY v.id_aerolinea, v.dia
            HAVING vuelos > 2
        ''')
        results = cursor.fetchall()
        return jsonify([dict(row) for row in results])
    except sqlite3.Error as e:
        print(f"Error al ejecutar la consulta: {e}")
        return jsonify({"error": "Error en la base de datos"}), 500
    finally:
        conn.close()

@app.route('/test_db', methods=['GET'])
def test_db():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM aerolineas")
        results = cursor.fetchall()
        return jsonify([dict(row) for row in results])
    except sqlite3.Error as e:
        print(f"Error al ejecutar la consulta: {e}")
        return jsonify({"error": "Error en la base de datos"}), 500
    finally:
        conn.close()
        

# Ruta principal
@app.route('/')
def home():
    return "¡Bienvenido al backend de Casa Mecate!"

# Iniciar la aplicación Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)