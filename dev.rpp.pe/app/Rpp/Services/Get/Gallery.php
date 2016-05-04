<?php
namespace Rpp\Services\Get;
use \Shared\Cache;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
class Gallery
{
  private static $pattern_builder;
  public static $pattern;
  public static $flow;
  
  public static function get_repositorio($Pattern='homegallery')
  {
  	if(empty(static::$pattern_builder[$Pattern])) return static::$pattern_builder[$Pattern] = new SearchPatternBuilder( PatternFactoryGallery::$Pattern() );
    return static::$pattern_builder[$Pattern];
  }

  public static function get_pattern($Pattern='homegallery')
  {
  	if(empty(static::$pattern[$Pattern])) return static::$pattern[$Pattern] = static::get_repositorio($Pattern)->addFields(array("_id"))->build();
    return static::$pattern[$Pattern];
  }

  public static function home($limit=10,$init=0)
  {
    if(empty(static::$flow['homegallery']) ) static::$flow['homegallery'] = Cache::request()->get(Cache::get_conf()->cache_prefix->homegallery);
    else return  array_slice(static::$flow['homegallery'],$init,$limit)  ; 
    if(empty( static::$flow['homegallery'])){
  	 static::$flow['homegallery'] = static::get_pattern()->set_filter(array('tipo'=>'galeria'))->load();
     static::setting_cache('homegallery');
    }
    return array_slice(static::$flow['homegallery'],$init,$limit);
  }

  public static function setting_cache($pattern,$slug=false)
  {
  	if($slug)Cache::request()->save(
                         Cache::get_conf()->cache_prefix->{$pattern}.$slug,
    	                   static::$flow[$pattern][$slug],
    	                   Cache::get_conf()->cache_time->{$pattern}
    	                  );
  	else Cache::request()->save(
                         Cache::get_conf()->cache_prefix->{$pattern},
    	                   static::$flow[$pattern],
    	                   Cache::get_conf()->cache_time->{$pattern}
    	                  );
  }
  
  public static function unset_home($nid)
  {
      static::home();
      array_walk(static::$flow['home.gallery'], function ($k,$e) use ($nid) {
              if($k->_id==$nid) unset(static::$flow['home.gallery'][$e]);
            });
 
  }

}

class PatternFactoryGallery
{
     public static  function homegallery()
     {
     	return new \Rpp\Repositorio\Builder\Search\Pattern\Home();
     }

     public static function seccion()
     {
        return new \Rpp\Repositorio\Builder\Search\Pattern\Seccion();
     }

     public static function Tag()
     {
        return new \Rpp\Repositorio\Builder\Search\Pattern\Tag();
     }
} 