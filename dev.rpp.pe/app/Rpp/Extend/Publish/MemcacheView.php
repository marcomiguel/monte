<?php
namespace Rpp\Extend\Publish;
class MemcacheView extends \Phalcon\Cache\Backend\Memcache
{
    private $connect_status ;
	public function __construct ( $frontend,  $options)
	{
	   parent::__construct($frontend,  $options);
	}

	public function localconnect()
	{
	   $this->_memcache = new \Memcache();
	   $this->connect_status = @$this->_memcache->connect($this->_options['host'],$this->_options['port']);
	}

	public function save($keyName = NULL, $content = NULL, $lifetime = NULL, $stopBuffer = true)
	{
		try{
			parent::save($keyName, $content, $lifetime , $stopBuffer );
	    }catch(\Phalcon\Exception $e){}

	}

	public function get($keyName, $lifetime = NULL)
	{
		return null;
	}
}
