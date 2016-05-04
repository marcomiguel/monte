<?php
namespace Rpp\Extend;
class Memcachedjson{
  public static $cache;
  public static $conf;
  public  $prefix;
  public static $cone_status;

  public function __construct( )
  {
     //static::$cache = new \Memcached();
     //static::$cone_status = static::$cache->addServer(static::get_conf()->memcache->nhost, static::get_conf()->memcache->port);
     //$this->prefix = static::get_conf()->memcache->prefijo;
    
     static::$cache = new \Memcached();
     static::$cache->setOption(\Memcached::OPT_CLIENT_MODE, \Memcached::DYNAMIC_CLIENT_MODE);
     static::$cache->setOption(\Memcached::OPT_COMPRESSION, true);
     static::$cone_status = static::$cache->addServer(static::get_conf()->memcache->nhost, static::get_conf()->memcache->port);
     $this->prefix = static::get_conf()->memcache->prefijo;
  }

  public static function get_conf()
  {
    if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/publish_custom.ini");
    else return static::$conf;
  }

  public function save($keyName = NULL, $content = NULL, $lifetime = NULL, $stopBuffer = true)
  {
    try{
        $keyName = $this->prefix.$keyName;
        return static::$cache->set($keyName, json_encode($content) , $lifetime);
      }catch(\Phalcon\Exception $e){}

  }

  public  function get( $keyName , $lifetime = NULL)
  {
      $keyName = $this->prefix.$keyName;
      return   json_decode(static::$cache->get($keyName),true) ;
  }

  public function uget($keyName)
  {
      $keyName = $this->prefix.$keyName;
      return   static::$cache->get($keyName) ;
  }


  public function usave($keyName = NULL, $content = NULL, $lifetime = NULL)
  {
    $keyName = $this->prefix.$keyName;
    static::$cache->set($keyName, $content , $lifetime);
  }

  public function decrement($keyName)
  {
    $keyName = $this->prefix.$keyName;
    static::$cache->decrement($keyName);
  }

  public function add($keyName,$content = NULL, $lifetime = NULL)
  {
    $keyName = $this->prefix.$keyName;
    static::$cache->add($keyName,$content,$lifetime);
  }
  public function exists($keyName = NULL, $lifetime = NULL)
  {
      $keyName = $this->prefix.$keyName;
      static::$cache->get($keyName);
      if (static::$cache->getResultCode() == \Memcached::RES_NOTFOUND) return false;
      else return true;
  }


  public function status_connect()
  {
    return static::$cone_status;
  }
 }