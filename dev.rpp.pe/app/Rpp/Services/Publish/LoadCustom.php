<?php
namespace Rpp\Services\Publish;
class LoadCustom{
  public static $cache;
  public static $conf;

  public  static function get_cache($conf)
  {
   if(empty(self::$cache)) {
    
      $frontCache = new \Phalcon\Cache\Frontend\None(array("lifetime" => $conf->lifetime));
      $cache = new \Rpp\Extend\Memcache($frontCache, array(
                                                                        "host" => $conf->host,
                                                                        "port" => $conf->port,
                                                                        "prefix" => $conf->prefix,
                                                                        "statsKey" => $conf->stats,
                                                                        ));
      $cache->localconnect();
      return   self::$cache = $cache;
    }else return self::$cache;
  }

  public static function get_conf()
  {
    if(empty(self::$conf)) return self::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/publish_custom.ini");
    else return self::$conf;
  }
 }