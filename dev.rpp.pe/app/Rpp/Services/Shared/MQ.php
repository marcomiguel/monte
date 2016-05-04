<?php
namespace Shared;
class MQ{
	public static $conf;
	public static function send_message($qq,$options)
	{
      $connection = new \PhpAmqpLib\Connection\AMQPConnection(static::get_conf()->host, static::get_conf()->port,static::get_conf()->user, static::get_conf()->pasw);
      $channel = $connection->channel();
      $channel->queue_declare($qq, false, true, false, false);
      $msg = new \PhpAmqpLib\Message\AMQPMessage(json_encode($options),array("content_type" => "json",));
      $channel->basic_publish($msg, '', $qq);
      $channel->close();
      $connection->close();
	}

	public static function get_conf(){
	  if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
        else return static::$conf;
	}
}