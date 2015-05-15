require.config({
    paths: {
        'jquery': 'jquery-2.1.3.min',
        'jquery.mobile': 'jquery.mobile-1.4.5.min',
        'leaflet': 'leaflet-0.7.3',
        'wq/locate': 'wq/locate'
    }
});

require(['app'], function(app) {
    app.initialize();
});


require(['manifiesto', 'jquery', 'jquery.mobile', 'leaflet', 'wq/locate'], function(manifiesto, $, jqm, L, locate) {
    /***************************************
     *	crear listas de órdenes y familias
     ***************************************/
    var ordenes = manifiesto['ordenes'];
    var familias = [];
    var mapa = "";

    L.NumberedDivIcon = L.Icon.extend({
        options: {
            iconUrl: 'img/marcadores/',
            color: 'rojo',
            ext: '.png',
            number: '',
            shadowUrl: null,
            iconSize: new L.Point(32, 32),
            iconAnchor: new L.Point(16, 0),
            popupAnchor: new L.Point(0, -33),
            /*
             iconAnchor: (Point)
             popupAnchor: (Point)
             */
            className: 'leaflet-div-icon'
        },

        createIcon: function () {
            var div = document.createElement('div');
            var img = this._createImg(this.options['iconUrl'] + this.options['color'] + this.options['ext']);
            var numdiv = document.createElement('div');
            numdiv.setAttribute ( "class", "number" );
            numdiv.innerHTML = this.options['number'] || '';
            div.appendChild ( img );
            div.appendChild ( numdiv );
            this._setIconStyles(div, 'icon');
            return div;
        },

        //you could change this to add a shadow like in the normal marker if you really wanted
        createShadow: function () {
            return null;
        }
    });

    $( document ).ready(function() {
        $(this).scrollTop(0);
        $("body, html").show();

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
            '" class="info-go"><h2>' + _orden.nombre +
                //   '" class="info-go"><img src="img/icones/' +
                //   _orden.nombre + '.png"><h2>' + _orden.nombre +
            '</h2><p style="white-space:normal;">' +
            _get_familias(_orden) + '</p></a></li>';
        });
        $("#lista-de-ordenes").append(li).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-rejilla-de-familias").data("orden", ordenes[this.id]);
                    $("#pagina-lista-de-familias").data("orden", ordenes[this.id]);

                    if(ordenes[this.id]['familias'].length == 1){
                        $("#pagina-de-familia").data("nombre", ordenes[this.id]['familias'][0].nombre);
                        $("#pagina-de-familia").data("puntos", ordenes[this.id]['familias'][0].puntos);
                        $("#pagina-de-familia").data("fotos", ordenes[this.id]['familias'][0].fotos);
                        $("#pagina-de-familia").data("pagina-anterior", '#pagina-lista-de-ordenes');
                        $.mobile.changePage("#pagina-de-familia");
                    } else {
                        $.mobile.changePage("#pagina-lista-de-familias");
                    }
                });

                $(this).listview('refresh');
            });
    });

    /***************************************
     *	preparar página 'rejilla-de-ordenes'
     ***************************************/
    $( document ).on("pagecreate", "#pagina-rejilla-de-ordenes", function() {
        var _grid = '';
        $.each(ordenes, function(i, _orden) {
                _grid += '<div class="ui-block-a"><a href="#" class="info-go" id="'
                + i + '"><img src="img/icones/'
                + _orden.nombre + '.png"></a></div>';
        });

        $("#rejilla-de-ordenes").append(_grid).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-rejilla-de-familias").data("orden", ordenes[this.id]);
                    $("#pagina-lista-de-familias").data("orden", ordenes[this.id]);
                    if (ordenes[this.id]['familias'].length == 1) {
                        $("#pagina-de-familia").data("nombre", ordenes[this.id]['familias'][0].nombre);
                        $("#pagina-de-familia").data("puntos", ordenes[this.id]['familias'][0].puntos);
                        $("#pagina-de-familia").data("fotos", ordenes[this.id]['familias'][0].fotos);
                        $("#pagina-de-familia").data("pagina-anterior", '#pagina-rejilla-de-ordenes');
                        $("#pagina-de-familia").data("cantidad", 0);
                        $.mobile.changePage("#pagina-de-familia");
                    } else {
                        $.mobile.changePage("#pagina-rejilla-de-familias");
                    }
                });

            });

    });


    /***************************************
     *	preparar página 'configuracion'
     ***************************************/
    $(document).on('pagebeforeshow', "#pagina-de-configuracion", function() {

        if(localStorage.getItem('destino-email')){
            $("#destino-email").val(localStorage.getItem('destino-email'));
        }

        function entregar(e){
            localStorage.setItem('destino-email', $("#destino-email").val())
            $.mobile.changePage('#pagina-inicial');
        }

        $("#boton-pagina-de-configuracion-entregar").off();
        $("#boton-pagina-de-configuracion-entregar").on('click', entregar);

        $("#boton-pagina-de-configuracion-entregar-inferior").off();
        $("#boton-pagina-de-configuracion-entregar-inferior").on('click', entregar);


    });

    /***************************************
     *	preparar página 'lista-de-familias'
     ***************************************/
    $(document).on("pagecreate", "#pagina-lista-de-familias", function() {
        $("#lista-de-familias").listview()
    });

    $(document).on("pagebeforeshow", "#pagina-lista-de-familias", function () {
        //get from data - you put this here when the "a" wa clicked in the previous page
        var orden = $(this).data("orden");
        var familias = orden['familias'];

        var li = "";

        $("#encabezado-pagina-lista-de-familias").text(orden.nombre);


        $.each(orden['familias'], function(i, _familia){
            li += '<li><a href="#" class="info-go" id="' + i + '">' + _familia.nombre + '</a></li>'
        });

        $("#lista-de-familias").off()
        $("#lista-de-familias").html(li).promise().done(
            function() {

                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-de-familia").data("nombre", familias[this.id].nombre);
                    $("#pagina-de-familia").data("puntos", familias[this.id].puntos);
                    $("#pagina-de-familia").data("fotos", familias[this.id].fotos);
                    $("#pagina-de-familia").data("pagina-anterior", '#pagina-lista-de-familias');
                    $.mobile.changePage("#pagina-de-familia");
                });

                $(this).listview('refresh');
            });

    });

    /***************************************
     *	preparar página 'rejilla-de-familias'
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-rejilla-de-familias", function () {
        var orden = $(this).data("orden");
        var familias = orden['familias'];
        var _grid = "";

        $("#encabezado-pagina-rejilla-de-familias").text(orden.nombre);

        $.each(familias, function(i, _familia){
                _grid += '<div class="ui-block-a"><a href="#" class="info-go" id="'
                + i + '"><h3>'
                + _familia.nombre
                + '</h3><img src="'
                + _familia.fotos[0]
                + '"></a><hr></div>';
        });

        $("#rejilla-de-familias").off()
        $("#rejilla-de-familias").html(_grid).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-de-familia").data("nombre", familias[this.id].nombre);
                    $("#pagina-de-familia").data("puntos", familias[this.id].puntos);
                    $("#pagina-de-familia").data("fotos", familias[this.id].fotos);
                    $("#pagina-de-familia").data("pagina-anterior", '#pagina-rejilla-de-familias');
                    $.mobile.changePage("#pagina-de-familia");

                });

            });

    });

    /***************************************
     *	preparar página de familia
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-de-familia", function() {

        var nombre = $(this).data("nombre");
        var puntos = $(this).data("puntos");
        var fotos = $(this).data("fotos");
        var pagina_anterior = $(this).data("pagina-anterior");
        var _grid = "";


        $("#encabezado-pagina-de-familia").html(nombre + '&nbsp;&nbsp;+' + puntos);

        $("#boton-atras-pagina-de-familia").attr('href', pagina_anterior);

        $.each(fotos, function(i, foto){
                _grid += '<div class="ui-block-a"><a href="#" class="info-go" id="'
                + i + '"><img src="'
                + foto + '"></a><hr></div>';
        });

        $("#boton-pagina-de-familia-entregar").off();
        $("#boton-pagina-de-familia-entregar").one("click", function (e) {
            e.preventDefault()
            $("#pagina-de-familia-total").data("nombre", nombre);
            $("#pagina-de-familia-total").data("puntos", puntos);
            $("#pagina-de-familia-total").data("fotos", fotos);
            $.mobile.changePage("#pagina-de-familia-total");
    
        });



        $("#boton-pagina-de-familia-entregar-inferior").off();
        $("#boton-pagina-de-familia-entregar-inferior").one("click", function (e) {
            e.preventDefault();
            $("#pagina-de-familia-total").data("nombre", nombre);
            $("#pagina-de-familia-total").data("puntos", puntos);
            $("#pagina-de-familia-total").data("fotos", fotos);
            $.mobile.changePage("#pagina-de-familia-total");
        });


        $("#rejilla-de-familia").off()
        $("#rejilla-de-familia").html(_grid).promise().done(
            function() {
                $(this).on("click", ".info-go", function (e) {
                    e.preventDefault();
                    $("#pagina-foto").data("foto", fotos[this.id]);
                    $("#pagina-foto").data("nombre", nombre);
                    $.mobile.changePage("#pagina-foto");
                });

            });

    });

    /***************************************
     *	preparar página de familia total
     ***************************************/
    $(document).on("pagebeforeshow", "#pagina-de-familia-total", function () {
        var nombre = $(this).data("nombre");
        var puntos = $(this).data("puntos");
        var fotos = $(this).data("fotos");

        var cantidad = $("#" + nombre).data("cantidad")

        if(typeof cantidad == 'undefined'){
                cantidad = 0;
        } else {
            $("#pagina-de-familia-total-cantidad").val(cantidad);
        }

        $("#encabezado-pagina-de-familia-total").text(nombre);


        function entregar(e){
            e.preventDefault();

            var cantidad = $("#pagina-de-familia-total-cantidad").val()

            console.log(cantidad)

            if($("#" + nombre).length == 0){

                console.log(true)


                //  $("#pagina-de-encuesta-lista-de-familias").append('<li ' + 'id="'
//                 + nombre + '"><a class="boton-nombre-de-familia" href="#"><table align="left"><tr>'
//                 + '<th style="width:30px; text-align:right;">+' + puntos + '</th>'
//                 + '<th rowspan="2"><div class="nombre-de-familia">&nbsp;&nbsp;' + nombre + '</div></th></tr>'
//                 + '<tr><th style="text-align:right;">(' + cantidad + ')</th></tr></table></a>'
//                 + '<a href="#" data-icon="delete" class="delete">&nbsp;&nbsp;</a></li>').listview('refresh');

//                  $("#pagina-de-encuesta-lista-de-familias").append('<li ' + 'id="'
//                 + nombre + '"><a class="boton-nombre-de-familia" href="#" style="padding-left: 0px; padding-right: 0px;"><table align="left"><tr>'
//                 + '<td style="width:30px; text-align:right; font-size:0.8em;">&nbsp;+' + puntos + '</td>'
//                 + '<th><div style="width:136px;" class="nombre-de-familia">' + nombre + '</div></th>'
//                 + '<td style="width:30px; text-align:right; font-size:0.8em;">(' + cantidad + ')&nbsp;</td></tr></table></a>'
//                 + '<a href="#" data-icon="delete" class="delete">&nbsp;&nbsp;</a></li>').listview('refresh');
//
                //                   $("#pagina-de-encuesta-lista-de-familias").append('<li ' + 'id="'
//                 + nombre + '"><a class="boton-nombre-de-familia" href="#" style="padding-left: 0px; padding-right: 0px;"><table align="left"><tr>'
//                 + '<td style="width:30px; text-align:right; font-size:1em;">&nbsp;' + puntos + '</td>'
//                 + '<th><div style="width:136px;" class="nombre-de-familia">' + nombre + '</div></th>'
//                 + '<td style="width:30px; text-align:right; font-size:0.9em;">(' + cantidad + ')&nbsp;</td></tr></table></a>'
//                 + '<a href="#" data-icon="delete" class="delete">&nbsp;&nbsp;</a></li>').listview('refresh');
//
                $("#pagina-de-encuesta-lista-de-familias").append('<li ' + 'class="nombre-de-familia" id="'
                + nombre + '"><a class="boton-nombre-de-familia" href="#" style="padding-left: 0px; padding-right: 0px;"><table align="center" width="100%"><tr>'
                + '<td style="width:15%; text-align:right; font-size:0.9em;">+' + puntos + '</td>'
                + '<th style="width:70%; text-align:center;">' + nombre + '</div></th>'
                + '<td style="width:15%; text-align:right; font-size:0.9em;" class="cantidad-de-familia">(' + cantidad + ')&nbsp;</td></tr></table></a>'
                + '<a href="#" data-icon="delete" class="delete">&nbsp;&nbsp;</a></li>').listview('refresh');


                $("#" + nombre).data("cantidad", cantidad);
                $("#" + nombre).data("nombre", nombre);
                $("#" + nombre).data("puntos", puntos);
                $("#" + nombre).data("fotos", fotos);

                $("#" + nombre + " .boton-nombre-de-familia").on("click", function (e) {

                    var nombre = $(this).parent().data("nombre");
                    var puntos = $(this).parent().data("puntos");
                    var fotos = $(this).parent().data("fotos");

                    $("#pagina-de-familia").data("nombre", nombre);
                    $("#pagina-de-familia").data("puntos", puntos);
                    $("#pagina-de-familia").data("fotos", fotos);
                    $("#pagina-de-familia").data("pagina-anterior", '#pagina-de-encuesta-nueva-familias');

                    $.mobile.changePage("#pagina-de-familia");

                });


                function setColor(_ABI){
                    if(_ABI > 70) return "#99E6FF";
                    if(_ABI > 45) return "#94FF70";
                    if(_ABI > 27) return "#FFFA4F";
                    if(_ABI > 11) return "#FFAD33";

                    return "#F75D63";
                }


                var _familias = $(".nombre-de-familia")
                var ABI = 0;
                var cantidad = 0;

                $.each(_familias, function(i, familia){
                    var _familia = $("#" + familia.id)
                    ABI += parseInt(_familia.data('puntos'));
                    cantidad += parseInt(_familia.data('cantidad'));
                });

                $("#pagina-de-encuesta-nueva-familias-ABI").html('&nbsp;&nbsp;&nbsp;' + ABI);
                $("#pagina-de-encuesta-nueva-familias-cantidad").html('(' + cantidad + ')');
                $("#pagina-de-encuesta-nueva-familias-total li").css("background", setColor(ABI))
                $("#pagina-de-encuesta-nueva-familias-total").show();


                $.mobile.changePage("#pagina-de-encuesta-nueva-familias");

            } else {
                $("#" + nombre).data("cantidad", cantidad);
                $("#" + nombre + " .cantidad-de-familia").text('(' + cantidad + ')')

                function setColor(_ABI){
                    if(_ABI > 70) return "#99E6FF";
                    if(_ABI > 45) return "#94FF70";
                    if(_ABI > 27) return "#FFFA4F";
                    if(_ABI > 11) return "#FFAD33";

                    return "#F75D63";
                }

                var _familias = $(".nombre-de-familia")
                var ABI = 0;
                var cantidad = 0;

                $.each(_familias, function(i, familia){
                    var _familia = $("#" + familia.id)
                    ABI += parseInt(_familia.data('puntos'));
                    cantidad += parseInt(_familia.data('cantidad'));
                });

                $("#pagina-de-encuesta-nueva-familias-ABI").html('&nbsp;&nbsp;&nbsp;' + ABI);
                $("#pagina-de-encuesta-nueva-familias-cantidad").html('(' + cantidad + ')');
                $("#pagina-de-encuesta-nueva-familias-total li").css("background", setColor(ABI))
                $("#pagina-de-encuesta-nueva-familias-total").show();

                $.mobile.changePage("#pagina-de-encuesta-nueva-familias")
            }
        }


        $("#boton-pagina-de-familia-total-entregar").off();
        $("#boton-pagina-de-familia-total-entregar").one("click", entregar);

        $("#boton-pagina-de-familia-total-entregar-inferior").off();
        $("#boton-pagina-de-familia-total-entregar-inferior").one("click", entregar);
        
    });




    $(document).on("pagebeforeshow", "#pagina-foto", function() {
        var foto = $(this).data("foto");
        var nombre = $(this).data("nombre");
        $("#encabezado-pagina-foto").text(nombre);
        $("#foto-grande").attr('src', foto);
        
        $("#boton-atras-pagina-foto").off()
        $("#boton-atras-pagina-foto").on("click", function(e) {
            $.mobile.changePage("#pagina-de-familia")
        });

    });

    $(document).on("pagecreate", "#pagina-mapa", function(e){

        L.Icon.Default.imagePath = 'css/images';

        var map = L.map('mapa');
        mapa = map;

        //L.tileLayer('img/mapas/medford/{z}/{x}/{y}.jpg', {
        //    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //}).addTo(map);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var marker1 = new L.Marker(new L.LatLng(42.4156005703471, -71.13437175750732), {
            icon:	new L.NumberedDivIcon({number: '8', color: 'verde'})
        });

        var marker2 = new L.Marker(new L.LatLng(42.417121344773776, -71.13138914108276), {
            icon:	new L.NumberedDivIcon({number: '1', color: 'rojo'})
        });

        var marker3 = new L.Marker(new L.LatLng(42.4160909152186, -71.13196849822998), {
            icon:	new L.NumberedDivIcon({number: '6', color: 'amarillo'})
        });

        marker1.addTo(map);
        marker2.addTo(map);
        marker3.addTo(map);

        var fields = {
            'toggle': $('input[name=mode]'),
            'latitude': $('input[name=latitude]'),
            'longitude': $('input[name=longitude]'),
            'accuracy': $('input[name=accuracy]')
        };

        var config = {
            // Custom handler for location updates
            'onUpdate': function(loc, accuracy) {
                if (accuracy > 1000) {
                    $('#message').html(
                        "Note: your location accuracy appears to be off by more than 1km."
                    );
                } else {
                    $('#message').html("");
                }
            }
        };

        var locator = locate.locator(map, fields, config);


        //map.on('locationfound', function(e){
        //    var marker = new L.Marker(e.latlng, {
        //        icon:	new L.NumberedDivIcon({number: '1'})
        //    });
        //    marker.addTo(map)
        //});
        //
        //map.on('locationerror', function(e){
        //    alert(e.message);
        //});
        //
        //map.locate({setView: true, maxZoom: 18});

    });


    /***************************************
     *    pagina-de-encuesta-nueva-foto
     ***************************************/

    $(document).on("pagecreate", "#pagina-de-encuesta-nueva-foto", function (e) {
        $("#boton-pagina-de-encuesta-nueva-foto-entregar").one("click", function (e) {
            $("#boton-pagina-de-encuesta-nueva-foto").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-foto-a").removeClass('ui-btn-c').addClass('ui-btn-d');
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        });
    });


    /***************************************
     *    pagina-de-encuesta-nueva-fecha-y-hora
     ***************************************/

    $(document).on("pagebeforeshow", "#pagina-de-encuesta-nueva-fecha-y-hora", function (e) {

        if($("#pagina-de-encuesta-nueva").data("fecha")){
            $("#fecha").val($("#pagina-de-encuesta-nueva").data("fecha"));
        }

        if($("#pagina-de-encuesta-nueva").data("hora")){
            $("#hora").val($("#pagina-de-encuesta-nueva").data("hora"));
        }

        function entregar(e){

            var fecha = "";
            var hora = "";

            if($("#fecha").val().length == 0){
                alert("Por favor, introduzca la fecha.");
                return;
            } else {
                fecha = $("#fecha").val();
            }

            if($("#hora").val().length == 0){
                alert("Por favor, introduzca la hora.");
                return;
            } else {
                hora = $("#hora").val();
            }

            $("#pagina-de-encuesta-nueva").data("fecha", fecha);
            $("#pagina-de-encuesta-nueva").data("hora", hora);
            $("#boton-pagina-de-encuesta-nueva-fecha-y-hora").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-a").removeClass('ui-btn-c').addClass('ui-btn-d');
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        }

        $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-entregar-inferior").off();
        $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-entregar-inferior").on("click", entregar);

        $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-entregar").off();
        $("#boton-pagina-de-encuesta-nueva-fecha-y-hora-entregar").on("click", entregar);
    });


    /***************************************
     *    pagina-de-encuesta-familias
     ***************************************/

    $(document).on("pagecreate", "#pagina-de-encuesta-nueva-familias", function (e) {

        function confirmAndDelete(listitem) {
            listitem.addClass("ui-btn-down-d");
            $("#confirm .nombre-de-familia").remove();
            listitem.find(".nombre-de-familia").clone().insertAfter("#question");
            $("#confirm").popup("open");
            $("#confirm #yes").on("click", function () {
                listitem.remove();


                function setColor(_ABI){
                    if(_ABI > 70) return "#99E6FF";
                    if(_ABI > 45) return "#94FF70";
                    if(_ABI > 27) return "#FFFA4F";
                    if(_ABI > 11) return "#FFAD33";

                    return "#F75D63";
                }


                var _familias = $(".nombre-de-familia")
                var ABI = 0;
                var cantidad = 0;

                $.each(_familias, function(i, familia){
                    var _familia = $("#" + familia.id)
                    ABI += parseInt(_familia.data('puntos'));
                    cantidad += parseInt(_familia.data('cantidad'));
                });

                $("#pagina-de-encuesta-nueva-familias-ABI").html('&nbsp;&nbsp;&nbsp;' + ABI);
                $("#pagina-de-encuesta-nueva-familias-cantidad").html('(' + cantidad + ')');
                $("#pagina-de-encuesta-nueva-familias-total li").css("background", setColor(ABI));


                $("#pagina-de-encuesta-lista-de-familias").listview("refresh");
            });

            $("#confirm #cancel").on("click", function () {
                listitem.removeClass("ui-btn-down-d");
                $("#confirm #yes").off();
            });
        }
        
        $(document).on("click", ".delete", function(e){
        	confirmAndDelete($(this).parent());
        });
        
        $("#boton-pagina-de-encuesta-nueva-familias-entregar").on("click", function (e) {
            $("#boton-pagina-de-encuesta-nueva-familias").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-familias-a").removeClass('ui-btn-c').addClass('ui-btn-d')
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        });
    })


    $(document).on("pagebeforeshow", "#pagina-de-encuesta-nueva-localizacion", function(e) {

        $("#get-gps").on("click", function(e) {
            navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy : true,
    		timeout : 10000, // 10s
    		maximumAge : 0});
        });

        if($("#pagina-de-encuesta-nueva").data("lon")) {
            $('#longitude2').val($("#pagina-de-encuesta-nueva").data("lon"));
        }

        if($("#pagina-de-encuesta-nueva").data("lon")) {
            $('#latitude2').val($("#pagina-de-encuesta-nueva").data("lat"));
        }

        function success(evt) {
            $('#longitude2').val(evt.coords.longitude);
            $('#latitude2').val(evt.coords.latitude);
            $('#accuracy2').val(evt.coords.accuracy);
        }

        function error(evt) {
            var r = window.confirm("No se pudo obtener las coordenadas GPS. ¿Inténtalo de nuevo con más tiempo?")

            if(r){
                navigator.geolocation.getCurrentPosition(success, error, {
                    enableHighAccuracy : true,
                    timeout : 30000, // 30s
                    maximumAge : 0});
            }
        }


        function entregar(e){

            var _lat = $('#latitude2').val();
            var _lon = $('#longitude2').val();

            if(_lon.length == 0){
                alert("Por favor, introduzca la longitud.");
                return;
            }

            if(_lat.length == 0){
                alert("Por favor, introduzca la latitud.");
                return;
            }

            $("#boton-pagina-de-encuesta-nueva-localizacion").attr('data-theme', 'd');
            $("#boton-pagina-de-encuesta-nueva-localizacion-a").removeClass('ui-btn-c').addClass('ui-btn-d');
            $("#pagina-de-encuesta-nueva").data("lat", _lat);
            $("#pagina-de-encuesta-nueva").data("lon", _lon);
            $("#pagina-de-encuseta-nueva").data("pre", $("#accuracy2").val())
            $.mobile.changePage("#pagina-de-encuesta-nueva");
        }

        $("#boton-pagina-de-encuesta-nueva-localizacion-entregar").off();
        $("#boton-pagina-de-encuesta-nueva-localizacion-entregar").on("click", entregar);

        $("#boton-pagina-de-encuesta-nueva-localizacion-entregar-inferior").off();
        $("#boton-pagina-de-encuesta-nueva-localizacion-entregar-inferior").on("click", entregar);
    });


    $(document).on("pagecreate", "#pagina-de-encuesta-nueva", function(e) {
        $("#boton-pagina-de-encuesta-nueva-entregar").on("click", function (e) {

            var datos = "mailto:";

            if(localStorage.getItem('destino-email')){
                datos += localStorage.getItem('destino-email');
            } else {
                datos += 'ejemplo.abi@gmail.com'
            }

            datos += '?subject=ABI&body='

            datos += 'Fecha,';
            datos += 'Hora,';
            datos += 'Latitud,';
            datos += 'Longitud,';
            datos += 'Precision,';
            datos += 'IBA,';
            datos += 'Cantidad,';

            $.each(familias, function(i, familia){
              datos += familia.nombre;
              datos += ',';
            })

            datos += 'Notas,';
            datos += 'Versión%0A%0A'

            if($("#pagina-de-encuesta-nueva").data("fecha")){
                datos += $("#pagina-de-encuesta-nueva").data("fecha");
                datos += ',';
            } else {
                datos += '-9999'
            }

            if($("#pagina-de-encuesta-nueva").data("hora")){
                datos += $("#pagina-de-encuesta-nueva").data("hora");
                datos += ',';
            } else {
                datos += '-9999,';
            }

            if($("#pagina-de-encuesta-nueva").data("lat")){
                datos += $("#pagina-de-encuesta-nueva").data("lat");
                datos += ',';
            } else {
                datos += '-9999,';
            }

            if($("#pagina-de-encuesta-nueva").data("lon")){
                datos += $("#pagina-de-encuesta-nueva").data("lon");
                datos += ',';
            } else {
                datos += '-9999,';
            }

            if($("#pagina-de-encuesta-nueva").data("pre")){
                datos += $("#pagina-de-encuesta-nueva").data("pre");
                datos += ',';
            } else {
                datos += '-9999,';
            }


            var _familias = $(".nombre-de-familia");
            var ABI = 0;
            var cantidad = 0;

            $.each(_familias, function(i, familia){
                var _familia = $("#" + familia.id);
                ABI += parseInt(_familia.data('puntos'));
                cantidad += parseInt(_familia.data('cantidad'));
            });

            datos += ABI;
            datos += ',';

            datos += cantidad;
            datos += ',';

            $.each(familias, function(i, familia){

                if($("#" + familia.nombre).length){
                    datos += $("#" + familia.nombre).data('cantidad');
                    datos += ',';
                } else {
                    datos += '0,';
                }
            });

            datos += '"';
            datos += $("#notas").val();
            datos += '",';
            datos += '1.1.1';
            datos += '%0A';

            console.log(datos);




            $("#email").attr('href', datos);
            $.mobile.changePage("#pagina-de-enviar");




            //map.on('locationfound', function(e){
            //    var marker = new L.Marker(e.latlng, {
            //        icon:	new L.NumberedDivIcon({number: '1'})
            //    });
            //    marker.addTo(map)
            //});

            //  var marker3 = new L.Marker(new L.LatLng($('#latitude2').val(), $('#longitude2').val()), {

            //var marker3 = new L.Marker(new L.LatLng(42.41598, -71.1391), {
            //    icon:	new L.NumberedDivIcon({number: '5', color: 'amarillo'})
            //});
            //
            //marker3.addTo(mapa);
            //
            //$.mobile.changePage("#pagina-inicial");
        });

    });


    $(document).on("pagecreate", "#pagina-de-enviar", function(e){


        $("#reiniciar").on('click', function(e){
            var r = window.confirm("Reiniciar?")

            if(r){
                document.location = "index.html";
            }

        });


    });



});



