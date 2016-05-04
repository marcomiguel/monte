<?php
namespace Rpp\Services\Get;
use \Shared\Cache;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
class Instantarticle
{
  private static $pattern_builder;
  public static $pattern;
  public static $flow;
  
  public static function get_repositorio($Pattern='iarticle')
  {
  	if(empty(static::$pattern_builder[$Pattern])) return static::$pattern_builder[$Pattern] = new SearchPatternBuilder( PatternFactoryIA::$Pattern() );
    return static::$pattern_builder[$Pattern];
  }

  public static function get_pattern($Pattern='iarticle')
  {
  	if(empty(static::$pattern[$Pattern])) return static::$pattern[$Pattern] = static::get_repositorio($Pattern)->addFields(array("_id"))->build();
    return static::$pattern[$Pattern];
  }

  public static function get_patternupd($Pattern='iarticleupd')
  {
    if(empty(static::$pattern[$Pattern])) return static::$pattern[$Pattern] = static::get_repositorio($Pattern)->addSort(array("last_modified" => -1))->addFields(array("_id"))->build();
    return static::$pattern[$Pattern];
  }

  public static function flow($limit=50,$init=0)
  {

    if( empty(static::$flow['iarticle']) ) static::$flow['iarticle'] = Cache::request()->get(Cache::get_conf()->cache_prefix->iarticle);
    else return  array_slice(static::$flow['iarticle'],$init,$limit)  ; 
    
    if( empty( static::$flow['iarticle']) ){
  	 static::$flow['iarticle'] = static::get_pattern()->load();
     static::setting_cache('iarticle');
    }
    return array_slice(static::$flow['iarticle'],$init,$limit);
  }

  public static function flowupd($limit=15,$init=0)
  {

    if( empty(static::$flow['iarticleupd']) ) static::$flow['iarticleupd'] = Cache::request()->get(Cache::get_conf()->cache_prefix->iarticleupd);
    else return  array_slice(static::$flow['iarticleupd'],$init,$limit)  ; 
    
    if( empty( static::$flow['iarticleupd']) ){
     static::$flow['iarticleupd'] = static::get_patternupd()->load();
     static::setting_cache('iarticleupd');
    }
    return array_slice(static::$flow['iarticleupd'],$init,$limit);
  }

  public static function setting_cache($pattern,$slug=false)
  {
  	if($slug){
      Cache::request()->save(
                         Cache::get_conf()->cache_prefix->{$pattern}.$slug,
                         static::$flow[$pattern][$slug],
                         Cache::get_conf()->cache_time->{$pattern}
                        );
    }else{

      Cache::request()->save(
                         Cache::get_conf()->cache_prefix->{$pattern},
                         static::$flow[$pattern],
                         Cache::get_conf()->cache_time->{$pattern}
                        );
    } 
  }


}

class PatternFactoryIA
{
     public static  function iarticle()
     {
     	return new \Rpp\Repositorio\Builder\Search\Pattern\Iarticle();
     }
     public static  function iarticleupd()
     {
      return new \Rpp\Repositorio\Builder\Search\Pattern\Iarticle();
     }

} 