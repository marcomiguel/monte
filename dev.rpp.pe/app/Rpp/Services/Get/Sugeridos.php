<?php
namespace Rpp\Services\Get;
use \Shared\Cache;
use \Shared\MQ;
class Sugeridos
{

   public static $user;
   public static function load($user)
   {
      static::$user = $user;
   	  static::rebuild($user);
   }

   public static function rebuild($user)
   {
   	 if(empty(Cache::request()->get('analitica.sugerido.rebuild'.$user)))
   	 {
       if(Cache::request()->status_connect()) 
       {
         Cache::request()->save(
		                           'analitica.sugerido.rebuild'.$user,
		                            true,
		                            Cache::get_conf()->cache_time->analitica_user_sugeridos_rebuild
	                           );
         
         MQ::send_message(MQ::get_conf()->colas->analitica_sugeridos,array("user" => $user ));
       }else return false;
   	 }
     return true; 
   }

   public static function get_tag($slug)
   {
     $lista=Cache::request()->get('analitica.sugeridos.tag.'.$slug.'-'.static::$user);
     if(!is_array($lista)) $lista = array();
     return $lista;
   }

   public static function get_seccion($slug)
   {
      $lista=Cache::request()->get('analitica.sugeridos.seccion.'.$slug.'-'.static::$user);
      if(!is_array($lista)) $lista = array();
      return $lista;
   }
}