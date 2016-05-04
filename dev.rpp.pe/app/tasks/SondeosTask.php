<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
class SondeosTask extends \Phalcon\CLI\Task
{
    private $mqconf;
    public function mainAction() {
         echo "\nAuthor:Jose Tenorio Chigne , Copyright © Todos los Derechos Reservado \n";
    }

    public function makeAction() {
         $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
         $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
         $channel = $connection->channel();
         $channel->queue_declare(SITESLUG.'_sondeo', false, true, false, false);
         echo ' [*] Servicio listener de sondeos iniciado ,  CTRL+C para cancelar', "\n";
         $callback = function($msg) {

                                    try{
 	                                  $vars=json_decode($msg->body);
                                      var_dump($vars);
                                      \Rpp\Services\Get\Elecciones::$pattern=null; 
                                      \Rpp\Services\Get\Elecciones::$sondeos=null;
	                                  $sondeo = \Rpp\Services\Get\Elecciones::get($vars->id);
                                      var_dump($sondeo);
                                     }catch (\Exception $e) {
                                            var_dump($e);
                                     }
                                     break;
                                    };
         $channel->basic_consume(SITESLUG.'_sondeo', '', false, true, false, false, $callback);  
         
         while(count($channel->callbacks)) {
             $channel->wait();
         }                        
    }
}