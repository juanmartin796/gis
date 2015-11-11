var draw;
var vector;
var measureTooltip;
  var helpTooltip;
function medir_distancia(){
    var wgs84Sphere = new ol.Sphere(6378137);


    var source = new ol.source.Vector();
    vector = new ol.layer.Vector({
        title:"lineas_medicion",
        source: source,
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

    map.addLayer(vector);


    /**
     * Currently drawn feature.
     * @type {ol.Feature}
     */
     var sketch;


    /**
     * The help tooltip element.
     * @type {Element}
     */
     var helpTooltipElement;


    /**
     * Overlay to show the help messages.
     * @type {ol.Overlay}
     */
   


    /**
     * The measure tooltip element.
     * @type {Element}
     */
     var measureTooltipElement;


    /**
     * Overlay to show the measurement.
     * @type {ol.Overlay}
     */
     


    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
     var continuePolygonMsg = 'Click para seguir dibujando el poligono';


    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
     var continueLineMsg = 'Click para seguir dibujando la linea a medir';


    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
     var pointerMoveHandler = function(evt) {
      if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click para empezar a dibujar la linea';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
          helpMsg = continuePolygonMsg;
      } else if (geom instanceof ol.geom.LineString) {
          helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    $(helpTooltipElement).removeClass('hidden');
    };

    //map.on('pointermove', pointerMoveHandler);

    $(map.getViewport()).on('mouseout', function() {
      $(helpTooltipElement).addClass('hidden');
    });

     // global so we can remove it later
    function addInteraction() {
      //var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
      var type = ("Lenght" == 'area' ? 'Polygon' : 'LineString');
      draw = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (type),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
        }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
          }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    });
      //map.addInteraction(draw);

      createMeasureTooltip();
      createHelpTooltip();

      var listener;
      draw.on('drawstart',
          function(evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function(evt) {
              var geom = evt.target;
              var output;
              if (geom instanceof ol.geom.Polygon) {
                output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength( /** @type {ol.geom.LineString} */ (geom));
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
        }, this);

      draw.on('drawend',
          function(evt) {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
        }, this);
    }


    /**
     * Creates a new help tooltip
     */
     function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
    }


    /**
     * Creates a new measure tooltip
     */
     function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
    }


    /**
     * Let user change the geometry type.
     * @param {Event} e Change event.
     */
   


    /**
     * format length output
     * @param {ol.geom.LineString} line
     * @return {string}
     */
     var formatLength = function(line) {
      var length;
        var coordinates = line.getCoordinates();
        length = 0;
        var sourceProj = map.getView().getProjection();
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
          var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
          var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
          length += wgs84Sphere.haversineDistance(c1, c2);
      
    }
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
    };

    addInteraction();

}
