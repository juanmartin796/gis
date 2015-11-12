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

	function consulta_sql(){
		//$db= conectar_db();
		GLOBAL $db;
			$result = pg_query($db, "SELECT * FROM actividades_agropecuarias");
		if (!$result) {
		  echo "An error occurred.\n";
		  exit;
		}

		$long= pg_num_rows($result);
		echo 'Cantidad de registros: '.$long."<br />\n";
		
		while ($row = pg_fetch_row($result)) {

		  echo "Author: $row[0]";
		  echo "<br />\n";
		}
	}
?>
