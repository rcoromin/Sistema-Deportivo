from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import bcrypt
import os
from functools import wraps


# ...código existente...

# Inicialización de la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilita CORS para permitir peticiones desde el frontend (React)

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Aquí se asume que el frontend envía el id_usuario y se consulta el tipo
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return jsonify({'error': 'No autenticado'}), 401
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT nombre_tipo FROM usuario u JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario WHERE u.id_usuario = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if not user or user['nombre_tipo'] != 'administrador':
            return jsonify({'error': 'No autorizado'}), 403
        return f(*args, **kwargs)
    return decorated

# --- Endpoints REST para gestión de usuarios ---
@app.route('/usuarios', methods=['GET'])
@require_admin
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT u.*, t.nombre_tipo FROM usuario u JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario")
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(usuarios), 200

@app.route('/usuarios', methods=['POST'])
@require_admin
def crear_usuario():
    data = request.get_json()
    nombre_usuario = data['nombre_usuario']
    correo = data['correo']
    contraseña = data['contraseña'].encode('utf-8')
    nombre_empresa = data.get('nombre_empresa')
    id_tipo_usuario = data.get('id_tipo_usuario', 2)
    activo = data.get('activo', 1)
    hashed_contraseña = bcrypt.hashpw(contraseña, bcrypt.gensalt())
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO usuario (nombre_usuario, correo, contraseña, esta_confirmado, nombre_empresa, id_tipo_usuario, activo) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (nombre_usuario, correo, hashed_contraseña, 1, nombre_empresa, id_tipo_usuario, activo)
        )
        conn.commit()
        return jsonify({'message': 'Usuario creado'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/usuarios/<int:id_usuario>', methods=['PUT'])
@require_admin
def actualizar_usuario(id_usuario):
    data = request.get_json()
    campos = []
    valores = []
    for campo in ['nombre_usuario', 'correo', 'nombre_empresa', 'id_tipo_usuario', 'activo']:
        if campo in data:
            campos.append(f"{campo} = %s")
            valores.append(data[campo])
    if not campos:
        return jsonify({'error': 'Nada para actualizar'}), 400
    valores.append(id_usuario)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"UPDATE usuario SET {', '.join(campos)} WHERE id_usuario = %s", valores)
        conn.commit()
        return jsonify({'message': 'Usuario actualizado'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# Nuevo endpoint para cambiar solo la contraseña
@app.route('/usuarios/<int:id_usuario>/password', methods=['PATCH'])
@require_admin
def actualizar_contraseña(id_usuario):
    data = request.get_json()
    nueva_contraseña = data.get('contraseña')
    if not nueva_contraseña:
        return jsonify({'error': 'La contraseña no puede estar vacía'}), 400
    hashed_contraseña = bcrypt.hashpw(nueva_contraseña.encode('utf-8'), bcrypt.gensalt())
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Fallo en la conexión a la base de datos'}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE usuario SET contraseña = %s WHERE id_usuario = %s", (hashed_contraseña, id_usuario))
        conn.commit()
        return jsonify({'message': 'Contraseña actualizada correctamente'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/usuarios/<int:id_usuario>/estado', methods=['PATCH'])
@require_admin
def cambiar_estado_usuario(id_usuario):
    data = request.get_json()
    activo = data.get('activo')
    # Convertir a int si viene como string o boolean
    try:
        activo_int = int(activo)
    except (ValueError, TypeError):
        return jsonify({'error': 'Valor de estado inválido'}), 400
    if activo_int not in [0, 1]:
        return jsonify({'error': 'Valor de estado inválido'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE usuario SET esta_confirmado = %s WHERE id_usuario = %s", (activo_int, id_usuario))
        conn.commit()
        return jsonify({'message': 'Estado actualizado'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        conn.close()
## --- ELIMINADO: Duplicado de importaciones y doble inicialización de app ---

# --- Librerías para envío de correo y tokens ---
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer


# --- Cargar variables de entorno desde .env si está disponible ---
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# --- Configuración de Flask-Mail usando variables de entorno ---
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')
mail = Mail(app)

# --- Configuración de itsdangerous para tokens seguros ---
serializer = URLSafeTimedSerializer(os.environ.get('SECRET_KEY', 'CLAVE_SECRETA_CAMBIALA'))


# Configuración de la base de datos MySQL desde variables de entorno
db_config = {
    'host': os.environ.get('DB_HOST', '127.0.0.1'),
    'user': os.environ.get('DB_USER', 'sistem'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'logindash'),
    'port': int(os.environ.get('DB_PORT', 3307)),
}

# Función para obtener una conexión a la base de datos
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        print("[DB] Conexión a MySQL establecida exitosamente.")
        return conn
    except mysql.connector.Error as err:
        print(f"[DB] ERROR al conectar con MySQL: {err}")
        return None

# Ruta para registrar un nuevo usuario
@app.route('/register', methods=['POST'])
def register():
    # Obtener los datos enviados en formato JSON
    data = request.get_json()
    nombre_usuario = data['nombre_usuario']
    correo = data['correo']
    contraseña = data['contraseña'].encode('utf-8')  # Codificar la contraseña a bytes
    nombre_empresa = data.get('nombre_empresa')  # Puede venir como None si no lo envía el frontend
    # Si no se especifica, asignar tipo usuario por defecto (2)
    id_tipo_usuario = data.get('id_tipo_usuario', 2)

    # Hashear la contraseña usando bcrypt
    hashed_contraseña = bcrypt.hashpw(contraseña, bcrypt.gensalt())
    # Insertar el nuevo usuario en la base de datos (agrega campo esta_confirmado y nombre_empresa)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO usuario (nombre_usuario, correo, contraseña, esta_confirmado, nombre_empresa, id_tipo_usuario) VALUES (%s, %s, %s, %s, %s, %s)",
            (nombre_usuario, correo, hashed_contraseña, 0, nombre_empresa, id_tipo_usuario)
        )
        conn.commit()
        id_usuario = cursor.lastrowid
        # Generar token de confirmación
        token = serializer.dumps(correo, salt='email-confirm')
        confirm_url = f"http://127.0.0.1:5173/confirmar/{token}"
        print(f"[MAIL] Enviando correo de confirmación a: {correo}")
        print(f"[MAIL] Enlace de confirmación: {confirm_url}")
        # Enviar correo
        try:
            msg = Message('Confirma tu cuenta', recipients=[correo])
            msg.body = f'Hola {nombre_usuario}, haz clic en el siguiente enlace para confirmar tu cuenta: {confirm_url}'
            mail.send(msg)
            print("[MAIL] Correo enviado correctamente.")
        except Exception as e:
            print(f"[MAIL] Error al enviar correo: {e}")
        return jsonify({'message': 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    # Obtener los datos enviados en formato JSON
    data = request.get_json()
    correo = data['correo']
    contraseña = data['contraseña'].encode('utf-8')  # Codificar la contraseña a bytes
    print(f"[LOGIN] Intentando login para correo: {correo}")
    # Buscar el usuario en la base de datos por correo
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT u.*, t.nombre_tipo FROM usuario u JOIN tipo_usuario t ON u.id_tipo_usuario = t.id_tipo_usuario WHERE u.correo = %s", (correo,))
        usuario = cursor.fetchone()
        print(f"[LOGIN] Usuario encontrado: {usuario}")
        # Verificar si el usuario existe, está confirmado y la contraseña es correcta
        if usuario:
            if not usuario.get('esta_confirmado', 0):
                print(f"[LOGIN] Usuario no confirmado: {correo}")
                return jsonify({'error': 'Debes confirmar tu correo antes de iniciar sesión.'}), 401
            try:
                password_match = bcrypt.checkpw(contraseña, usuario['contraseña'].encode('utf-8'))
            except Exception as e:
                print(f"[LOGIN] Error al comparar contraseñas: {e}")
                password_match = False
            print(f"[LOGIN] Password match: {password_match}")
            if password_match:
                del usuario['contraseña']
                print(f"[LOGIN] Login exitoso para {correo}")
                return jsonify(usuario), 200
            else:
                print(f"[LOGIN] Contraseña incorrecta para {correo}")
                return jsonify({'error': 'Credenciales inválidas'}), 401
        else:
            print(f"[LOGIN] Usuario no encontrado para {correo}")
            response = jsonify({'error': f'Usuario no registrado para {correo}'})
            response.status_code = 401
            response.headers['Content-Type'] = 'application/json'
            return response
    except mysql.connector.Error as err:
        print(f"[LOGIN] Error de base de datos: {err}")
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# Ruta para confirmar el correo
@app.route('/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        correo = serializer.loads(token, salt='email-confirm', max_age=3600)  # 1 hora de validez
    except Exception as e:
        return jsonify({'error': 'El enlace de confirmación no es válido o ha expirado.'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE usuario SET esta_confirmado = 1 WHERE correo = %s", (correo,))
        conn.commit()
        return jsonify({'message': '¡Correo confirmado! Ya puedes iniciar sesión.'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/configuration', methods=['GET'])
def get_configuration():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Fallo en la conexión a la base de datos'}), 500
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT clave_configuracion, valor_configuracion FROM configuracion")
        config = cursor.fetchall()
        # Renombrar claves para que coincidan con el frontend (opcional pero buena práctica)
        renamed_config = [{'clave': row['clave_configuracion'], 'valor': row['valor_configuracion']} for row in config]
        return jsonify(renamed_config), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# Punto de entrada principal de la aplicación
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Ejecuta la app en modo debug en el puerto 5000

# Datos de ejemplo para pruebas (NO INCLUIR EN PRODUCCIÓN)
# {
#   "username": "corominas",
#   "email": "rcoromin@hotmail.com",
#   "password": "tu_clave",
#   "company_name": "Nombre de la empresa"
# }

