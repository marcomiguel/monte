<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;
class Elecciones
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $sondeos;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Sondeos() );
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function get($fecha)
  {
    if(empty(static::$sondeos[$fecha])) static::$sondeos[$fecha] = Cache::request()->get('sondeos.elecciones.'.$fecha);
    else return static::$sondeos[$fecha];

    if(Cache::request()->exists('sondeos.elecciones.'.$fecha))return static::$sondeos[$fecha];
    else
    {
      static::$sondeos[$fecha] = @static::get_pattern()->set_filter( array('_id' =>  $fecha) )->load();
      if(empty(static::$sondeos[$fecha])) static::$sondeos[$fecha] = null ;
      static::setting_cache($fecha);
    }
    return static::$sondeos[$fecha];
  }

  public static function setting_cache($fecha)
  {
    Cache::request()->save(
                          'sondeos.elecciones.'.$fecha,
                           static::$sondeos[$fecha] ,
                           60*60*24*7
                          );
  }
 
}