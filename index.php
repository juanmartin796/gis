<!DOCTYPE html>
<html lang="es">
<head>
	<link rel="stylesheet" href="lib/ol3/css/ol.css" type="text/css">
	<style>
		#map {
			height: 500px;
			width: 100%;
		}
	</style>
	<script src="lib/ol3/build/ol.js" type="text/javascript"></script>


	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>web GIS</title>
	<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.css">


	<link rel="stylesheet" href="CSS/estilos.css">


	<script src="lib/jquery-1.11.3.js"></script>

	<script src="js/obtenerCapas.js" type="text/javascript"></script>
	<script src="js/mapa.js" type="text/javascript"></script>
	<script src="js/medicion.js" type="text/javascript"></script>
	<script src="js/agregar_elementos.js" type="text/javascript"></script>
	<?php include (php/'connect_db.php') ?>
</head>
<body>
	<div class="container-fluid well" style="margin-bottom: 0px">
		<div class="container">
			<div class="row" style="display: flex; align-items: flex-end;">
				<div class="col-xs-11">
					<ul class="nav nav-pills">
						<li class="dropdown pestana">
							<a class="dropdown-toggle  btn btn-default btn-lg" title="Capas" data-toggle="dropdown" href="#">
								<span class="glyphicon glyphicon-align-justify" aria-hidden="true"> <b classhandleMeasurements="caret"></b>
								</a>
								<ul class="dropdown-menu">
									<script type="text/javascript">
										crear_checkbox_capas();
									</script>
								</ul>
							</li>
							<li id="li_navegacion" class="active pestana">
								<a class=" btn btn-default btn-lg" title="navegacion" href="#" onclick="javascript:control_consulta_navegacion(this)">
									<span class="glyphicon glyphicon-move" aria-hidden="true"></span> 
								</a>
							</li>
							<li id="li_consulta" class="pestana">
								<a class=" btn btn-default btn-lg" title="consulta" href="#" onclick="javascript:control_consulta_navegacion(this)">
									<span class="glyphicon glyphicon-info-sign" aria-hidden="true">
									</a>
								</li>
								<li class="pestana">
									<a style="padding-bottom: 5px; padding-top: 8px; padding-left: 12px; padding-right: 12px" class=" btn btn-default btn-lg" title="medicion" href="#" onclick="javascript:control_consulta_navegacion(this)">

										<svg style="position: absolute; width: 0; height: 0;" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
											<defs>
												<symbol id="icon-ruler" viewBox="0 0 1024 1024">
													<title>ruler</title>
													<path class="path1" d="M736.736 928.192v-64.928h-32.416v64.928h-32.448v-64.928h-32.512v64.928h-30.432v-97.376h-32.448v97.376h-32.448v-64.928h-32.448v64.928h-30.432v-64.928h-32.448v64.928h-32.48v-97.376h-32.448v97.376h-32.448v-64.928h-30.368v64.928h-32.448v-64.928h-32.48v64.928h-32.416v-97.376h-30.432v97.376h-97.344v-800.352l800.352 800.352h-159.456zM223.616 434.688v363.68h363.648l-363.648-363.68z"></path>
												</symbol>
											</defs>
										</svg>
										<svg class="icon icon-ruler">
											<use xlink:href="#icon-ruler"></use>
										</svg>
										<span class="mls"></span>

										<!-- Medicion -->
									</a>
								</li>
								<li class="dropdown pestana">
									<a class="dropdown-toggle  btn btn-default btn-lg" title="agregar" data-toggle="dropdown" href="#">
										<span class="glyphicon glyphicon-plus" aria-hidden="true"> <b classhandleMeasurements="caret"></b>
										</a>
										<ul class="dropdown-menu">
											<li value="Point"> <a href="#" onclick="agregarElementosCapa('Point')"> <span class="glyphicon glyphicon-record"></span> Punto </a> </li>
											<li value="LineString"><a href="#" onclick="agregarElementosCapa('LineString')"><span class="glyphicon glyphicon-menu-left"></span> Polilinea </a> </li>
											<li value="Polygon"> <a href="#" onclick="agregarElementosCapa('Polygon')"> <span class="glyphicon glyphicon-triangle-top"></span>Poligono </a> </li>
										</ul>
									</li>
								</ul>
					<script type="text/javascript"> //para que cambie de color el tab seleccionado
						$(".nav a").on("click", function(){
				            //$(".nav").find(".active").removeClass("active");
				            $(".nav").find(".pestana").removeClass("active");
				            $(this).parent().addClass("active");
				        });

						//para que cambie el color de la capa que se encuentra activa
						$(".dropdown-menu li").on("click", function(){
							capa_activa= $(this).attr('value');
				        	//alert(capa_activa);
				        	$(".dropdown-menu").find(".active").removeClass("active");
				        	$(this).addClass("active");
				        });
					</script>
				</div>
				<div class="col-xs-1">
					<!-- <img src="img/logo_gis.png" width="70px" height="70px"> -->
					<img src="http://www.carthago.nl/__miracle/img/GIS%20Logo14.png" width="100px" height="70px">
				</div>
			</div>
		</div>
	</div>
	<div class="container">
		<!-- DIV que contiene el mapa -->
		<div id="map"></div>
	</div>

	<script type="text/javascript"> 
		dibujarCapas()
		act_des_capas();
	</script>
	
	<!-- Ventana Modal de respuesta a la consulta -->
	<div class="modal fade modal-wide" id="modalConsulta" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<!-- <h4 class="modal-title" id="myModalLabel">Capa</h4> -->

					<div class="form-group">
						<label for="sel1">Capa:</label>
						<select class="selectpicker" id="lista_capas">
		    <!-- <option>Mustard</option>
		    <option>Ketchup</option> -->
						</select>
					</div>
					<script type="text/javascript">
						$('.selectpicker').on('change', function(){
							var selected = $(this).find("option:selected").val();
							    //alert(selected);
							    refrescar_vent_modal(selected);
							});
					</script>

				</div>
				<div class="modal-body" id="modal-body">
					...
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
					<button type="button" class="btn btn-primary">Guardar</button>
				</div>
			</div>
		</div>
	</div>

	
	<!-- Ventana Modal para cargar los atributos del elemento a agregar -->
	<div class="modal fade modal-wide" id="modalAgregar" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="false">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
		
				<div class="modal-body" id="modal_body_agregar">
					<form class="form-horizontal" role="form">
						  <div class="form-group">
						    <label class="control-label col-sm-2" for="email">Nombre:</label>
						    <div class="col-sm-10">
						      <input type="text" class="form-control" id="text" placeholder="Ingrese nombre">
						    </div>
						  </div>
						  <div class="form-group">
						    <label class="control-label col-sm-2" for="pwd">Tipo:</label>
						    <div class="col-sm-10">
						      <input type="text" class="form-control" id="tipo" placeholder="Ingrese tipo">
						    </div>
						  </div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
					<button type="button" class="btn btn-primary">Guardar</button>
				</div>
			</div>
		</div>
	</div>

<!--<script type="text/javascript" src="js/capas.js"></script> -->
<script type="text/javascript" src="lib/bootstrap/js/bootstrap.js"></script>
</body>
</html>