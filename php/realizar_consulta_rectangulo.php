<?php 
include('connect_db.php');
    conectar_db();
    consulta_por_rectangulo($_POST["nom_capa"], $_POST["wkt"]);
?>