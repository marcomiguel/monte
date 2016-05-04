<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
class AnalyticsTask extends \Phalcon\CLI\Task
{
    private $mqconf;
    public function mainAction() {
         echo "\nAuthor:Jose Tenorio Chigne , Copyright © Todos los Derechos Reservado \n";
    }

    public function masvisitadasAction() {
         $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
         $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
         $channel = $connection->channel();
         $channel->queue_declare(SITESLUG.'_masvisitadas', false, true, false, false);
         echo ' [*] Servicio listener de mas visitadas iniciado ,  CTRL+C para cancelar', "\n";
         $callback = function($msg) {

                                    try{
 	                                  $vars=json_decode($msg->body);
                                      var_dump($vars);
	                                  $masvisitadas = new  \Rpp\Services\Analytics\Visits\Regenerate\MasVisitadas($vars->slug);
                                      $masvisitadas->builder();
                                     }catch (\Exception $e) {
                                            var_dump($e);
                                     }
                                     break;
                                    };
         $channel->basic_consume(SITESLUG.'_masvisitadas', '', false, true, false, false, $callback);  
         
         while(count($channel->callbacks)) {
             $channel->wait();
         }                        
    }
}