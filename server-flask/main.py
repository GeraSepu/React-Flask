from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# EN UN ENTORNO DE PRODUCCION REAL SE INDICAN 
# ESPEFICICAMENTE A QUE DOMINIOS LES VAMOS A 
# PERMITIR CONSULTAR NUESTRA API

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/users')
def get_users():
    users = [
        {'id': 1, 'name': 'Alice'},
        {'id': 2, 'name': 'Bob'},
        {'id': 3, 'name': 'Charlie'}
    ]
    return {'users': users}


@app.route('/api/fruits')
def get_fruits():
    return {
        'fruits': ['Apple', 'Banana', 'Cherry']
    }

if __name__ == '__main__':
    app.run(debug=True) # Enable debug mode for development 