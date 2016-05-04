<?php
namespace Shared;
class Redis{
  public static $cache;
  public static $conf;



  public  static function request()
  {
   if(empty(self::$cache)) {    
        $redis=  new \Redis();
        $redis->connect(static::get_conf()->redis->host,static::get_conf()->redis->port);
        static::$cache = $redis;
        return  static::$cache;                         
    }else return static::$cache;
  }

  public static function get_conf()
  {
    if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/config.ini");
    else return static::$conf;
  }
 }