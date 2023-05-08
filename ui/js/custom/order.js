var productPrices = {};

$(function(){
    //Json data by api call for order table 
    $.get(productListApiUrl,function(response){
        productPrices = {}
        if(response ){
            var options = '<option value="">--Select--</option>';
            $.each(response,function(index,product){
                options+='<option value="'+product.product_id+'">'+product.name+'</option>';
                productPrices[product.product_id] = product.price_per_unit;
            });
            $(".product-box").find("select").empty().html(options);
        }
    });
});
//Addes new row with default values 
$("#addMoreButton").click(function (){
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().val('0.0');
    
});

$(document).on("click", ".remove-row",function(){
    $(this).closest('.row').remove();
    calculateGrandTotal();
});
//When a new product is added it calulates its initial total value based on it price per unit 
$(document).on("change",".cart-product",function (){
    var product_id = $(this).val();
    var price = productPrices[product_id];
    $(this).closest('.row').find('#product_price').val(price);
    calculateItemValue(this);
});

// Calculates the total on item level when qty is changed 
$(document).on("change", ".product-qty", function (e){
    calculateItemValue(this);
});

//On change in the item level calculate the grand total again 
$(document).on('change', '.product-item', function(e) {
    // update the product grand total field
    calculateGrandTotal();
});


//Calculate the toal on item level again 
//Method : 1 
//$(document).on('change', '.product-price', function(e){
//    calculateItemValue(this);
//});


//Method : 2
//Calculate the toal on item level again 
$(document).on('change', '.product-price', function(e){
    // Get the quantity and price values
    var parentRow = $(this).closest('.product-item');
    var quantity = parseFloat(parentRow.find(".product-qty").val());
    var price = parseFloat($(this).val());
    // Check if the Price is Not a number 
    if (isNaN(price)) {
        price = 0;
    }
    // Calculate the total
    var total = quantity * price;
  
    // Set the total value
    parentRow.find(".product-total").val(total.toFixed(2));
});

//Save order is called when we click on save order 
$("#saveOrder").on("click", function(e){
    var customerNameField = $('#customerName');
    if (customerNameField.val() === '') {
        e.preventDefault();
        customerNameField.attr('required', true);
        alert("Customer name required");
        return false;
    }
    var formData = $("form").serializeArray();
    var requestPayload = {
        customer_name: null,
        total: null,
        order_details: []
    };
    var hasError = false;
    var orderDetails = [];
    for(var i=0;i<formData.length;++i) {
        var element = formData[i];
        var lastElement = null;

        switch(element.name) {
            case 'customerName':
                requestPayload.customer_name = element.value;
                break;
            case 'product_grand_total':
                requestPayload.grand_total = element.value;
                break;
            case 'product':
                if(element.value === '') {
                    hasError = true;
                    var row_number =Math.floor(i/3) + 1;
                    alert("Please select a product in row " +row_number);
                    return false;
                }
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });                
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.quantity = element.value
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.total_price = element.value
                break;
        }
    if(hasError) {
        return false;
    }

    }
    callApi("POST",orderSaveApiUrl,{
        'data':JSON.stringify(requestPayload)
    });
});