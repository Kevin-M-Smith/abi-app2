require.config({
    paths: {
        'jquery': 'jquery-2.1.3.min',
        'jquerymobile': 'jquery.mobile-1.4.5.min'
    }
});

require(['app'], function(app) {    
    app.initialize();
});


require(['manifiesto', 'jquery', 'jquerymobile'], function(manifiesto, $, jqm) {
    /***************************************
     *	crear listas de órdenes y familias
     ***************************************/
    var ordenes = manifiesto['ordenes'];
    var familias = []
    $( document ).ready(function() {
        $.each(ordenes, function(i, orden) {
            $.each(orden['familias'], function(i,
                familia) {
                familias[familias.length] =
                    familia
            });
        });
    });
    
    /***************************************
     *	función auxiliar para recuperar todas
     *  las familias asociadas a una orden
     ***************************************/
    function _get_familias(_orden) {
        var _familias = '('
        $.each(_orden.familias, function(i, _familia) {
            _familias = _familias + _familia.nombre;
            if (i != (_orden.familias.length - 1)) {
                _familias = _familias + ', ';
            }
        });
        _familias = _familias + ')';
        return (_familias)
    }
        
    /***************************************
     *	preparar página 'lista-de-ordenes'
     ***************************************/
    $( document ).on("pagecreate", "#pagina-lista-de-ordenes", function() {
        var li = "";
        $.each(ordenes, function(i, _orden) {
            li += '<li><a href="#" id="' + i +
            '" class="info-go"><img src="img/icones/' +
            _orden.nombre + '.png"><h2>' + _orden.nombre +
            '</h2><p style="white-space:normal;">' +
            _get_familias(_orden) + '</p></a></li>';
        });
        $("#lista-de-ordenes").append(li).promise().done(
            function() {
                $(this).listview('refresh');
            });
    });

    /***************************************
     *	preparar página 'rejilla-de-ordenes'
     ***************************************/
    $( document ).on("pagecreate", "#pagina-rejilla-de-ordenes", function() {
        var _grid = '';
        $.each(ordenes, function(i, _orden) {
            if(i % 2 == 0 ){
                _grid = _grid + '<div class="ui-block-a"><a href="#"><img src="img/icones/' + _orden.nombre + '.png"></a></div>'

                // _grid = _grid + '<div class="ui-block-a">' + _orden.nombre + '</div>'
            } else {
                _grid = _grid + '<div class="ui-block-a"><a href="#"><img src="img/icones/' + _orden.nombre + '.png"></a></div>'

                // _grid = _grid + '<div class="ui-block-b">' + _orden.nombre + '</div>'
            }
        });



        $("#rejilla-de-ordenes").append(_grid).promise().done(
           function() {
        //        $(this).listview('refresh');
            });
    });
});