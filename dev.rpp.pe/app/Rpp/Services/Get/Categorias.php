<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;
class Categorias 
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $categoria;
  public static $arbol;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Categorias());
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function get_categoria($slug)
  {
    if(empty(static::$categoria[$slug])) static::$categoria[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->categorias_info.'categoria.'.$slug);
    else return static::$categoria[$slug];

    if(Cache::request()->exists(Cache::get_conf()->cache_prefix->categorias_info.'categoria.'.$slug))return static::$categoria[$slug];
    else
    {
      static::$categoria[$slug] = @static::get_pattern()->set_slug($slug)->set_limit(1)->set_fields(array('seccion','nombre', 'parent_slug' , 'alias' , 'autor'))->load();
      if(is_array(static::$categoria[$slug])) static::$categoria[$slug] = static::$categoria[$slug][0];
      else static::$categoria[$slug] = null;
      static::setting_cache($slug);
    }
    return static::$categoria[$slug];
  }

  public static function get_categoria_arbol($slug)
  {
    if(empty(static::$arbol[$slug])) static::$arbol[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->categorias_info.'arbol.'.$slug);
    else return static::$arbol[$slug];
    if(Cache::request()->exists(Cache::get_conf()->cache_prefix->categorias_info.'arbol.'.$slug))return static::$arbol[$slug];
    else
    {
      static::$arbol[$slug] = @static::get_pattern()->set_slug($slug)->set_filter(array('peso' => array( '$gt' => 0 ) ))->set_limit(false)->set_fields(array('nombre','path','alias'))->load();
      if(empty(static::$arbol[$slug])) static::$arbol[$slug] = null;
      static::setting_cache($slug,'arbol');
    }
    return static::$arbol[$slug];
  }

  public static function setting_cache($slug,$tipo='categoria')
  {
    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->categorias_info.$tipo.'.'.$slug ,
                           static::${$tipo}[$slug] ,
                           Cache::get_conf()->cache_time->categorias_info
                          );
  }
 
}