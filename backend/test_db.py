import mysql.connector
from mysql.connector import Error

# Copia aquí la misma configuración que tienes en tu app.py
db_config = {
    'host': '127.0.0.1',
    'user': 'sistem',
    'password': '@Killer23..1', # Asegúrate que esta es la contraseña que quieres probar
    'database': 'logindash',
    'port': 3307,
}

def test_connection():
    """Intenta conectar a la base de datos y reporta el resultado."""
    print("--- Intentando conectar a MySQL ---")
    print(f"Host: {db_config['host']}")
    print(f"Puerto: {db_config['port']}")
    print(f"Usuario: {db_config['user']}")
    print(f"Base de datos: {db_config['database']}")
    
    try:
        # Intenta establecer la conexión
        conn = mysql.connector.connect(**db_config)
        
        if conn.is_connected():
            print("\n¡ÉXITO! La conexión a la base de datos MySQL fue exitosa.")
            conn.close()
            print("Conexión cerrada.")
        else:
            print("\nFALLO: Se estableció una conexión pero está inactiva.")

    except Error as e:
        # Si hay un error, imprímelo
        print(f"\n¡FALLO! No se pudo conectar a la base de datos.")
        print(f"Error de MySQL: {e}")

if __name__ == '__main__':
    test_connection()
