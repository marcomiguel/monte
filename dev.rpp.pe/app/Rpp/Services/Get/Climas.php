<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;
class Climas
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $clima;
  public static $portada;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Weather());
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function get($slug)
  {
    if(empty(static::$clima[$slug])) static::$clima[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->climas.$slug);
    else return static::$clima[$slug];

    if(Cache::request()->exists(Cache::get_conf()->cache_prefix->climas.$slug))return static::$clima[$slug];
    else
    {
      static::$clima[$slug] = @static::get_pattern()->set_filter( array('_id' => $slug) )->load();
      if(!empty(static::$clima[$slug])) static::$clima[$slug] = static::$clima[$slug];
      else static::$clima[$slug] = null;
      static::setting_cache($slug);
    }
    return static::$clima[$slug];
  }

  public static function portada($slug)
  {
    if(empty(static::$portada[$slug])) static::$portada[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->climas.'portada.'.$slug);
    else return static::$portada[$slug];

    if(Cache::request()->exists(Cache::get_conf()->cache_prefix->climas.'portada.'.$slug))return static::$portada[$slug];
    else
    {
      static::$portada[$slug] = @static::get_pattern()->set_filter( array('_id' => $slug) )->set_fields(array('item.condition', 'item.forecast'))->load();
      if(empty(static::$portada[$slug])) static::$portada[$slug] = null;

      Cache::request()->save(
                           Cache::get_conf()->cache_prefix->climas.'portada.'.$slug ,
                           static::$portada[$slug] ,
                           Cache::get_conf()->cache_time->climas
                          );

    }
    return static::$portada[$slug];
  }

  public static function setting_cache($slug)
  {
    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->climas.$slug ,
                           static::$clima[$slug] ,
                           Cache::get_conf()->cache_time->climas
                          );
  }
 
}