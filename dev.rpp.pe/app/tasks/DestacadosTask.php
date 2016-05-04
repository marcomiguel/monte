<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
class DestacadosTask extends \Phalcon\CLI\Task
{
 private $mqconf;
 public function portadaAction(){
  $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
  $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
  $channel = $connection->channel();
  $channel->queue_declare(SITESLUG.'_publicacion_destacados', false, true, false, false);
  echo ' [*] Servicio listener para la publicacion de destacados ,  CTRL+C para cancelar', "\n";
  $callback = function($msg) {
        try{

         $node=json_decode($msg->body);
         print_r($node);
         $destacados = new \Rpp\Services\Publish\Destacados(@$node->slug);
         $di = new Phalcon\DI();
         $di->set('viewCache',$this->viewCache);
         $destacados->setDI($di);
         $destacados->load();

        }catch (\Exception $e) {
          var_dump($e);
        }
        break;
  };

  $channel->basic_consume(SITESLUG.'_publicacion_destacados', '', false, true, false, false, $callback);  
  while(count($channel->callbacks)) {
     $channel->wait();
  }
 }
}