var productModal = $("#productModal");
var editProductModal = $("#editProductModal")
$(function(){
    //Json data by api call
    $.get(productListApiUrl,function(response){
        if (response){
            var table="";
            $.each(response,function(index,product){
                table+='<tr data-id="'+product.product_id+'" data-name="'+product.name+'" data-unit="'+product.uom_id+'"data-price="'+product.price_per_unit + '">'+
                        '<td>'+product.name +'</td>'+
                        '<td>'+product.uom_name+'</td>'+
                        '<td>'+product.price_per_unit+'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product"> Delete </span>    <span class="btn btn-xs btn-success edit-product data-product-id='+product.product_id+'" onclick="editProduct('+product.product_id+')" > Edit </span></td></tr>';

            });
            $("table").find('tbody').empty().html(table);
        }
    });
});

//Save Product
$("#saveProduct").on("click",function(){
    //If we found id value in form then update product detail
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_name:null,
        uom_id:null,
        price_per_unit:null
    };
    for(var i=0;i<data.length;++i){
        var element =data[i];
        switch(element.name){
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id=element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;

        }
    }
    callApi("POST",productSaveApiUrl,{
        'data':JSON.stringify(requestPayload)
    });
});

function editProduct(productId) {
    // Set the product_id as a data attribute on the modal
    $('#editProductModal').data('product-id', productId);
    
    // Show the modal
    $('#editProductModal').modal('show');
  }

$(document).on("click",".delete-product",function(){
    var tr = $(this).closest('tr');
    var data ={
        product_id : tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" ?");
    if(isDelete){
        callApi("POST",productDeleteApiUrl,data);
    }
});
productModal.on('hide.bs.modal',function(){
    $("#id").val(0);
    $("#name , #unit , #price").val('');
    productModal.find('.modal-title').text('Add New Product');
});

productModal.on('show.bs.modal',function(){
    //Json data by api call 
    $.get(uomListApiUrl,function(response){
        if(response){
            var options = '<option value="">---Select---</option>';
            $.each(response,function(index,uom){
                options+='<option value="'+uom.uom_id+'">'+uom.uom_name+'</option>';
            });
            $("#uoms").empty().html(options);
        }
    });

});

editProductModal.on('hide.bs.modal',function(){
    $("#editId").val('');
    $("#editName , #editUoms , #editPrice").val('');
    editProductModal.find('.modal-title').text('Edit Product');
});

editProductModal.on('show.bs.modal', function(event) {
    // make ajax call to get UOM list
    var productId = $('#editProductModal').data('product-id');
    var apiUrl = getCurrentProductApiurl + '/' + productId;
    alert(apiUrl)
    $.get(apiUrl,function(response){
        if (response){
            $('#editId').val(response.product_id);
            $('#editName').val(response.product_name);
            $('#editPrice').val(response.price_per_unit);
        }
        $.get(uomListApiUrl, function(uomResponse) {
            if (uomResponse) {
                var options = '<option value="">---Select---</option>';
                $.each(uomResponse, function(index, uom) {
                  var selected = (uom.uom_id == response.uom_id) ? 'selected' : '';
                  options += '<option value="' + uom.uom_id + '" ' + selected + '>' + uom.uom_name + '</option>';
                });
                $("#editUoms").empty().html(options);
              }
          });

    })
    
   
  });

//updating the ProductDetails
$("#updateProduct").on("click",function(){
    //If we found id value in form then update product detail
    var productId = $('#editProductModal').data('product-id');
    var data = $("#editProductForm").serializeArray();
    var requestPayload = {
        product_name:null,
        uom_id:null,
        price_per_unit:null,
        product_id:null
    };
    for(var i=0;i<data.length;++i){
        var element = data[i];
        console.log(element)
        switch(element.name){
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id=element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
            case 'id':
                requestPayload.product_id = productId;
                break;

        }
    }
    callApi("POST",updateProductApiUrl+'/'+requestPayload.product_id,{
        'data':JSON.stringify(requestPayload)
    });
});