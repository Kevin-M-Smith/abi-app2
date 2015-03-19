var ordenes = manifiesto['ordenes']

var familias = []

$( document ).ready(function() {
	$.each(ordenes, function(i, orden){
		$.each(orden['familias'], function(i, familia){
			familias[familias.length] = familia
		});
	});
});


function _get_familias(_orden){
	var _familias = '('
	$.each(_orden.familias, function(i, _familia){
		_familias = _familias + _familia.nombre;
 		if(i != (_orden.familias.length-1)){
 			_familias = _familias + ', ';
 		}
	});
	_familias = _familias + ')';
	return(_familias)
} 


$( document ).on("pagecreate", "#pagina-lista-de-ordenes", function() {
	var li = "";
 	
 	$.each(ordenes, function(i, _orden) {
 		li += 
 		'<li><a href="#" id="' + i +
    	'" class="info-go"><img src="img/icones/' + _orden.nombre +
    	'.png"><h2>' + _orden.nombre +
		'</h2><p style="white-space:normal;">' + _get_familias(_orden) + 
		'</p></a></li>';
 	});
      
    $("#lista-de-ordenes").append(li).promise().done(function(){
        $(this).listview('refresh');
    });
    
});
