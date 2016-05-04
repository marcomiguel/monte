<?php 
namespace Rpp\Services\Get;
class UrlMedia
{
    public static $conf;

    public static function image($hash,$size = false)
    {
       

        if($size) return static::get_conf()->endpoint->small.$size.'/'.$hash; 
        else return $hash;
    }

    public static function replace_cdn($data, $tipo='fuente')
    {
      if(is_array($data))
      {
        array_walk($data , function(&$value,$key) use ($tipo) { $value=str_replace(static::get_conf()->endpoint->{$tipo}, static::get_conf()->endpoint->small , $value); });
      }else
      {
        $data=str_replace(static::get_conf()->endpoint->{$tipo}, static::get_conf()->endpoint->small , $data);
      }
      return $data;
    }

    public static function replace_cdn_raiz($data, $tipo='fuente')
    {
      if(is_array($data))
      {
        array_walk($data , function(&$value,$key) use ($tipo) { $value=str_replace(static::get_conf()->endpoint->{$tipo}, static::get_conf()->endpoint->contenedor , $value); });
      }else
      {
        $data=str_replace(static::get_conf()->endpoint->{$tipo}, static::get_conf()->endpoint->contenedor , $data);
      }
      return $data;
    }

    public static function get_conf()
    {
     if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/media.ini");
     else return static::$conf;
    }
}

