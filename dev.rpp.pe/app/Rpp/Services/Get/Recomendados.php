<?php
namespace Rpp\Services\Get;
use \Shared\Cache;
use \Shared\MQ;
class Recomendados
{

   public static function load($user)
   {
      if(is_null($user)) return array();
   	  $destacados= Cache::request()->get('analitica.recomendadas.'.$user);
   	  if(!is_array($destacados)) $destacados = array();
      else unset($destacados[0]);
   	  return $destacados;
   }

   public static function rebuild($user)
   {
   	 if(empty(Cache::request()->get('analitica.recomendadas.rebuild.'.$user)))
   	 {
       if(Cache::request()->status_connect()) 
       {
         Cache::request()->save(
		                           'analitica.recomendadas.rebuild'.$user,
		                            true,
		                            Cache::get_conf()->cache_time->analitica_user_recomendados_rebuild
	                           );
         
         MQ::send_message(MQ::get_conf()->colas->analitica_recomendadas,array("user" => $user ));
       }else return false;
   	 }
     return true; 
   }

   public static function send_rebuild($user)
   {
      MQ::send_message(MQ::get_conf()->colas->analitica_recomendadas,array("user" => $user ));
   }
}