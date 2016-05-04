<?php
require_once 'helpers.php';
if (!defined('APPFULLPATH')) {
define('APPFULLPATH', ROOTFULLPATH.DIRS.'app');
}

/**
 * \Bootstrap\Load
 * Load.php
 *
 * Bootstraps the application
 *
 * @author      Jose Tenorio Chigne <tjotay@gmail.com> 
 * @since       21/04/2015
 * @category    Utility
 * @license     Copyright © Todos los Derechos Reservado
 *
 */

class Load{
	private $_di;
  private $_conf;
  private $_loader;
  private $_loaders = array(
                            'application'=>array('environment','config','loader'/*,'router'*/,'view','mongo','collection','cache','viewcache','dispatcher','redis'),
                            'api'=>array('environment','config','loader','view','mongo','collection','viewcache','cache'),
                           ); 
  private $_application_type = 'application';
  public static $_application;

  public function __construct($di)
  {
      $this->_di = $di;
  }

  public function run($options=array())
  {
      foreach ($this->_loaders[$this->_application_type] as $service) {
      	$function = 'init_' . $service;
          $this->$function();
      }

      $function='create_'.$this->_application_type;
      $this->$function();
      return self::$_application;
  }

  private function init_environment($options=array())
  {
  	if(!defined('AMBIENTE')){
  		define('AMBIENTE', isset($_SERVER['ENVIT']) ? $_SERVER['ENVIT'] : 'DESARROLLO');
  	}
  }

  private function init_config($options=array())
  {
  	if(!defined('CONFIG_PATH'))
  	{
  		if(is_dir(APPFULLPATH.DIRS.'config'.DIRS.AMBIENTE))define('CONFIG_PATH', APPFULLPATH.DIRS.'config'.DIRS.AMBIENTE);
  		else define('CONFIG_PATH', APPFULLPATH.DIRS.'config');
  	}
  	        
      $this->_conf = new Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/config.ini");

      if(!defined('SITESLUG')){
         define('SITESLUG',$this->_conf->site->slug );
      }

      if(!defined('TRACKING_HOST')){
         define('TRACKING_HOST',$this->_conf->tracking->host );
      }
      
    if(!defined('TRACKINGNODE_HOST')){
        define('TRACKINGNODE_HOST',$this->_conf->trackingnode->host );
    }      
  }
  
  private function init_loader($options=array())
  {
     $this->_loader = new \Phalcon\Loader(); 

     $namespaces = array(
                            'Rpp\Repositorio' => APPFULLPATH .'/Rpp/Repositorio/',
                            'Rpp\Extend' => APPFULLPATH .'/Rpp/Extend/',
                            'Rpp\Services' => APPFULLPATH .'/Rpp/Services/',
                            'Rpp\Dominio' => APPFULLPATH .'/Rpp/Dominio/',
                            'Rpp\Analytics' => APPFULLPATH .'/Rpp/Analytics/',
                            'Rpp\Destacados' => APPFULLPATH .'/Rpp/Destacados/',
                            'Rpp\Pages' => APPFULLPATH .'/Rpp/Pages/',
                            'Local\Models' => APPFULLPATH.$this->_conf->phalcon->modelsDir ,
                            'Local' => APPFULLPATH.$this->_conf->phalcon->libraryDir ,  
                            'PhpAmqpLib' => ROOTFULLPATH .'/vendor/videlalvaro/php-amqplib/PhpAmqpLib',
                         );

    
   if(empty(@$_GET['lflush']))$namespaces['Shared']  = APPFULLPATH .'/Rpp/Services/Shared/';
   else $namespaces['Shared']  = APPFULLPATH .'/Rpp/Services/Shared/Publish/';
   
   $this->_loader->registerNamespaces($namespaces);
       
   $this->_loader->registerDirs(array(
                                APPFULLPATH.$this->_conf->phalcon->controllersDir,
                                APPFULLPATH.$this->_conf->phalcon->modelsDir ,
                                APPFULLPATH.$this->_conf->phalcon->libraryDir ,
                                     )
                                )->register();


  }

