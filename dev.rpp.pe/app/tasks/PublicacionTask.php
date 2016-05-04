<?php
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;
class PublicacionTask extends \Phalcon\CLI\Task
{
    private $mqconf;
    public function notasAction() {
         $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
         $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
         $channel = $connection->channel();
         $channel->queue_declare(SITESLUG.'_publicacion_noticia', false, true, false, false);
         echo ' [*] Servicio listener para la publicacion ,  CTRL+C para cancelar', "\n";
         $callback = function($msg) {
 	                                 $node=json_decode($msg->body);
                                     
	                                 foreach ($node as $key => $change) {
                                        try {
                                         print_r($key);print_r($change);
                                         
                                         $publicacion = new \Rpp\Services\Publish\Noticia((int)$key);
                                         $publicacion->set_last($change);
                                         $di = new Phalcon\DI();
                                         $di->set('viewCache',$this->viewCache);
                                         $publicacion->setDI($di);
                                         $publicacion->builder();
                                        } catch (\Exception $e) {
                                            var_dump($e->getMessage());
                                        }
                                     }
                                     die();
                                    };
         $channel->basic_consume(SITESLUG.'_publicacion_noticia', '', false, true, false, false, $callback);  
         
         while(count($channel->callbacks)) {
             $channel->wait();
         }                        
    }


    public function notacacheAction() {
         $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
         $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
         $channel = $connection->channel();
         $channel->queue_declare(SITESLUG.'_nota_cache_invalid', false, true, false, false);
         echo ' [*] Servicio listener para la publicacion ,  CTRL+C para cancelar', "\n";
         $callback = function($msg) {
                         $node=json_decode($msg->body);
                         var_dump($node);
                         foreach ($node as $nota) {
                            try {
                             if(\Rpp\Services\Get\Content::node($nota->nid)->tipo=='galeria')
                             {
                                foreach (\Rpp\Services\Get\Content::part($nota->nid,'galeria') as $v => $e) {
                                   $this->viewCache->delete("nota.header.geleria." . $nota->nid . "." . $v ); 
                                } 
                             }
                             $this->viewCache->delete("nota.wrap.group." . $nota->nid ); 
                             var_dump("cache reload...");
                            } catch (\Exception $e) {
                                var_dump($e->getMessage());
                            }
                         }
                         die();
                                  };
         $channel->basic_consume(SITESLUG.'_nota_cache_invalid', '', false, true, false, false, $callback);  
         
         while(count($channel->callbacks)) {
             $channel->wait();
         }                        
    }

    public function metasAction()
    {
         $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
         $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
         $channel = $connection->channel();
         $channel->queue_declare(SITESLUG.'_noticia_metas', false, true, false, false);
         echo ' [*] Servicio listener para la actualizacion de metas ,  CTRL+C para cancelar', "\n";
         $callback = function($msg) {
                                     $node=json_decode($msg->body,true);
                                     
                                    var_dump($node);
                                        try {
                                            //print_r($key);print_r($change);                                         
                                            $publicacion = new \Rpp\Services\Publish\Noticia((int)$node['nid']);
                                            $publicacion->metas();
                                        } catch (\Exception $e) {
                                            var_dump($e);
                                            var_dump($e->getMessage());
                                        }
                                  
                                     
                                    };
         $channel->basic_consume(SITESLUG.'_noticia_metas', '', false, true, false, false, $callback);  
         
         while(count($channel->callbacks)) {
             $channel->wait();
         } 
    }


    public function cacheAction() {
            var_dump("start........");
            for ($i=1 ; $i < 10 ; $i++) {
               //$data =  array('title' => 'kjfkjfdjkfdkjfd' , 'bajada'=> 'dsdsdsd sds ds dsdsd sdsd');
               \Shared\Cache::request()->save('test'.$i, $i ,3);
               var_dump("time");
            }
            var_dump("finish...........");
            
    }

}
