<?php
namespace Rpp\Extend;
class Libmemcached extends \Phalcon\Cache\Backend\Libmemcached
{
  private $connect_status ;
  public function __construct ( $frontend,  $options)
  {
     parent::__construct($frontend,  $options);
  }

  public function localconnect()
  {
     $this->_memcache = new \Memcached();
     $this->_memcache->setOption(\Memcached::OPT_CLIENT_MODE, \Memcached::DYNAMIC_CLIENT_MODE);
     $this->_memcache->setOption(\Memcached::OPT_COMPRESSION, true);
     $this->connect_status = @$this->_memcache->addServers($this->_options['servers']);
  }

  public function save($keyName = NULL, $content = NULL, $lifetime = NULL, $stopBuffer = true)
  {
    try{
      parent::save($keyName, $content, $lifetime , $stopBuffer );
      }catch(\Phalcon\Exception $e){}

  }

  public  function get($keyName, $lifetime = NULL)
  {
    return false;
  }

  public function exists($keyName = NULL, $lifetime = NULL)
  {
    return false;
  }

  public function status_connect()
  {
    return false;
  }
}