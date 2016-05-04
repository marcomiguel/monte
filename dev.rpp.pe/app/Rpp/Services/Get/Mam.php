<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;
class Mam
{
  public static $incidencias;
  public static function incidencias($id_mam)
  {
    if(empty(static::$incidencias[$id_mam])) static::$incidencias[$id_mam] = static::load_incidencias($id_mam);
    else return static::$incidencias[$id_mam];

    if(empty(static::$incidencias[$id_mam])) static::$incidencias[$id_mam] = array();
     
    return static::$incidencias[$id_mam];
  }

  public static function load_incidencias($id_mam)
  {
     return json_decode(@file_get_contents(\Rpp\Services\Get\UrlMedia::get_conf()->endpoint->raiz."mam/$id_mam.json"));
  }

}