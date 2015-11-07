function obtenerCapas(){
	var capas=[];

	var parser = new ol.format.WMSCapabilities();
	$.ajax({async:false, 
		url:'http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&MAP=/var/www/html/webgis/TPI.qgs&REQUEST=GetCapabilities'}).then(function(response) {
			var result = parser.read(response);
  //$('#log').html(window.JSON.stringify(result, null, 2));

  var capability = result.Capability.Layer.Layer;
  //$('#log').html(window.JSON.stringify(capability, null, 2));
  for(var i = 0; i < capability.length; i ++){
  	capas.push(capability[i].Name);
  }
  
});
		return capas;
	}