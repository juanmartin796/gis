var capas=[];
var nombre_capas;
var capa_activa;
var map;

function dibujarCapas(){

  var parser = new ol.format.WMSCapabilities();
  $.ajax({async:false, 
    url:'http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&MAP=/var/www/html/webgis/qgis/TPI.qgs&REQUEST=GetCapabilities'}).then(function(response) {

      var result = parser.read(response);
  //$('#log').html(window.JSON.stringify(result, null, 2));

  var capability = result.Capability.Layer.Layer;
  //$('#log').html(window.JSON.stringify(capability, null, 2));
  for(var i = 0; i < capability.length; i ++){
                capas.push(new ol.layer.Image({//objeto capa de tipo Imagen (1 sola imagen)
                    title: capability[i].Title,
                    visible: false,
                        source: new ol.source.ImageWMS({//fuente de datos (ImageWMS)
                            url: '/cgi-bin/qgis_mapserv.fcgi?map=/var/www/html/webgis/qgis/TPI.qgs',

                        params: {LAYERS: capability[i].Name}//por defecto version WMS = 1.3.0
                        })
                }));
            }

        });

    //setTimeout("agregarCapas(capas)", 100);
    agregarCapas(capas);
}

function agregarCapas(capas){
// creo un objeto mapa de la clase ol.Map y lo asigno a una variable llamada map
    map = new ol.Map({// el constructor de la clase ol.Map toma como parametro un obj. con la configuracion
        target: 'map', //elemento HTML en el que se va a ubicar el mapa (en este caso referenciado por el id)
        layers: [new ol.layer.Tile({//objeto capa de tipo Tile (Mosaico de Imagenes)
                        title: "Natural Earth Base Map", //titulo de la capa
                        source: new ol.source.TileWMS({//fuente de datos de la capa (TileWMS)
                            url: 'http://demo.boundlessgeo.com/geoserver/wms', //url del servicio WMS
                            params: {//parametros del servicio WMS
                                LAYERS: 'ne:ne', //capa(s) del servicio WMS
                                VERSION: '1.1.1' //version del estandar WMS
                            }
                        })
                    })].concat(capas), //fin de mi array de capas
        view: new ol.View({//todo mapa debe tener una vista
            projection: 'EPSG:4326', //CRS de la vista
            center: [-59, -27.5], //coordenadas del centro de la vista inicial [lon, lat]
            zoom: 4 //nivel de zoom inicial (OL3 usa escalas fijas)
        })
    });
}

function obtenerArregloCapas(){
    return capas;
}

function crear_checkbox_capas(){
    nombre_capas= obtenerCapas();
    for(var i = 0; i < nombre_capas.length; i ++){
        document.write('<li value="'+nombre_capas[i]+'"> <a href="#"> <input type="checkbox" name='+nombre_capas[i]+' id="checkbox_'+nombre_capas[i]+'" value="'+ nombre_capas[i]+'">'+nombre_capas[i]+'</a></li>');
    }
}

function act_des_capas(){
    var capas_del_mapa= obtenerArregloCapas();

        for (var i = 0; i <capas_del_mapa.length; i++) {
            document.getElementById("checkbox_"+nombre_capas[i]).addEventListener('change', function () {
                var checked = this.checked;
                //seteo la propiedad "visible" de mi capa en función al valor
                var pos= nombre_capas.indexOf(this.name);
                if (checked !== capas_del_mapa[pos].getVisible()) {
                    capas_del_mapa[pos].setVisible(checked);
                    capa_activa= capas_del_mapa[pos].get('title');
                }
            });
             //agrego un listener al evento change de la
            //propiedad "visible" de la capa
            capas_del_mapa[i].on('change:visible', function () {
                var nombre_de_esta_capa = this.getProperties().title;
                var visible = this.getVisible();
                //seteo el valor del checkbox
                if (visible !== document.getElementById("checkbox_"+nombre_de_esta_capa).checked) {
                    document.getElementById("checkbox_"+nombre_de_esta_capa).checked = visible;
                }
            });


        };
}




 var selectInteraction = new ol.interaction.DragBox(
                {
                    condition: ol.events.condition.always, //noModifierKeys
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [0, 0, 255, 1]
                        })
                    })
                }
);


selectInteraction.on('boxend', function (evt) {
    //this: referencia al selectInteraction
    console.log('boxend', this.getGeometry().getCoordinates());

});

function control_consulta_navegacion(el){
    if (el.title == "consulta") {
        //agrego la interaccion del dragbox
        //la cual tiene precedencia sobre las otras
        map.addInteraction(selectInteraction);
        map.removeInteraction(draw);

        //subscribo una funcion al evento click del mapa
        map.on('click', clickEnMapa);
        
        borrar_lineas_medicion();
    } else if (el.title == "navegacion") {
        //la remuevo...
        map.removeInteraction(selectInteraction);
        map.removeInteraction(draw);
        //remueveo la subscripcion de la funcion al evento click del mapa
        map.un('click', clickEnMapa);
        borrar_lineas_medicion();
    } else if (el.title=="medicion"){
         map.removeInteraction(selectInteraction);
         map.un('click', clickEnMapa);
         medir_distancia();
         map.addInteraction(draw);


    }
    //muestro por consola el valor
    console.log(el.value);
}

//funcion para el evento click en el mapa
function clickEnMapa(evt) {
    //muestro por consola las coordenadas del evento
    console.log('click',evt.coordinate);
    //alert(evt.coordinate[1]);

    $.ajax({
        type: "POST",
        url: "realizar_consulta.php",
        data: { 
                nom_capa: capa_activa,
                coordX: evt.coordinate[0],
                coordY: evt.coordinate[1],
            }
        }).done(function( msg ) {
        alert( "Los datos que se recibieron: " + msg );
    });





};

function borrar_lineas_medicion(){
    map.removeLayer(vector);
    map.getOverlays().clear();
}

