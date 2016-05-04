<?php
namespace Shared;
class Cache2{
  public static $cache;
  public static $conf;

  public  static function request()
  {
   if(empty(self::$cache)) {
      static::$cache = new \Rpp\Extend\Memcached();
      return   static::$cache;
    }else return static::$cache;
  }

  public static function get_conf()
  {
    if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/publish_custom.ini");
    else return static::$conf;
  }
  
 }