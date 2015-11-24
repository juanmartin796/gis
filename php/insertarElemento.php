<?php

	$capa= $_GET['capa'];;
	$nombreElemento = $_GET['nombreElemento'];
	$tipo = $_GET['tipo'];
	$coordenadas = $_GET['coordenadas'];

		
	$usuario = "gis_user";
	$contrasenia = "gis_user";
	$dbname = "gis_db";
	$port = "5432";
	$host = "localhost";

	$cadenaConexion = "host=$host port=$port dbname=$dbname user=$usuario password=$contrasenia";

	$conexion = pg_connect($cadenaConexion) or die("Error en la Conexión: ".pg_last_error());
	echo "<h3>Conexion Exitosa PHP - PostgreSQL</h3><hr><br>";

	$query = "insert into $capa (nombre, tipo, geom) values ('$nombreElemento','$tipo',  ST_geomfromtext('$coordenadas', 4326))";

	$resultado = pg_query($conexion, $query) or die("Error en la Consulta SQL");

	if ($resultado) {
		echo "Registro guardado con exito!";
	}		

	pg_close($conexion);
?>
