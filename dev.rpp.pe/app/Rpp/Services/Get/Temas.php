<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;

class Temas
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $temas;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Ptemas());
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function get_temas()
  {
    if(empty(static::$temas)) static::$temas = Cache::request()->get('portada.lista.temas');
    else return static::$temas;

    if(Cache::request()->exists('portada.lista.temas'))return static::$temas;
    else
    {
      static::$temas = @static::get_pattern()->load();
      if(empty(static::$temas)) static::$temas = static::$temas;

      static::setting_cache();
    }
    return static::$temas;
  }


  public static function setting_cache()
  {
    Cache::request()->save(
                           'portada.lista.temas',
                           static::$temas ,
                           18000
                          );
  }
 
}