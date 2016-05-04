<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
class EliminarTask extends \Phalcon\CLI\Task
{
	private $mqconf;
	public function notasAction() {
     $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
     $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
     $channel = $connection->channel();
     $channel->queue_declare(SITESLUG.'_eliminar_noticia', false, true, false, false);
     echo ' [*] Servicio listener para despublicacion ,  CTRL+C para cancelar', "\n";
     $callback = function($msg) {
        
                              try{
	                             $node=json_decode($msg->body);
                                 var_dump($node);
                                 $publicacion = new \Rpp\Services\Unpublish\Noticia((int)$node->nid);
                                 $di = new Phalcon\DI();
                                 $di->set('viewCache',$this->viewCache);
                                 $publicacion->setDI($di);
                                 $publicacion->builder();
                               }catch (\Exception $e) {
                                            var_dump($e);
                               }
                               break;
                            };
     $channel->basic_consume(SITESLUG.'_eliminar_noticia', '', false, true, false, false, $callback);  
     
     while(count($channel->callbacks)) {
         $channel->wait();
     }                        
    }
}