<?php
namespace Shared;
class Cache{
  public static $cache;
  public static $conf;



  public  static function request()
  {
   if(empty(self::$cache)) {
    
      $frontCache = new \Phalcon\Cache\Frontend\Data(array("lifetime" => static::get_conf()->memcache->lifetime));
      static::$cache = new \Rpp\Extend\Memcache($frontCache, array(
                                                                        "host" => static::get_conf()->memcache->host,
                                                                        "port" => static::get_conf()->memcache->port,
                                                                        "prefix" => static::get_conf()->memcache->prefix,
                                                                        "statsKey" => static::get_conf()->memcache->stats,
                                                                        ));

      static::$cache->localconnect();
      return   static::$cache;
    }else return static::$cache;
  }

  public static function get_conf()
  {
    if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/publish_custom.ini");
    else return static::$conf;
  }
 }