<?php
namespace Rpp\Services\Get;
use Rpp\Destacados\Portada;
use \Shared\Cache;
class Destacados
{
  public static $pattern_builder;
  public static $meta_pattern_builder;
  public  static $pattern;
  public  static $destacados;
  public static $metadata;
  public  static $size;
  public  static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new Portada();
    return static::$pattern_builder;
  }

  public static function get_repositorio_meta()
  {
    if(empty(static::$meta_pattern_builder)) return static::$meta_pattern_builder =  new Portada();
    return static::$meta_pattern_builder;
  }

  public static function portada($slug='home')
  {
  	 if(!isset(static::$destacados[$slug]))static::$destacados[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->destacados.$slug);
     else return static::$destacados[$slug] ;

     static::$size[$slug]  = count(@static::$destacados[$slug]->destacadas );
     if(Cache::request()->exists(Cache::get_conf()->cache_prefix->destacados.$slug)) return static::$destacados[$slug];
     else{
     	static::$destacados[$slug] = @static::get_repositorio()->addFilter(array('_id' => SITESLUG.DIRS.$slug))->load();
     	if(empty(static::$destacados[$slug])) static::$destacados[$slug] = array();
      static::$size[$slug]  = count(@static::$destacados[$slug]->destacadas);
     	static::setting_cache($slug);
     }
     
     return static::$destacados[$slug];

  }

  public static function metadata($slug='home')
  {
     if(!isset(static::$metadata[$slug]))static::$metadata[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->destacados.'metadata.'.$slug);
     else return static::$metadata[$slug] ;
     
     if(Cache::request()->exists(Cache::get_conf()->cache_prefix->destacados.'metadata.'.$slug)) return static::$metadata[$slug];
     else{
      static::$metadata[$slug] = @static::get_repositorio_meta()->addFields(array( "titulo" , "descripcion" , "tags"))->addFilter(array('_id' => SITESLUG.DIRS.$slug))->load();
      if(empty(static::$metadata[$slug])) static::$metadata[$slug] = array();
          Cache::request()->save(
                           Cache::get_conf()->cache_prefix->destacados.'metadata.'.$slug,
                           static::$metadata[$slug],
                           Cache::get_conf()->cache_time->destacados
                          );
     }
     return static::$metadata[$slug];
  }
  
  public static function set_portada($slug,$obj)
  {
    static::$destacados[$slug] = $obj;
  }

  public static function delete($slug,$e)
  {
    unset(static::$destacados[$slug]->destacadas[$e]);
  }

  public static function setting_cache($slug)
  {
    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->destacados.$slug,
                           static::$destacados[$slug],
                           Cache::get_conf()->cache_time->destacados
                          );
  }
}