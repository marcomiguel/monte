<?php
namespace Rpp\Services\Get;
class Resultados
{
  private static $fechas_flags;
  private static $fechas;
  private static $match;
  private static $conf;
  private static $campeonato;
  private static $posiciones;
  private static $goleadores;

  public static function campeonato($torneo)
  {
    if(empty(static::$campeonato[$torneo]))static::$campeonato[$torneo] = json_decode(file_get_contents(static::get_conf()->bucket.$torneo.'/'.static::get_conf()->campeonato));
    else return static::$campeonato[$torneo];
    return static::$campeonato[$torneo];
  }

  public static function get_fechas_flags($torneo)
  {
    if(empty(static::$fechas_flags[$torneo]))static::$fechas_flags[$torneo] = json_decode(@file_get_contents(static::get_conf()->bucket.$torneo.'/'.static::get_conf()->fechas_flags),true);
    else return static::$fechas_flags[$torneo];

    if(!is_array(static::$fechas_flags[$torneo]))static::$fechas_flags[$torneo] = array();

    return static::$fechas_flags[$torneo];
  }

  public static function get_fecha($torneo)
  {
    if(empty(static::$fechas[$torneo]))static::$fechas[$torneo] = json_decode(file_get_contents(static::get_conf()->bucket.$torneo.'/'.static::get_conf()->fechas));
    else return static::$fechas[$torneo];
    return static::$fechas[$torneo];
  }

  public static function match($torneo,$id)
  {
     if(empty(static::$match[$id]))static::$match[$id] = json_decode(file_get_contents(static::get_conf()->bucket.$torneo.'/partidos/'.$id.'.json'),true);
     else return static::$match[$id];

     return static::$match[$id];
  }

  public static function posiciones($torneo)
  {
      if(empty(static::$posiciones[$torneo]))static::$posiciones[$torneo] = json_decode(file_get_contents(static::get_conf()->bucket.$torneo.'/'.static::get_conf()->posiciones));
      else return static::$posiciones[$torneo];

      return static::$posiciones[$torneo];
  }

  public static function goleadores($torneo)
  {
      if(empty(static::$goleadores[$torneo]))static::$goleadores[$torneo] = json_decode(file_get_contents(static::get_conf()->bucket.$torneo.'/'.static::get_conf()->goleadores));
      else return static::$goleadores[$torneo];

      return static::$goleadores[$torneo];
  }
  
  public static function get_conf()
  {
     if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/datafactory.ini");
     else return static::$conf;
  }
}
