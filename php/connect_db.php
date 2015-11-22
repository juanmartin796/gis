<?php
	$db;

	function conectar_db(){
	   $host        = "host=localhost";
    	//$host 		= "host=". $_SERVER['HTTP_HOST'];
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
		//echo "$nom_campos";
		//echo 'Cantidad de registros: '.$num_registros.", campos: ".$num_campos."\n";
		
		while ($row = pg_fetch_row($result)) {
			for ($i=0; $i<$num_campos-1;$i++){
				$nom_campos= pg_field_name($result,$i);
				echo '<div class="row">';

				echo '<div class="col-xs-2 text-right" style="padding-right: 0px">';
				echo "<b> $nom_campos: </b>";
				echo '</div>';
				echo '<div class="col-xs-4" style="padding-left: 8px">';
				echo $row[$i];
				echo '</div>';

				$i++;
				$nom_campos= pg_field_name($result,$i);
				if ($nom_campos!='geom'){
					echo '<div class="col-xs-2 text-right" style="padding-right: 0px">';
				echo "<b> $nom_campos: </b>";
				echo '</div>';
				echo '<div class="col-xs-4" style="padding-left: 8px">';
				echo $row[$i];
				echo '</div>';

				echo '</div>';
				}
			}
		}
	}

	function consulta_por_rectangulo($tabla, $wkt){
		GLOBAL $db;
			$result = pg_query($db,"
				SELECT * FROM $tabla 
				WHERE 
					st_intersects(
					ST_geomfromtext('$wkt',4326),
					geom
					)
				");
		if (!$result) {
		  echo "An error occurred.\n";
		  exit;
		}

		$nro_campos = pg_num_fields($result);
		$nro_registros = pg_num_rows($result);

		$header = '<tr>';
		while ($i < $nro_campos) { 
			$fieldName = pg_field_name($result, $i); 
			
			if($fieldName!='geom'){
				$header.= '<th>' . $fieldName .'</td>'; 
			}
			$i++; 
			
		}
		$header .= '</tr>';

		$cuerpo='';
		while ($row = pg_fetch_row($result)) { 
			$cuerpo.= '<tr>'; 
			$count = count($row); 
			$i=0;
			while ($i < $nro_campos) {
				 if(pg_field_name($result, $i)!='geom'){
					 $cuerpo.= '<td>' . $row[$i] . '</td>';
				}
				$i++;
			}
			$cuerpo.= '</tr>';
		}
		echo '<div class="">';
		echo '<table class="table">';
			echo "<thead>";
				echo $header;
			echo "</thead>";
			echo "<tdoby>";
				echo $cuerpo;
			echo "</tbody>";
		echo "</table>";
		echo '</div>' ;
	}
?>
