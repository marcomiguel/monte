<?php 
namespace Rpp\Services\Get;
class UrlTrack
{
	public static $ns_source = 'self';
	public static $ns_mchannel;
	public static $ns_campaign;
	public static $conf;
	public static function  add_params($position=false)
	{
		return '?ns_source='.self::$ns_source.'&ns_mchannel='.self::$ns_mchannel.'&ns_campaign='.self::$ns_campaign.($position ? '&ns_linkname='.$position : '' );
	}

    public static function add_params_social($social,$position)
    {
       return '?ns_source='.$social.'&ns_mchannel=la10.'.self::$ns_mchannel.'&ns_campaign=Shared&ns_linkname='.$position ;
    } 

	public static function get_conf()
    {
     if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/viewtax.ini");
     else return static::$conf;
    }
}