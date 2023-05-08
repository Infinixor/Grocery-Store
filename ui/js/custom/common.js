//Define your API here
var productListApiUrl = 'http://127.0.0.1:5000/getproducts';
var uomListApiUrl = 'http://127.0.0.1:5000/getUom';
var productSaveApiUrl = 'http://127.0.0.1:5000/insertProduct';
var productDeleteApiUrl = 'http://127.0.0.1:5000/deleteProduct';
var orderListApiUrl = 'http://127.0.0.1:5000/getAllOrders';
var orderSaveApiUrl = 'http://127.0.0.1:5000/insertOrder';
var getCurrentProductApiurl = 'http://127.0.0.1:5000/getCurrentProduct';
var updateProductApiUrl = 'http://127.0.0.1:5000/updateProduct';
// For Product drop in order

var productsApiUrl = 'http://127.0.0.1:5000/products';

function callApi(method,url,data){
    $.ajax({
        method:method,
        url:url ,
        data: data
    }).done(function( msg ) {
        window.location.reload();
    });
}


// Calculates the Grand Total based on change in the total in item level
function calculateGrandTotal() {
    var grandTotal = 0;
    $(".product-item").each(function(index) {
        var itemTotal = parseFloat($(this).find('#item_total').val()||0);
        if (!isNaN(itemTotal)) { // Check if itemTotal is a valid number
            grandTotal += itemTotal;
        }
    });
    $("#product_grand_total").val(grandTotal.toFixed(2));
};

function calculateItemValue(currentRow){
    var qty = $(currentRow).closest('.product-item').find('.product-qty').val();
    var price = parseFloat($(currentRow).closest('.product-item').find('#product_price').val());
    //console.log("qty:", qty);
    //console.log("price:", price);
    if (isNaN(price)) {
        price = 0;
    }
    total_price = price*qty;
    $(currentRow).closest('.product-item').find('#item_total').val(total_price.toFixed(2));
    $(currentRow).closest('.product-item').find('#item_total').attr('data-prev-total', total_price.toFixed(2));
};

function orderParser(order) {
    return{
        id : order.id,
        date : order.employee_name,
        orderNo : order.employee_name,
        custmerName : order.employee_name,
        cost : parseInt(order.employee_salary)
    }
}

function productParser(product){
    return {
        id : product.id,
        name : product.employee_name,
        unit : product.employee_name,
        price : product.employee_name
    }
}

function productDropParser(product){
    return {
        id : product.id,
        name : product.title
    }
}


//To enable bootstrap tooltip globally 
// $(function(){
//    $('[data-toggle="tooltip"]').tooltip()
//});