from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# EN UN ENTORNO DE PRODUCCION REAL SE INDICAN 
# ESPEFICICAMENTE A QUE DOMINIOS LES VAMOS A 
# PERMITIR CONSULTAR NUESTRA API

# Configura tu conexión
conn = mysql.connector.connect(
    host="127.0.0.1",      # o localhost
    user="root",           # tu usuario MySQL
    password="Manchester16!",  # tu contraseña MySQL
    database="inventario"  # tu base de datos creada
)

#Para crear productos
@app.route('/api/productos', methods=['POST'])
def crear_producto():
    data = request.get_json()

    nombre = data.get("nombre")
    cantidad = data.get("cantidad")
    precio = data.get("precio")
    fecha_vencimiento = data.get("fecha_vencimiento")

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO productos (prod_nombre, prod_cantidad, prod_precio, prod_fecha_vencimiento)
            VALUES (%s, %s, %s, %s)
        """, (nombre, cantidad, precio, fecha_vencimiento))
        conn.commit()

    return jsonify({"mensaje": "Producto creado"}), 201

#para ver los productos
@app.route('/api/productos', methods=['GET'])
def get_productos():
    cursor = conn.cursor()
    cursor.execute("SELECT id, prod_nombre, prod_cantidad, prod_precio, prod_fecha_vencimiento FROM productos")
    rows = cursor.fetchall()
    cursor.close()  # <-- cerrar cursor

    productos = []
    for row in rows:
        productos.append({
            "id": row[0],
            "nombre": row[1],
            "cantidad": row[2],
            "precio": float(row[3]),
            "fecha_vencimiento": str(row[4])
        })

    return jsonify(productos)

#para editar los productos
@app.route('/api/productos/<int:id>', methods=['PUT'])
def editar_producto(id):
    data = request.get_json()

    nombre = data.get("nombre")
    cantidad = data.get("cantidad")
    precio = data.get("precio")
    fecha_vencimiento = data.get("fecha_vencimiento")

    with conn.cursor() as cursor:
        cursor.execute("""
            UPDATE productos
            SET prod_nombre=%s, prod_cantidad=%s, prod_precio=%s, prod_fecha_vencimiento=%s
            WHERE id=%s
        """, (nombre, cantidad, precio, fecha_vencimiento, id))
        conn.commit()

    return jsonify({"mensaje": "Producto actualizado"})


#para borrar productos
@app.route('/api/productos/<int:id>', methods=['DELETE'])
def borrar_producto(id):
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM productos WHERE id=%s", (id,))
        conn.commit()

    return jsonify({"mensaje": "Producto eliminado"})


if __name__ == '__main__':
    app.run(debug=True) # Enable debug mode for development 