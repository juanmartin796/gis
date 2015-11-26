/*function obtenerCapas(){
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
}*/
