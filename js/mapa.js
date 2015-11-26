var capas=[];
var nombre_capas;
var capa_activa;
var map;
var modify;
var draw2;
var features;
var featureOverlay;

var capas_visibles=[];

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
                            params: {LAYERS: capability[i].Name},
                            serverType:'qgis'//por defecto version WMS = 1.3.0
                        })
                }));
            }

        });

    //setTimeout("agregarCapas(capas)", 100);
    agregarCapas(capas);
}

var scaleLineControl = new ol.control.ScaleLine();
scaleLineControl.setUnits('metric');

function agregarCapas(capas){
    //capa base de mapa fisico
    /*var layers = [
          new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
          }),
          new ol.layer.Tile({
            extent: [-13884991, 2870341, -7455066, 6338219],
            source: new ol.source.TileWMS({
              url: 'http://demo.boundlessgeo.com/geoserver/wms',
              params: {'LAYERS': 'topp:states', 'TILED': true},
              serverType: 'geoserver'
            })
          })
        ];*/



// creo un objeto mapa de la clase ol.Map y lo asigno a una variable llamada map
    map = new ol.Map({// el constructor de la clase ol.Map toma como parametro un obj. con la configuracion
        target: 'map', //elemento HTML en el que se va a ubicar el mapa (en este caso referenciado por el id)
        layers: [new ol.layer.Tile({//objeto capa de tipo Tile (Mosaico de Imagenes)
                        title: "Natural Earth Base Map", //titulo de la capa
                        source: new ol.source.TileWMS({//fuente de datos de la capa (TileWMS)
                            url: 'http://demo.boundlessgeo.com/geoserver/wms', //url del servicio WMS
                            //url: 'http://www.gebco.net/data_and_products/gebco_web_services/web_map_service', //url del servicio WMS
                            params: {//parametros del servicio WMS

                                LAYERS: 'ne:ne', //capa(s) del servicio WMS
                                //LAYERS: 'GEBCO_LATEST', //capa(s) del servicio WMS
                                VERSION: '1.1.1' //version del estandar WMS
                            }
                        })
                    })].concat(capas), //fin de mi array de capas
        //layers: layers.concat(capas),
        view: new ol.View({//todo mapa debe tener una vista
            projection: 'EPSG:4326', //CRS de la vista
            center: [-59, -27.5], //coordenadas del centro de la vista inicial [lon, lat]
            zoom: 4 //nivel de zoom inicial (OL3 usa escalas fijas)
        }),

        //para la escala del mapa
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
              collapsible: false
            })
          }).extend([
            scaleLineControl
          ])
    });

    init();
}

function addInteraction(tipo) {
      draw2 = new ol.interaction.Draw({
        features: features,
        type: /** @type {ol.geom.GeometryType} */ (tipo)
      });
      //map.addInteraction(draw2);
    }

function obtenerArregloCapas(){
    return capas;
}

function crear_checkbox_capas(){
    nombre_capas= obtenerCapas();
    for(var i = 0; i < nombre_capas.length; i ++){
        document.write('<li value="'+nombre_capas[i]+'"> <a href="javascript:void(0)"> <input type="checkbox" name='+nombre_capas[i]+' id="checkbox_'+nombre_capas[i]+'" value="'+ nombre_capas[i]+'">'+nombre_capas[i]+'</a></li>');
    }
}

function obtenerCapas(){
    var capa2=[];

    var parser = new ol.format.WMSCapabilities();
    $.ajax({async:false, 
        url:'/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&MAP=/var/www/html/webgis/qgis/TPI.qgs&REQUEST=GetCapabilities'}).then(function(response) {

            var result = parser.read(response);
  //$('#log').html(window.JSON.stringify(result, null, 2));

  var capability = result.Capability.Layer.Layer;
  //$('#log').html(window.JSON.stringify(capability, null, 2));
  for(var i = 0; i < capability.length; i ++){
    capa2.push(capability[i].Name);
  }
  
    });
    return capa2;
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


                //para la leyenda, agrego la capa visible al array, para luego hacer el getlegendgraphic
                if (this.getVisible()==true){
                    capas_visibles.push(this.get('title'));
                    var url= "http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&MAP=/var/www/html/webgis/qgis/TPI.qgs&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYERFONTSIZE=9&ITEMFONTSIZE=8&LAYERFONTBOLD=TRUE&LAYER="
                                        +capas_visibles;
                    $('#legend').attr("src", url);

                } else{
                    var index = capas_visibles.indexOf(this.get('title'));
                    if (index > -1) {
                        capas_visibles.splice(index, 1);
                    }
                    var url= "http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&MAP=/var/www/html/webgis/qgis/TPI.qgs&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=10&LAYERFONTSIZE=9&ITEMFONTSIZE=8&LAYERFONTBOLD=TRUE&LAYER="
                                        +capas_visibles;
                    $('#legend').attr("src", url);
                }
            });
        }
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

