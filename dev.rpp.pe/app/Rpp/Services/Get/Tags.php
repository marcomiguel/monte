<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache;
class Tags
{
  private static $pattern_builder;
  public static $pattern;
  public static $cache ;
  public static $tags;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder( new \Rpp\Repositorio\Builder\Search\Pattern\Tags());
    return static::$pattern_builder;
  }

  public static function get_pattern()
  {
  if(empty(static::$pattern)) static::$pattern =  static::get_repositorio()->build();
  return static::$pattern;
  }

  public static function get_tag($slug)
  {
    if(empty(static::$tags[$slug])) static::$tags[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->tags_info.$slug);
    else return static::$tags[$slug];
    if(Cache::request()->exists(Cache::get_conf()->cache_prefix->tags_info.$slug))return static::$tags[$slug];
    else
    {
      static::$tags[$slug] = @static::get_pattern()->set_slug($slug)->load();
      if(empty(static::$tags[$slug])) static::$tags[$slug] = null;
      
      static::setting_cache($slug);
    }
    return static::$tags[$slug];
  }


  public static function setting_cache($slug)
  {
    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->tags_info.$slug,
                           static::$tags[$slug],
                           Cache::get_conf()->cache_time->tags_info
                          );
  }
 

}