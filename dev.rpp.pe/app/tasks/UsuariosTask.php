<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
class UsuariosTask extends \Phalcon\CLI\Task
{
 private $mqconf;
 public function calculateAction(){
  $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
  $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
  $channel = $connection->channel();
  $channel->queue_declare(SITESLUG.'_usuarios_meta', false, true, false, false);
  echo ' [*] Servicio listener para la publicacion de Temas ,  CTRL+C para cancelar', "\n";
  $callback = function($msg) {
        try{

         $node=json_decode($msg->body);
         print_r($node);
         $Usuarios = new \Rpp\Services\Publish\Usuariosmeta(@$node->slug);
         $Usuarios->load();

        }catch (\Exception $e) {
          var_dump($e);
        }
        die();
  };

  $channel->basic_consume(SITESLUG.'_usuarios_meta', '', false, true, false, false, $callback);  
  while(count($channel->callbacks)) {
     $channel->wait();
  }
 }
}