  private function init_router($options=array())
  {
    $this->_di->set('router',function() {
                                          require APPFULLPATH.DIRS.'routes'.DIRS.'index.php';
                                          return $router;
                                        } , true);
  }

  private function init_view($options=array()){
         
          $view = new \Phalcon\Mvc\View();
          $view->setViewsDir(APPFULLPATH.$this->_conf->phalcon->viewsDir);
         
          $view->registerEngines(
                        array( $this->_conf->volt->extn  =>     
           function($view, $di) {
              //$volt = new \Phalcon\Mvc\View\Engine\Volt($view, $di);
              $volt = new \Rpp\Extend\Volt($view, $di);
              $volt->setOptions(
                   array(
                      "compiledPath"      => "/u/cache/",
                      "compileAlways"  => true,
                    )
                   );
              $compiler = $volt->getCompiler();
              $compiler->addFunction('getNode', '\Rpp\Services\Get\Content::node');
              $compiler->addFunction('getPart', '\Rpp\Services\Get\Content::part');
              $compiler->addFunction('getGrilla', '\Rpp\Services\Get\Destacados::portada');
              $compiler->addFunction('nUrl', '\Rpp\Services\Get\Content::nurl');

              $compiler->addFunction('gNode', '\Rpp\Services\Get\Article::node');
              $compiler->addFunction('gPart', '\Rpp\Services\Get\Article::part');
              $compiler->addFunction('pUrl', '\Rpp\Services\Get\Article::nurl');

              $compiler->addFunction('TrackUrl', '\Rpp\Services\Get\UrlTrack::add_params');
              $compiler->addFunction('TrackUrlSocial', '\Rpp\Services\Get\UrlTrack::add_params_social');
              $compiler->addFunction('cdn_image', '\Rpp\Services\Get\UrlMedia::image');
              $compiler->addFunction('cdn_replace', '\Rpp\Services\Get\UrlMedia::replace_cdn');
              $compiler->addFunction('df_match', '\Rpp\Services\Get\Resultados::match');
              $compiler->addFunction('df_campeonato', '\Rpp\Services\Get\Resultados::campeonato');
              $compiler->addFunction('df_torneo', '\Rpp\Services\Get\Dfactory::torneo');
              $compiler->addFunction('clima', '\Rpp\Services\Get\Climas::get');
              return $volt;
            }
          ));
          $view->setVar("trackurl", true);
          $view->setVar("host", $this->_conf->server->host );
          $view->setVar("eversion", $this->_conf->estaticos->version );
          $view->setVar("ehost", $this->_conf->estaticos->host );
          $this->_di->set('view',$view);

  }
 
  private function init_mongo($options=array())
  {
		     $this->_di->set('mongo', function() {
                                     try {
		                                  $mongo = new MongoClient("mongodb://".$this->_conf->mongo->host."/".$this->_conf->mongo->db.$this->_conf->mongo->replicaset);
                                      //$mongo->setReadPreference(MongoClient::RP_SECONDARY_PREFERRED);
                                      } catch(MongoConnectionException $e) {
                                        var_dump($e->getMessage());
                                      }
                                      if($mongo)return $mongo->selectDB( $this->_conf->mongo->db );
		                                  else return false;
		                                 }, true);
  }

  private function init_collection($options=array())
  {
				$this->_di->set('collectionManager', function(){
					     return new Phalcon\Mvc\Collection\Manager();
					}, true);
  }


  private function init_redis($options=array())
  {
               $this->_di->set('redis', function() {
                                             $redis=  new \Redis();
                                             $redis->connect($this->_conf->redis->host,$this->_conf->redis->port);
                                             return $redis;
                                         }, true);
  }

