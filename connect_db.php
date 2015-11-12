<?php
	$db;

	function conectar_db(){

	   $host        = "host=localhost";
	   $port        = "port=5432";
	   $dbname      = "dbname=gis_db";
	   $credentials = "user=gis_user password=gis_user";

	   GLOBAL $db;
	   $db = pg_connect( "$host $port $dbname $credentials"  );
	   if(!$db){
	      echo "Error : Unable to open database\n";
	   } else {
	   	return $db;
	      echo "Opened database successfully\n";
	   }
	}

	function consulta_sql($tabla, $coordX, $coordY){
		//$db= conectar_db();
		GLOBAL $db;
			$result = pg_query($db,"
				SELECT *
				FROM $tabla
				WHERE ST_Intersects(geom, ST_GeomFromText('POINT($coordX $coordY)',4326));
				");
		if (!$result) {
		  echo "An error occurred.\n";
		  exit;
		}

		$num_registros= pg_num_rows($result);
		$num_campos= pg_num_fields($result);
		echo 'Cantidad de registros: '.$num_registros.", campos: ".$num_campos."\n";
		
		while ($row = pg_fetch_row($result)) {
			for ($i=0; $i<$num_campos-1;$i++){
				 echo "Author: $row[$i]";
				 echo "\n";
			}
		}
	}
?>
