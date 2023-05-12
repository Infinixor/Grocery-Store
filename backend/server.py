
import json
from flask import Flask, request, jsonify
import products_dao
import uom_dao ,orders_dao
from products_dao import get_all_products
from sql_connection import get_sql_connection

app = Flask(__name__)
connection = get_sql_connection()
@app.route('/', methods=['GET'])
def hello():
    return "Hi How are you "

@app.route('/getproducts',methods=['GET'])
def get_products():
    products = products_dao.get_all_products(connection)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/getAllOrders', methods = ['GET'])
def get_all_orders():
    orders = orders_dao.get_all_orders(connection)
    response = jsonify(orders)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/getUom',methods=['GET'])
def get_uom():
    response = uom_dao.get_uoms(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response


@app.route('/deleteProduct',methods=['POST'])
def delete_product():
    return_id = products_dao.delete_product(connection,request.form['product_id'])
    response = jsonify({
        'product_id': return_id
    })
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/insertProduct',methods=['POST'])
def insert_product():
    #Converts the data from from back to dictionary 
    request_payload = json.loads(request.form['data'])
    product_id = products_dao.insert_new_product(connection,request_payload)
    response = jsonify({
        'product_id': product_id
    })
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/getCurrentProduct/<string:id>',methods=['GET'])
def get_curr_product(id):
    response = products_dao.get_curr_product(connection,id)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/updateProduct/<string:id>',methods=['POST'])
def edit_product(id):    
    request_payload = json.loads(request.form['data'])
    response = products_dao.edit_product(connection,request_payload)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = json.loads(request.form['data'])
    order_id = orders_dao.insert_order(connection, request_payload)
    response = jsonify({
        'order_id': order_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(port=5000)