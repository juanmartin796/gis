var parser = new ol.format.WMSCapabilities();

$.ajax('http://localhost/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&MAP=/home/juanmartin/GIS/Proyectos%20QGis/TPI.qgs&REQUEST=GetCapabilities').then(function(response) {
  var result = parser.read(response);
  //$('#log').html(window.JSON.stringify(result, null, 2));

  var capability = result.Capability.Layer.Layer;
  var capas=[];
  //$('#log').html(window.JSON.stringify(capability, null, 2));
  for(var i = 0; i < capability.length; i ++){
                alert(capability[i].Name);
                capas.push(new ol.layer.Image({//objeto capa de tipo Imagen (1 sola imagen)
                        title: capability[i].Title,
                        source: new ol.source.ImageWMS({//fuente de datos (ImageWMS)
                        url: '/cgi-bin/qgis_mapserv.fcgi?map=/home/juanmartin/GIS/Proyectos QGis/TPI.qgs',
                        params: {LAYERS: capability[i].Name}//por defecto version WMS = 1.3.0
                    })
                }));
                
            }
});

    
alert("hola");