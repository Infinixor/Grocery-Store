import mysql.connector
__cnx = None

def get_sql_connection():
    print("Establishing SQL Connection")
    global __cnx
    if __cnx is None:
        __cnx = mysql.connector.connect(user='root', password='nimda',
                                host='127.0.0.1',
                                database='grocery_store')
    return __cnx

