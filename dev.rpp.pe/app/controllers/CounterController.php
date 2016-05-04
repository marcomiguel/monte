<?php
class CounterController extends ControllerBase
{
 public function visitAction()
 {
   $timestamp = time();
   $fecha_limite=$timestamp -(40*24*60*60);
   $multi = $this->redis->multi();
   $ref = 'unknown';
   if(!empty(@$_GET['ref'])) $ref = $_GET['ref'];

   $user = 'anonymous';
   if(!empty(@$_GET['cokkie_user'])) $user = $_GET['cokkie_user'];

   $site = 'missing';
   if(!empty(@$_GET['site'])) $site = $_GET['site'];
 
   if(!empty(@$_GET['nid']))
   {
    $nid = $_GET['nid'];
    $key="visitas:total:$nid";
    $value=$this->redis->incr($key);
    var_dump("|",$key);
    //$keybyhour="visitas:$nid:".date('Y:m:d:H');
    //$this->redis->setBit($keybyhour , $value , 1);
    //var_dump("|",$keybyhour);


    $multi->zIncrBy("$site:notas:views", 1 , $nid);


     /*---listado de notas vistas por usuario---*/
     $key = "$site:news:$user";
     $member =  "$nid:" . $timestamp ;
     
     $multi->zadd( $key, $timestamp , $member );
     var_dump("|",$key);   
     /***forzamos un tamaño fijo***/
     $multi->zRemRangeByScore($key, 0, $fecha_limite);
     /*****************************/

     /*---log general por usuario en linea de tiempo--- nota ---*/
     $log =  "site:$site:user:$user:articulo:$nid:time:$timestamp";
     $key =  "site:$site:user:log";
     $multi->lpush($key , $log );
     var_dump("|",$log);
   }

   /*----usuarios unico por hora-----*/
   if($user != 'anonymous')
   {
   	$cokkie_user = explode("_",$user);
   	if(count($cokkie_user)>1){
      $key = "$site:brw:".date('Y:m:d:H');
      $multi->setbit( $key , $cokkie_user[1] , 1 ) ;
      var_dump($key,$cokkie_user[1]);
   	}
   }
   
   if(!empty(@$_GET['portada']))
   {
   	$portada = $_GET['portada'];
   	$key =  "$site:secciones:$user" ;
   	$member =  "$portada:$timestamp";

   	$multi->zadd($key,$timestamp,$member);
   	var_dump("|",$key);

     /***forzamos un tamaño fijo***/
     $multi->zRemRangeByScore($key, 0, $fecha_limite);
     /*****************************/

    /*---log general por usuario en linea de tiempo--- portada-secciones ---*/
    $log =  "site:$site:user:$user:portada:$portada:time:$timestamp";
    $key =  "site:$site:user:log";
    $multi->lpush($key ,$log );
    var_dump("|",$log);
   }

   if(!empty(@$_GET['tema']))
   {
   	$tema = $_GET['tema'];
   	$key =  "$site:temas:$user" ;
   	$member =  "$tema:$timestamp";

   	$multi->zadd($key,$timestamp,$member);
   	var_dump("|",$key);

     /***forzamos un tamaño fijo***/
     $multi->zRemRangeByScore($key, 0, $fecha_limite);
     /*****************************/

    /*---log general por usuario en linea de tiempo--- temas ---*/
    $log =  "site:$site:user:$user:tema:$tema:time:$timestamp";
    $key =  "site:$site:user:log";
    $multi->lpush($key ,$log );
    var_dump("|",$log);
   }

   $multi->exec();

   //var_dump($multi);
 }
}

