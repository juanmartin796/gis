var features;
var featureOverlay;
var modify;
var draw2;

function init(){
	features = new ol.Collection();
	featureOverlay = new ol.layer.Vector({
		title:"capa_elementos_dibujados",
	  source: new ol.source.Vector({features: features}),
	  style: new ol.style.Style({
	    fill: new ol.style.Fill({
	      color: 'rgba(255, 255, 255, 0.2)'
	    }),
	    stroke: new ol.style.Stroke({
	      color: '#ffcc33',
	      width: 2
	    }),
	    image: new ol.style.Circle({
	      radius: 7,
	      fill: new ol.style.Fill({
	        color: '#ffcc33'
	      })
	    })
	  })
	});
	//featureOverlay.setMap(map);
	map.addLayer(featureOverlay);

	modify = new ol.interaction.Modify({
	  features: features,
	  // the SHIFT key must be pressed to delete vertices, so
	  // that new vertices can be drawn at the same position
	  // of existing vertices
	  deleteCondition: function(event) {
	    return ol.events.condition.shiftKeyOnly(event) &&
	        ol.events.condition.singleClick(event);
	  }
	});
	//map.addInteraction(modify);

	 // global so we can remove it later


	/**
	 * Let user change the geometry type.
	 * @param {Event} e Change event.
	 */

	//addInteraction();
}

var tipo_geometria;
function addInteraction(tipo) {
	tipo_geometria=tipo;
	alert(tipo);
	  draw2 = new ol.interaction.Draw({
	    features: features,
	    type: /** @type {ol.geom.GeometryType} */ (tipo)
	  });
	  map.addInteraction(draw2);
	  draw2.on('drawend', mostrar_vent_agregar);

}

function agregar(tipo){
	existe_capa_feature=false;
	map.getLayers().forEach(function(elm, i, arreglo){
			if(elm.get('title')=='capa_elementos_dibujados'){
				existe_capa_feature=true;
			}
		});

	if (existe_capa_feature==false){
		init();
	}
	map.addInteraction(modify);
	map.removeInteraction(draw2);
	addInteraction(tipo);
}

function mostrar_vent_agregar(){
    $('#modalAgregar').modal('show');
    $('.modal-backdrop').removeClass("modal-backdrop"); 
        body_modal= document.getElementById('modal_body_agregar');
        //body_modal.innerHTML=msg;
        //body_modal.innerHTML=texto_consulta;
        //body_modal.innerHTML=msg;
        //iframe_consulta= document.getElementById('iframe_consulta');
        //iframe_consulta.src=url;

}

var ultimoFeature;
function guardarInsercion(){
	$('#modalAgregar').modal('hide');

	featureDibujados= featureOverlay.getSource();
	featureDibujados.forEachFeature(
		function(feature){
     		ultimoFeature=feature;
    	}
	);
 	var coordinate = ultimoFeature.getGeometry().getCoordinates();
   	alert(coordinate);

   	if (tipo_geometria=='Point'){
   		var wkt='POINT('+coordinate[0]+' ' +coordinate[1]+')';
   	} else if (tipo_geometria=='LineString'){
   		var wkt = 'LINESTRING(';
   		for (var i=0; i<coordinate.length-1; i++){
   			wkt+=coordinate[i][0]+' '+ coordinate[i][1]+',';
   		}
   		wkt+= coordinate[i][0]+' '+coordinate[i][1]+')';
	}else{
		//es un poligono en la forma [ [ [lon,lat],[lon,lat],....] ]
		var wkt = 'POLYGON((';
		//var wkt = tipo_geometria+'((';
		for(var i=0;i<coordinate[0].length - 1;i++){
			wkt+=coordinate[0][i][0]+ ' ' + coordinate[0][i][1]+ ',';
		}
		wkt+=coordinate[0][0][0]+' '+coordinate[0][0][1]+'))'
	}
	alert(wkt);

	inputText_nombre= $("#inputText_nombre").val();
	inputText_tipo= $("#inputText_tipo").val();

	$.ajax({
        type: "GET",
        url: "php/insertarElemento.php",
        data: { 
        		capa: 'capadeusuario_'+tipo_geometria,
                nombreElemento: inputText_nombre,
                tipo: inputText_tipo,
                coordenadas: wkt
            }
    }).done(function( msg ) {
            alert( "Los datos que se recibieron: " + msg );
        
    });

}

function cancelarInsercion(){
	featureDibujados= featureOverlay.getSource();
	featureDibujados.forEachFeature(
		function(feature){
     		ultimoFeature=feature;
    	}
	);
	featureDibujados.removeFeature(ultimoFeature);
}