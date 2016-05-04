<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache2;
class Archivo {
	private static $pattern_builder;
    public  static $pattern;
    public  static $archivo;
    public  static $archivo_intervalo;

	public static function get_repositorio($Pattern='home')
	{
		if(empty(static::$pattern_builder[$Pattern])) return static::$pattern_builder[$Pattern] = new SearchPatternBuilder( PatternFactoryArchivo::$Pattern() );
		return static::$pattern_builder[$Pattern];
	}

	public static function get_pattern($Pattern='home',$fecha , $limit = 300)
	{
        $start = new \MongoDate(strtotime($fecha." 00:00:00"));
        $end = new \MongoDate(strtotime($fecha." 23:59:59"));

		if(empty(static::$pattern[$Pattern][$fecha])) return static::$pattern[$Pattern][$fecha] = static::get_repositorio($Pattern)->addFilter( array( 'date_publish' => array('$gt' => $start, '$lte' => $end) ) )->addLimit($limit)->addFields(array("_id"))->build();
		return static::$pattern[$Pattern][$fecha];
	}

	public static function get_pattern_intervalo($Pattern='home',$intervalo)
	{
        $start = new \MongoDate(strtotime("-$intervalo hours"));
        $end = new \MongoDate(strtotime("now"));

		if(empty(static::$pattern['intervalo'][$Pattern][$intervalo])) return static::$pattern['intervalo'][$Pattern][$intervalo] = static::get_repositorio($Pattern)->addFilter( array( 'date_publish' => array('$gt' => $start, '$lte' => $end) ) )->addLimit(600)->addFields(array("_id"))->build();
		return static::$pattern['intervalo'][$Pattern][$intervalo];
	}

	public static function general($fecha,$limit=300,$init=0)
    {
     if( empty( static::$archivo['general'][$fecha]) ) static::$archivo['general'][$fecha] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->archivo->general.$fecha);
     else return  array_slice(static::$archivo['general'][$fecha],$init,$limit)  ;

     if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->archivo->general.$fecha)) return array_slice(static::$archivo['general'][$fecha],$init,$limit);
     else{
  	  static::$archivo['general'][$fecha] = static::get_pattern('home',$fecha)->load();
  	  static::setting_cache('general',$fecha);
     }
     return array_slice(static::$archivo['general'][$fecha],$init,$limit);
    }

	  public static function seccion($slug,$fecha,$limit=300,$init=0)
    {
     if( empty( static::$archivo['seccion'][$slug][$fecha] ) ) static::$archivo['seccion'][$slug][$fecha] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->archivo->seccion.$slug.$fecha);
     else return  array_slice(static::$archivo['seccion'][$slug][$fecha],$init,$limit);

     if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->archivo->seccion.$slug.$fecha))return array_slice(static::$archivo['seccion'][$slug][$fecha],$init,$limit);
     else{
  	  static::$archivo['seccion'][$slug][$fecha] = static::get_pattern('seccion',$fecha,100)->set_slug($slug)->load();
  	  static::setting_cache('seccion',$fecha,$slug);
     }
     return array_slice(static::$archivo['seccion'][$slug][$fecha],$init,$limit);
    }

    public static function ultimas($intervalo,$limit=500,$init=0)
    {
       if( empty( static::$archivo_intervalo['general'][$intervalo]) ) static::$archivo_intervalo['general'][$intervalo] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->archivo->intervalo->general.$intervalo);
       else return  array_slice( static::$archivo_intervalo['general'][$intervalo],$init,$limit );


       if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->archivo->intervalo->general.$intervalo)) return array_slice(static::$archivo_intervalo['general'][$intervalo],$init,$limit);
       else
       {
       	 static::$archivo_intervalo['general'][$intervalo] = static::get_pattern_intervalo('home',$intervalo)->load();
  	     static::setting_cache_intervalo('general',$intervalo);
       }
       return array_slice(static::$archivo_intervalo['general'][$intervalo],$init,$limit);
    }

    public static function ultimas_seccion($slug,$intervalo,$limit=500,$init=0)
    {
       if( empty( static::$archivo_intervalo[$slug][$intervalo]) ) static::$archivo_intervalo[$slug][$intervalo] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->archivo->intervalo->seccion.$slug.$intervalo);
       else return  array_slice( static::$archivo_intervalo[$slug][$intervalo],$init,$limit );


       if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->archivo->intervalo->seccion.$slug.$intervalo)) return array_slice(static::$archivo_intervalo[$slug][$intervalo],$init,$limit);
       else
       {
       	 static::$archivo_intervalo[$slug][$intervalo] = static::get_pattern_intervalo('seccion',$intervalo)->set_slug($slug)->load();
  	     static::setting_cache_intervalo('seccion',$intervalo,$slug);
       }
       return array_slice(static::$archivo_intervalo[$slug][$intervalo],$init,$limit);
    }

    public static function setting_cache($mode,$fecha,$slug = false)
    {
       if($slug)Cache2::request()->save(
                           Cache2::get_conf()->cache_prefix->archivo->{$mode}.$slug.$fecha,
                           static::$archivo[$mode][$slug][$fecha],
                           Cache2::get_conf()->cache_time->archivo
                          );
       else Cache2::request()->save(
                           Cache2::get_conf()->cache_prefix->archivo->general.$fecha,
                           static::$archivo[$mode][$fecha],
                           Cache2::get_conf()->cache_time->archivo
                          );
    }


    public static function setting_cache_intervalo($mode,$intervalo,$slug=false)
    {
    	if($slug) Cache2::request()->save(
                           Cache2::get_conf()->cache_prefix->archivo->intervalo->{$mode}.$slug.$intervalo,
                           static::$archivo_intervalo[$slug][$intervalo],
                           Cache2::get_conf()->cache_time->archivo
                          );
    	else Cache2::request()->save(
                           Cache2::get_conf()->cache_prefix->archivo->intervalo->{$mode}.$intervalo,
                           static::$archivo_intervalo[$mode][$intervalo],
                           Cache2::get_conf()->cache_time->archivo
                          );
    }

}

class PatternFactoryArchivo
{
     public static  function home()
     {
     	return new \Rpp\Repositorio\Builder\Search\Pattern\Archivo();
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
?>