var wkt;
var coordinate;
selectInteraction.on('boxend', function (evt) {
    //this: referencia al selectInteraction
    console.log('boxend', this.getGeometry().getCoordinates());

    coordinate= this.getGeometry().getCoordinates();
    coordenadas= this.getGeometry().getCoordinates();
    //es un poligono en la forma [ [ [lon,lat],[lon,lat],....] ]
    wkt = 'POLYGON((';
    for(var i=0;i<coordinate[0].length - 1;i++){
        wkt+=coordinate[0][i][0]+ ' ' + coordinate[0][i][1]+ ',';
    }
    wkt+=coordinate[0][0][0]+' '+coordinate[0][0][1]+'))';
    //alert(wkt);

    $.ajax({
        type: "POST",
        url: "php/realizar_consulta_rectangulo.php",
        data: { 
                nom_capa: capa_activa,
                wkt: wkt
            }
    }).done(function( msg ) {
            //alert( "Los datos que se recibieron: " + msg );
            mostrar_vent_consulta(msg);
        
    });
    //window.open('consulta.php?wkt='+wkt);return; 
    

});

function control_consulta_navegacion(el){
    if (el.title == "consulta") {
        //agrego la interaccion del dragbox
        //la cual tiene precedencia sobre las otras
        map.addInteraction(selectInteraction);
        map.removeInteraction(draw);
        map.removeInteraction(modify);
        map.removeInteraction(draw2);

        //subscribo una funcion al evento click del mapa
        map.on('click', clickEnMapa);
        
        borrar_lineas_medicion();
    } else if (el.title == "navegacion") {
        //la remuevo...
        map.removeInteraction(selectInteraction);
        map.removeInteraction(draw);
        map.removeInteraction(modify);
        map.removeInteraction(draw2);
        //remueveo la subscripcion de la funcion al evento click del mapa
        map.un('click', clickEnMapa);
        borrar_lineas_medicion();
    } else if (el.title=="medicion"){
         borrar_lineas_medicion();
         map.removeInteraction(selectInteraction);
         map.removeInteraction(modify);
         map.removeInteraction(draw2);
         map.un('click', clickEnMapa);
         medir_distancia();
         map.addInteraction(draw);



    }
    //muestro por consola el valor
    console.log(el.value);
}

//funcion para el evento click en el mapa
var coordX;
var coordY;

var url;
var texto_consulta;
var coordenadas;

function clickEnMapa(evt) {
    coordenadas= evt.coordinate
    texto_consulta='';

    //var url = capas[25].getSource().getGetFeatureInfoUrl(

        //obtengo el objeto capa que se encuentra activa actual
    for (i=0; i<capas.length; i++){
        if (capas[i].get('title')== capa_activa){
            capa_objeto_activa =capas[i];
        }
    }

    url = capa_objeto_activa.getSource().getGetFeatureInfoUrl(
      evt.coordinate,
      //map.getView().getResolution(),
      0.01, //la resolucion. Cuando agrande la vision de los puntos al cambiar de escala, puedo poner la resolusion actual
      'EPSG:4326',
      {
         //'INFO_FORMAT': 'text/html',
         'INFO_FORMAT':  'text/xml', //pueden ser 'text/plain', 'text/html' or 'text/xml'
         //'FEATURE_COUNT': '20' //or whatever you want
      }
    );
    //alert('localhost'+url);



    $.ajax({
      async:false,
      type: "GET",
      dataType: "xml",
      url: url,
      success: function(xml){
        band_fila=true;
       $(xml).find("Attribute").each(function(){
            if ($(this).attr("name")!='geom'){
                if (band_fila==true){
                    texto_consulta+='<div class="row">';
                }
                texto_consulta+='<div class="col-xs-2 text-right" style="padding-right: 0px">'+
                '<b>'+$(this).attr("name")+': </b>'+
                '</div>'+
                '<div class="col-xs-4" style="padding-left: 8px">'+
                $(this).attr("value")+
                '</div>';
                if (band_fila==true){
                    band_fila=false;
                } else{
                    band_fila=true;
                }
                if (band_fila==true){
                    texto_consulta+='</div>';
                }
                //texto_consulta+='<strong>'+$(this).attr("name")+': </strong>'+$(this).attr("value")+ '<br>';
            }

        });
        }
    });


    mostrar_vent_consulta(texto_consulta);


    //muestro por consola las coordenadas del evento
    console.log('click',evt.coordinate);
    //alert(evt.coordinate[1]);
    /*coordX= evt.coordinate[0];
    coordY=evt.coordinate[1];

    $.ajax({
        type: "POST",
        url: "realizar_consulta.php",
        data: { 
                nom_capa: capa_activa,
                coordX: evt.coordinate[0],
                coordY: evt.coordinate[1],
            }
    }).done(function( msg ) {
            //alert( "Los datos que se recibieron: " + msg );
            mostrar_vent_consulta(msg);
        
    });*/
};

