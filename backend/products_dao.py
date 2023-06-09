
from sql_connection import get_sql_connection



def get_all_products(connection):
    cursor = connection.cursor()
    query = ("select products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name "
            "from products inner join uom on products.uom_id=uom.uom_id")
    cursor.execute(query)
    response =[]
    for (product_id, name, uom_id, price_per_unit,uom_name) in cursor:
        response.append(
            {
                'product_id':product_id,
                'name':name,
                'uom_id':uom_id,
                'price_per_unit':price_per_unit,
                'uom_name': uom_name

            }
        )
        #print(product_id, name, uom_id, price_per_unit,uom_name)
    cursor.close()
    return response

#Inserts new Product
def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = ("INSERT INTO products "
             "(name,uom_id,price_per_unit) "
             "values (%s, %s,%s)")
    data = (product['product_name'],product['uom_id'],product['price_per_unit'])
    cursor.execute(query,data)
    connection.commit()
    cursor.close()
    return cursor.lastrowid

#Edit Product 
def edit_product(connection,product):
    cursor = connection.cursor()
    query = ("UPDATE products "
             "SET name=%s, uom_id=%s, price_per_unit=%s "
             "WHERE product_id=%s")
    data = (product['product_name'], product['uom_id'], product['price_per_unit'], product['product_id'])

    cursor.execute(query, data)
    connection.commit()
    cursor.close()
    return product['product_id']


#delete product
def delete_product(connection,product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM products where product_id="+str(product_id))
    cursor.execute(query)
    connection.commit()
    cursor.close()
    return cursor.lastrowid

def get_curr_product(connection, id):
    cursor = connection.cursor()
    query = ("SELECT products.product_id, products.name,products.uom_id, products.price_per_unit, uom.uom_name "
            "from products inner join uom on products.uom_id=uom.uom_id " 
            "WHERE products.product_id = %s")
    
    cursor.execute(query, [id])
    result = cursor.fetchone()

    if result:
        response = {
            'product_id': result[0],
            'product_name': result[1],
            'uom_id': result[2],
            'price_per_unit': result[3],
            'uom_name': result[4]
        }
    else:
        response = None

    cursor.close()
    return response

if __name__=="__main__":
    connection = get_sql_connection()
    """
    print(get_all_products(connection))
    
    Test query to Test insertion of new product
    print(insert_new_product(connection,{
        'product_name':'potatoes',
        'uom_id':'1',
        'price_per_unit':'10'
    }))


    
    #print(delete_product(connection,12))
    
    
    print(edit_product(connection, {
        'product_id': 1,
        'product_name': 'Rice',
        'uom_id': '1',
        'price_per_unit': '35'
    }))

    #print(get_curr_product(connection,1))
    print(edit_product(connection, {
        'product_id': 1,
        'product_name': 'Rice2',
        'uom_id': '1',
        'price_per_unit': '35'
    }))
    """