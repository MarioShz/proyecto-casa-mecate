from flask import Flask, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
import sqlite3  # Importar sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Función para obtener datos de StackExchange
def get_stackexchange_data():
    url = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=perl&site=stackoverflow"
    response = requests.get(url)
    return response.json()

# Función para procesar datos de StackExchange
def process_data(data):
    items = data['items']
    
    # 1. Obtener el número de respuestas contestadas y no contestadas
    answered = sum(1 for item in items if item['is_answered'])
    unanswered = len(items) - answered
    
    # 2. Obtener la respuesta con mayor reputación
    # Filtrar elementos que tienen 'owner' y 'reputation'
    items_with_reputation = [item for item in items if 'owner' in item and 'reputation' in item['owner']]
    if items_with_reputation:
        max_reputation = max(items_with_reputation, key=lambda x: x['owner']['reputation'])
    else:
        max_reputation = None
    
    # 3. Obtener la respuesta con menor número de vistas
    min_views = min(items, key=lambda x: x['view_count'])
    
    # 4. Obtener la respuesta más vieja y más actual
    oldest = min(items, key=lambda x: x['creation_date'])
    newest = max(items, key=lambda x: x['creation_date'])
    
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
    conn = sqlite3.connect('database/flights.db')
    conn.row_factory = sqlite3.Row  # Para que los resultados sean diccionarios
    return conn

# Ruta para obtener datos de StackExchange
@app.route('/stackexchange', methods=['GET'])
def stackexchange():
    data = get_stackexchange_data()
    processed_data = process_data(data)
    return jsonify(processed_data)

# Ruta para obtener el aeropuerto con mayor movimiento
@app.route('/aeropuerto_mayor_movimiento', methods=['GET'])
def aeropuerto_mayor_movimiento():
    conn = get_db_connection()
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
    conn.close()
    return jsonify(dict(result))

# Ruta para obtener la aerolínea con mayor número de vuelos
@app.route('/aerolinea_mayor_vuelos', methods=['GET'])
def aerolinea_mayor_vuelos():
    conn = get_db_connection()
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
    conn.close()
    return jsonify(dict(result))

# Ruta para obtener el día con mayor número de vuelos
@app.route('/dia_mayor_vuelos', methods=['GET'])
def dia_mayor_vuelos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT dia, COUNT(*) as vuelos
        FROM vuelos
        GROUP BY dia
        ORDER BY vuelos DESC
        LIMIT 1
    ''')
    result = cursor.fetchone()
    conn.close()
    return jsonify(dict(result))

# Ruta para obtener aerolíneas con más de 2 vuelos por día
@app.route('/aerolineas_mas_de_dos_vuelos', methods=['GET'])
def aerolineas_mas_de_dos_vuelos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT al.nombre_aerolinea, COUNT(*) as vuelos
        FROM vuelos v
        JOIN aerolineas al ON v.id_aerolinea = al.id_aerolinea
        GROUP BY v.id_aerolinea, v.dia
        HAVING vuelos > 2
    ''')
    results = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in results])

# Iniciar la aplicación Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)