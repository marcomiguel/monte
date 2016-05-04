<?php

 use Phalcon\DI\FactoryDefault\CLI as CliDI,
     Phalcon\CLI\Console as ConsoleApp;

 define('VERSION', '1.0.0');

 //Using the CLI factory default services container
 $di = new CliDI();

 // Define path to application directory
 if (!defined('DIRS')) {
 define('DIRS', DIRECTORY_SEPARATOR);
}

if (!defined('ROOTFULLPATH')) {
define('ROOTFULLPATH', dirname(__DIR__));
}

if (!defined('APPFULLPATH')) {
define('APPFULLPATH', ROOTFULLPATH.DIRS.'app');
}

if(!defined('AMBIENTE')){
    define('AMBIENTE', 'DESARROLLO');
}

if(!defined('CONFIG_PATH'))
{
    if(is_dir(APPFULLPATH.DIRS.'config'.DIRS.AMBIENTE))define('CONFIG_PATH', APPFULLPATH.DIRS.'config'.DIRS.AMBIENTE);
    else define('CONFIG_PATH', APPFULLPATH.DIRS.'config');
}

$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/config.ini");

if(!defined('SITESLUG')){
   define('SITESLUG',$conf->site->slug );
}
 /**
  * Register the autoloader and tell it to register the tasks directory
  */
 $loader = new \Phalcon\Loader();

 $loader->registerNamespaces(array(
                                    'PhpAmqpLib' => ROOTFULLPATH .'/vendor/videlalvaro/php-amqplib/PhpAmqpLib',
                                    'Rpp\Services' => APPFULLPATH .'/Rpp/Services/',
                                    'Shared' => APPFULLPATH .'/Rpp/Services/Shared/Publish/',
                                    'Rpp\Extend' => APPFULLPATH .'/Rpp/Extend/',
                                    'Rpp\Analytics' => APPFULLPATH .'/Rpp/Analytics/',
                                    'Rpp\Destacados' => APPFULLPATH .'/Rpp/Destacados/',
                                    'Rpp\Repositorio' => APPFULLPATH .'/Rpp/Repositorio/',
                                    'Rpp\Dominio' => APPFULLPATH .'/Rpp/Dominio/',
                                  ));

 $loader->registerDirs(
     array(
         ROOTFULLPATH .DIRS. 'app/tasks'
     )
 );
 $loader->register();


 $di->set('collectionManager', function(){
         return new Phalcon\Mvc\Collection\Manager();
    }, true);

 $di->set('mongo', function() use ($conf) {
                             $mongo = new MongoClient("mongodb://".$conf->mongo->credentials.$conf->mongo->host.":".$conf->mongo->port."/".$conf->mongo->db);
                             return $mongo->selectDB( $conf->mongo->db );
                         }, true);


 $di->set('cache', function() use ($conf){
           $frontCache = new \Phalcon\Cache\Frontend\Data(array("lifetime" => $conf->cache->lifetime));
           $cache = false;
             $cache = new \Rpp\Extend\Memcache($frontCache, array(
                "host" => $conf->cache->memcache->host,
                "port" => $conf->cache->memcache->port,
                "prefix" => $conf->cache->memcache->prefix,
                "statsKey" => $conf->cache->memcache->stats,
                                                                )
             );
             $cache->localconnect();
           return $cache;
        });


  $view = new \Phalcon\Mvc\View();
  $view->setViewsDir(APPFULLPATH.$conf->phalcon->viewsDir);
         
  $view->registerEngines(
                array( $conf->volt->extn  =>     
   function($view, $di) {
      $volt = new \Phalcon\Mvc\View\Engine\Volt($view, $di);
      $compiler = $volt->getCompiler();
      $compiler->addFunction('getNode', '\Rpp\Services\Get\Content::node');
      $compiler->addFunction('getPart', '\Rpp\Services\Get\Content::part');
      $compiler->addFunction('nUrl', '\Rpp\Services\Get\Content::nurl');
      $compiler->addFunction('TrackUrl', '\Rpp\Services\Get\UrlTrack::add_params');
      $compiler->addFunction('TrackUrlSocial', '\Rpp\Services\Get\UrlTrack::add_params_social');
      $compiler->addFunction('cdn_image', '\Rpp\Services\Get\UrlMedia::image');
      $compiler->addFunction('df_match', '\Rpp\Services\Get\Resultados::match');
      $compiler->addFunction('df_campeonato', '\Rpp\Services\Get\Resultados::campeonato');
      $compiler->addFunction('df_torneo', '\Rpp\Services\Get\Dfactory::torneo');
      return $volt;
    }
  ));
  $view->setVar("trackurl", true);
  $view->setVar("host", $conf->server->host );
  $view->setVar("eversion", $conf->estaticos->version );
  $view->setVar("ehost", $conf->estaticos->host );
  $di->set('view',$view);

  $di->set('viewCache', function() use ($conf) {
           $frontCache = new Phalcon\Cache\Frontend\Output(array("lifetime" => $conf->viewcache->lifetime));
           /*$cache = new Rpp\Extend\Publish\MemcacheView($frontCache, array(
                        "host" => $conf->viewcache->memcache->host,
                        "port" => $conf->viewcache->memcache->port,
                        "prefix" => $conf->viewcache->memcache->prefix,
                        "statsKey" => $conf->viewcache->memcache->stats,
                                                               )
                     );*/

           $cache = new Rpp\Extend\Libmemcached($frontCache, array(
                                                                      "servers" => array(
                                                                                           array('host' => $conf->viewcache->memcache->host,
                                                                                                 'port' => $conf->viewcache->memcache->port,
                                                                                                 'weight' => 1),
                                                                                               ),
                                                                       "prefix" => $conf->viewcache->memcache->prefix,
                                                                       "statsKey" => $conf->viewcache->memcache->stats,
                                                                  )
                             );
           $cache->localconnect();
                   return $cache;
                });

  $di->set('redis',function() use ($conf) {
                                 $redis=  new \Redis();
                                 $redis->connect($conf->redis->host,$conf->redis->port);
                                 return $redis;
                              }, true);

 //Create a console application
 $console = new ConsoleApp();
 $console->setDI($di);

 /**
 * Process the console arguments
 */
 $arguments = array();
 foreach($argv as $k => $arg) {
     if($k == 1) {
         $arguments['task'] = $arg;
     } elseif($k == 2) {
         $arguments['action'] = $arg;
     } elseif($k >= 3) {
        $arguments['params'][] = $arg;
     }
 }

 // define global constants for the current task and action
 define('CURRENT_TASK', (isset($argv[1]) ? $argv[1] : null));
 define('CURRENT_ACTION', (isset($argv[2]) ? $argv[2] : null));

 try {
     // handle incoming arguments
     $console->handle($arguments);
 }
 catch (\Phalcon\Exception $e) {
     echo $e->getMessage();
 }