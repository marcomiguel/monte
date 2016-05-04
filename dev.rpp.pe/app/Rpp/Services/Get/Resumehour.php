<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;
class Resumehour
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $last;
  public static $conf;
  public static function get_repositorio()
  {
    if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Resumeh());
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function last()
  {
    if(empty(static::$last)) static::$last = Cache::request()->get('portada.resumen.hora');
    else return static::$last;

    if(Cache::request()->exists('portada.resumen.hora'))return static::$last;
    else
    {
      static::$last = @static::get_pattern()->load();
      if(empty(static::$last)) static::$last = array();

      static::setting_cache();
    }
    return static::$last;
  }

    public static function get_conf()
    {
     if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/media.ini");
     else return static::$conf;
    }

  public static function setting_cache()
  {
    Cache::request()->save(
                           'portada.resumen.hora',
                           static::$last ,
                           //60*10
                           5
                          );
  }
 
}