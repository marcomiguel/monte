<?php
namespace Rpp\Services\Get;
use \Shared\Cache;
class Visitas 
{

  public static $ranking;
  private static $visitas_builder;
  public static function get_repositorio()
  {
  	if(empty(static::$visitas_builder)) return static::$visitas_builder =  new \Rpp\Analytics\MasVisitadas();
    return static::$visitas_builder;
  }

  public static	function ranking($slug='home',$limit=5,$init=0)
  {
    if(empty(static::$ranking[$slug])) static::$ranking[$slug] = Cache::request()->get(Cache::get_conf()->cache_prefix->visitas.$slug); 
    else array_slice(static::$ranking[$slug],$init,$limit);

    if(empty(static::$ranking[$slug]))
    {
       static::$ranking[$slug] = @static::get_repositorio()->addFilter(array('_id' => SITESLUG.DIRS.$slug))->load()->lista ;
       if(!is_array(static::$ranking[$slug]))static::$ranking[$slug] = array();
       static::setting_cache($slug);
    }

    return  array_slice(static::$ranking[$slug],$init,$limit);
  }

  public static function setting_cache($slug)
  {
  	    Cache::request()->save(
                           Cache::get_conf()->cache_prefix->visitas.$slug,
                           static::$ranking[$slug],
                           Cache::get_conf()->cache_time->visitas
                          );
  }

}