function mostrar_vent_consulta(msg){
    $('#modalConsulta').modal('show');
        body_modal= document.getElementById('modal-body');
        //body_modal.innerHTML=msg;
        //body_modal.innerHTML=texto_consulta;
        body_modal.innerHTML=msg;
        //iframe_consulta= document.getElementById('iframe_consulta');
        //iframe_consulta.src=url;

        lista_capas= document.getElementById('lista_capas');
        var lista;
        capa_activa= $(".dropdown-menu").find(".active").attr('value');
        $("input[type=checkbox]:checked").each(function(){
            //alert($(this).val());
            if ($(this).val()==capa_activa) {
                lista+= "<option selected value="+$(this).val()+">"+ $(this).val()+"</option>";
            }else{
                lista+= "<option value="+$(this).val()+">"+ $(this).val()+"</option>";
            }
        });
        lista_capas.innerHTML= lista;
}

function refrescar_vent_modal(capa_activa){
    if (coordenadas.length==1){ //actualiza la ventana cuando es por seleccion de rectangulo
        for (i=0; i<capas.length; i++){
            if (capas[i].get('title')== capa_activa){
                capa_objeto_activa =capas[i];
            }
        }
        $.ajax({
            type: "POST",
            url: "php/realizar_consulta_rectangulo.php",
            data: { 
                    nom_capa: capa_activa,
                    wkt: wkt
                }
        }).done(function( msg ) {
                //alert( "Los datos que se recibieron: " + msg );
                mostrar_vent_consulta_cambiar_capa(capa_activa, msg);
            
        });
    } else {

        for (i=0; i<capas.length; i++){
            if (capas[i].get('title')== capa_activa){
                capa_objeto_activa =capas[i];
            }
        }
        url = capa_objeto_activa.getSource().getGetFeatureInfoUrl(
          coordenadas,
          //map.getView().getResolution(),
          0.01, //la resolucion. Cuando agrande la vision de los puntos al cambiar de escala, puedo poner la resolusion actual
          'EPSG:4326',
          {
             //'INFO_FORMAT': 'text/html',
             'INFO_FORMAT':  'text/xml', //pueden ser 'text/plain', 'text/html' or 'text/xml'
             //'FEATURE_COUNT': '20' //or whatever you want
          }
        );
        texto_consulta='';
         $.ajax({
          async:false,
          type: "GET",
          dataType: "xml",
          url: url,
          success: function(xml){
            band_fila=true;
           $(xml).find("Attribute").each(function(){
                if ($(this).attr("name")!='geom'){
                    if (band_fila==true){
                        texto_consulta+='<div class="row">';
                    }
                    texto_consulta+='<div class="col-xs-2 text-right" style="padding-right: 0px">'+
                    '<b>'+$(this).attr("name")+': </b>'+
                    '</div>'+
                    '<div class="col-xs-4" style="padding-left: 8px">'+
                    $(this).attr("value")+
                    '</div>';
                    if (band_fila==true){
                        band_fila=false;
                    } else{
                        band_fila=true;
                    }
                    if (band_fila==true){
                        texto_consulta+='</div>';
                    }
                }

            });
            }
        });
        mostrar_vent_consulta_cambiar_capa(capa_activa, texto_consulta);
    }
}

function mostrar_vent_consulta_cambiar_capa(capa_actual, msg){
     $('#modalConsulta').modal('show');
        body_modal= document.getElementById('modal-body');
        body_modal.innerHTML=msg;

        lista_capas= document.getElementById('lista_capas');
        var lista;
        $("input[type=checkbox]:checked").each(function(){
            //alert($(this).val());
            if ($(this).val()==capa_actual) {
                lista+= "<option selected value="+$(this).val()+">"+ $(this).val()+"</option>";
            }else{
                lista+= "<option value="+$(this).val()+">"+ $(this).val()+"</option>";
            }
        });
        lista_capas.innerHTML= lista;
}

function borrar_lineas_medicion(){
    map.removeLayer(vector);
    map.removeLayer(featureOverlay);
    //map.removeOverlay(featureOverlay);
    map.getOverlays().clear();
}



function agregarElementosCapa(tipo){
    map.removeLayer(vector);
    map.getOverlays().clear();

    map.un('click', clickEnMapa);
    //map.addInteraction(modify);
    //map.removeInteraction(draw2);
    map.removeInteraction(draw);
    //addInteraction(tipo);
    //map.addInteraction(draw2);
    agregar(tipo);
}
