<?php
namespace Rpp\Services\Get;
use \Rpp\Repositorio\Builder\SearchPatternBuilder;
use \Shared\Cache2;
class LContent 
{
  private static $pattern_builder;
  public static $nota_repo;
  public static $cache ;
  public static $content;
  public static function get_repositorio()
  {
  	if(empty(static::$pattern_builder)) return static::$pattern_builder =  new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Nota());
    return static::$pattern_builder;
  }

  public static function get_nota_repo($nid)
  {
  if(empty(static::$nota_repo[$nid])) static::$nota_repo[$nid] =  static::get_repositorio()->addFilter(array('_id' => (int) $nid))->build();  
  return static::$nota_repo[$nid];
  }

  public static function node($nid)
  {
  if( empty(static::$content[$nid]['node']) ) static::$content[$nid]['node'] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->nota.$nid.'.node');
  else return static::$content[$nid]['node'];

  if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->nota.$nid.'.node'))return static::$content[$nid]['node'];
  else{
  	static::$content[$nid]['node'] = static::get_nota_repo($nid)->set_fields(explode(",",Cache2::get_conf()->node->fields))->load();
    if(empty(static::$content[$nid]['node'])) static::$content[$nid]['node'] = null;
    static::setting_cache($nid,'node');
  }
  
  return  static::$content[$nid]['node'];
  } 

  public static function part($nid,$part)
  {
	  if( ! isset(static::$content[$nid][$part]) ) static::$content[$nid][$part] = Cache2::request()->get(Cache2::get_conf()->cache_prefix->nota.$nid.'.'.$part);
    else return static::$content[$nid][$part];

    if(Cache2::request()->exists(Cache2::get_conf()->cache_prefix->nota.$nid.'.'.$part))return static::$content[$nid][$part];
    else{
    	static::$content[$nid][$part] = @static::get_nota_repo($nid)->set_fields(array($part))->load()->{$part};
      if(empty(static::$content[$nid][$part])) static::$content[$nid][$part] = null;
      static::setting_cache($nid,$part);
    }
    return  static::$content[$nid][$part];
  }

  public static function nota($nid)
  {
    if(!empty(static::$content[$nid]['nota']) ) return static::$content[$nid]['nota'];

    static::$content[$nid]['nota'] = @static::get_nota_repo($nid)->set_fields(array())->load();
    
    if(is_object(static::$content[$nid]['nota']))
    {
       foreach (static::$content[$nid]['nota'] as $key => $value) {
          static::$content[$nid][$key] = $value;
          static::setting_cache($nid,$key);
       }
    }

    return static::$content[$nid]['nota'];
  } 

  public static function nurl($nid)
  {
     $categoria = explode("/",static::node($nid)->categoria['slug']);
     return "/".@$categoria[1]."/".@$categoria[2]."/".static::node($nid)->slug . "-noticia-" . $nid;
  }

  public static function unset_part($nid,$part,$key,$action='array')
  {
      if($action=='array') unset(static::$content[$nid][$part][$key]);
      else unset(static::$content[$nid][$part]->{$key});
  }

  public static function setting_cache($nid,$part)
  {
    Cache2::request()->save(
                           Cache2::get_conf()->cache_prefix->nota.$nid.'.'.$part,
                           static::$content[$nid][$part],
                           Cache2::get_conf()->cache_time->nota
                          );
  }
 

}