  private function init_viewcache($options=array())
  {

			    $this->_di->set('viewCache', function() {
			             $frontCache = new Phalcon\Cache\Frontend\Output(array("lifetime" => $this->_conf->viewcache->lifetime));
                   /* $cache = new Rpp\Extend\Memcache($frontCache, array(
                                "host" => $this->_conf->viewcache->memcache->host,
                                "port" => $this->_conf->viewcache->memcache->port,
                                "prefix" => $this->_conf->viewcache->memcache->prefix,
                                "statsKey" => $this->_conf->viewcache->memcache->stats,
                                                                       )
                             );*/
                      $cache = new Rpp\Extend\Libmemcached($frontCache, array(
                                                                            "servers" => array(
                                                                                           array('host' => $this->_conf->viewcache->memcache->host,
                                                                                                 'port' => $this->_conf->viewcache->memcache->port,
                                                                                                 'weight' => 1),
                                                                                               ),
                                                                            "prefix" => $this->_conf->viewcache->memcache->prefix,
                                                                            "statsKey" => $this->_conf->viewcache->memcache->stats,
                                                                       )
                             );
                      $cache->localconnect();
                      return $cache;
                        });

  }

  private function init_dispatcher()
  {
    $evManager = $this->_di->getShared('eventsManager');
    $this->_di->set(
        'dispatcher',
        function() use ($evManager) {
            $evManager->attach(
                "dispatch:beforeException",
                function($event, $dispatcher, $exception)
                {
                    switch ($exception->getCode()) {
                        case \Phalcon\Mvc\Dispatcher::EXCEPTION_HANDLER_NOT_FOUND:
                        case \Phalcon\Mvc\Dispatcher::EXCEPTION_ACTION_NOT_FOUND:
                            $dispatcher->forward(
                                array(
                                    'controller' => 'error',
                                    'action'     => 'show404',
                                )
                            );
                            return false;
                    }
                }
            );

            $evManager->attach(
               "dispatch:afterExecuteRoute",
               function($event, $dispatcher, $exception)
               {
                if(empty($_COOKIE[SITESLUG.'_cnu']))
                {
                  $longip= ip2long(get_ip()) ;
                  $cokkie_value = $longip.'_'.get_user_id($longip);
                  setcookie(SITESLUG.'_cnu', $cokkie_value ,time() + (86400 * 360));
                }else $cokkie_value = $_COOKIE[SITESLUG.'_cnu'];
                //exec("wget -b -cv  http://localhost:3000/collect/push/".$cokkie_value."/la10");
                //exec("wget -b -cv  http://127.0.0.1:8081?site=la10&cokkie_user=".$cokkie_value);
                return true;
               }
            );
            $dispatcher = new \Phalcon\Mvc\Dispatcher();
            $dispatcher->setEventsManager($evManager);
            return $dispatcher;
        },
        true
    );
  }

  private function init_cache($options=array())
  {
                  $this->_di->set('cache', function() {
                           $frontCache = new Phalcon\Cache\Frontend\Data(array("lifetime" => $this->_conf->cache->lifetime));
                           $cache= false;
                             $cache = new Rpp\Extend\Memcache($frontCache, array(
                                "host" => $this->_conf->cache->memcache->host,
                                "port" => $this->_conf->cache->memcache->port,
                                "prefix" => $this->_conf->cache->memcache->prefix,
                                "statsKey" => $this->_conf->cache->memcache->stats,
                                                                                )
                             );
                             $cache->localconnect();
                           return $cache;
                        });
   }


  private function create_application()
  {
    static::$_application  =   new \Phalcon\Mvc\Application($this->_di);
    \Rpp\Services\Get\Content::$cache =  static::$_application->cache ;
  }

  private function create_api()
  {
    static::$_application  =   new \Phalcon\Mvc\Micro($this->_di);
  }

  public function set_application_type($type)
  {
      $this->_application_type = $type;
  }
}

