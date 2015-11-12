<?php 
include('connect_db.php');
    conectar_db();
    consulta_sql($_POST["nom_capa"], $_POST["coordX"], $_POST["coordY"] );
?>