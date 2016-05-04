<?php
namespace Rpp\Services\Get;
use \Shared\Cache2;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
class LFlow
{
  private static $pattern_builder;
  public static $pattern;
  public static $flow;
  
  public static function get_repositorio($Pattern='home')
  {
  	if(empty(static::$pattern_builder[$Pattern])) return static::$pattern_builder[$Pattern] = new SearchPatternBuilder( LPatternFactory::$Pattern() );
    return static::$pattern_builder[$Pattern];
  }

  public static function get_pattern($Pattern='home')
  {
  	if(empty(static::$pattern[$Pattern])) return static::$pattern[$Pattern] = static::get_repositorio($Pattern)->addFields(array("_id"))->build();
    return static::$pattern[$Pattern];
  }

  public static function home($limit=10,$init=0)
  {

    if( empty(static::$flow['home']) ) static::$flow['home'] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->home);
    else return  array_slice(static::$flow['home'],$init,$limit)  ; 

    if( empty( static::$flow['home']) ){
  	 static::$flow['home'] = static::get_pattern()->load();
     static::setting_cache('home');
    }
    return array_slice(static::$flow['home'],$init,$limit);
  }

  public static function tag($slug,$limit=50,$init=0)
  {

	if( empty(static::$flow['tag'][$slug]) ) static::$flow['tag'][$slug] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->tag.$slug);
	else return array_slice(static::$flow['tag'][$slug],$init,$limit);

  if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->tag.$slug)){
    static::$flow['tag_size'][$slug] = count(static::$flow['tag'][$slug]);
    return array_slice(static::$flow['tag'][$slug],$init,$limit);
  }else{
	  	static::$flow['tag'][$slug] = static::get_pattern('tag')->set_filter(array("tags.slug" => $slug))->load();
      if(empty(static::$flow['tag'][$slug])) static::$flow['tag'][$slug] = array();
      static::$flow['tag_size'][$slug] = count(static::$flow['tag'][$slug]);
	  	static::setting_cache('tag',$slug);
	}
	return array_slice(static::$flow['tag'][$slug],$init,$limit);
  }

  public static function tagsrelated($slug,$array_slug,$limit=50,$init=0)
  {
    if( empty(static::$flow['relatedtag'][$slug]) ) static::$flow['relatedtag'][$slug] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->tag.'relatedtag.'.$slug);
    else return array_slice(static::$flow['relatedtag'][$slug],$init,$limit);

    if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->tag.'relatedtag.'.$slug)){
      static::$flow['related_tag_size'][$slug] = count(static::$flow['relatedtag'][$slug]);
      return array_slice(static::$flow['relatedtag'][$slug],$init,$limit);
    }else{
        static::$flow['relatedtag'][$slug] = static::get_pattern('tag')->set_filter( array("tags.slug" => array('$in' => $array_slug ) ) )->load();
        if(empty(static::$flow['relatedtag'][$slug])) static::$flow['relatedtag'][$slug] = array();
        static::$flow['related_tag_size'][$slug] = count(static::$flow['relatedtag'][$slug]);
        Cache2::request()->save(
                         Cache2::get_conf()->cache_prefix->tag.'relatedtag.'.$slug,
                         static::$flow['relatedtag'][$slug],
                         Cache2::get_conf()->cache_time->tag
                        );
    }
    return array_slice(static::$flow['relatedtag'][$slug],$init,$limit);
  }

  public static function tag_size($slug)
  {
    static::tag($slug);
    return @static::$flow['tag_size'][$slug];
  }

  public static function seccion($slug,$limit=50,$init=0)
  {
    if( empty(static::$flow['seccion'][$slug]) ) static::$flow['seccion'][$slug] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->seccion.$slug);
    else return array_slice(static::$flow['seccion'][$slug],$init,$limit);

    if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->seccion.$slug)) return  array_slice( static::$flow['seccion'][$slug] , $init , $limit ); 
    else{
      	static::$flow['seccion'][$slug] = static::get_pattern('seccion')->set_slug($slug)->load();
        if(empty(static::$flow['seccion'][$slug])) static::$flow['seccion'][$slug] = array();
      	static::setting_cache('seccion',$slug);
    }
    return array_slice(static::$flow['seccion'][$slug],$init,$limit);
  }

  public  static function brandcontent($limit=50,$init=0)
  {
    if( empty(static::$flow['brandcontent']) ) static::$flow['brandcontent'] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->brandcontent);
    else return  array_slice(static::$flow['brandcontent'],$init,$limit)  ; 

    if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->brandcontent)) return array_slice(static::$flow['brandcontent'],$init,$limit);
    else{
     static::$flow['brandcontent'] = static::get_pattern('brandcontent')->load();
     if(empty(static::$flow['brandcontent'])) static::$flow['brandcontent'] = array();
     static::setting_cache('brandcontent');
    }
    return array_slice(static::$flow['brandcontent'],$init,$limit);
  } 

  public  static function autor($limit=50,$init=0)
  {
    if( empty(static::$flow['autor']) ) static::$flow['autor'] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->autor);
    else return  array_slice(static::$flow['autor'],$init,$limit)  ; 

    if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->autor)) return array_slice( static::$flow['autor'],$init,$limit) ;
    else {
     static::$flow['autor'] = static::get_pattern('autor')->load();
     if(empty(static::$flow['autor'])) static::$flow['autor'] = array();
     static::setting_cache('autor');
    }
    return array_slice(static::$flow['autor'],$init,$limit);
  } 

  public static function setting_cache($pattern,$slug=false)
  {
  	if($slug)Cache2::request()->save(
                         Cache2::get_conf()->cache_prefix->{$pattern}.$slug,
    	                   static::$flow[$pattern][$slug],
    	                   Cache2::get_conf()->cache_time->{$pattern}
    	                  );
  	else Cache2::request()->save(
                         Cache2::get_conf()->cache_prefix->{$pattern},
    	                   static::$flow[$pattern],
    	                   Cache2::get_conf()->cache_time->{$pattern}
    	                  );
  }
  
  public static function unset_home($nid)
  {
      static::home();
      array_walk(static::$flow['home'], function ($k,$e) use ($nid) {
              if($k->_id==$nid) unset(static::$flow['home'][$e]);
            });
 
  }


  public static function unset_home_position($id)
  {
     static::home();  
     unset(static::$flow['home'][$id]);
  }

}

class LPatternFactory
{
     public static  function home()
     {
     	return new \Rpp\Repositorio\Builder\Search\Pattern\Home();
     }

     public static  function brandcontent()
     {
      return new \Rpp\Repositorio\Builder\Search\Pattern\Brandcontent();
     }

     public static  function autor()
     {
      return new \Rpp\Repositorio\Builder\Search\Pattern\Autor();
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