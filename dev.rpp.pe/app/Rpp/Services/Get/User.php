<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;

class User
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $user;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Usuario());
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function get($slug)
  {
    if(empty(static::$user[$slug])) static::$user[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->user_info.$slug);
    else return static::$user[$slug];
    if(Cache::request()->exists(Cache::get_conf()->cache_prefix->user_info.$slug))return static::$user[$slug];
    else
    {
      static::$user[$slug] = @static::get_pattern()->set_slug($slug)->load();
      if(empty(static::$user[$slug])) static::$user[$slug] = null;
      static::setting_cache($slug);
    }
    return static::$user[$slug];
  }

  public static function setting_cache($slug)
  {
    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->user_info.$slug,
                           static::$user[$slug],
                           Cache::get_conf()->cache_time->user_info
                          );
  }
 

}