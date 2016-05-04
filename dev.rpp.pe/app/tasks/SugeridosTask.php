<?php
if (!defined('user_notas')) {
   define('user_notas', SITESLUG . ':news:');
}

if (!defined('user_portadas')) {
   define('user_portadas', SITESLUG . ':secciones:');
}

if (!defined('user_temas')) {
   define('user_temas', SITESLUG . ':temas:');
}


if (!defined('user_search')) {
   define('user_search', SITESLUG . ':busquedas:');
}

use Rpp\Repositorio\Builder\SearchPatternBuilder;
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class SugeridosTask extends \Phalcon\CLI\Task
{
	private $user;
	public function mainAction() {
         echo "\n Sugeridos\n";
    }

    public function calculateAction()
    {
	   $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
     $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
     $channel = $connection->channel();
     $channel->queue_declare(SITESLUG.'_user_sugeridos', false, true, false, false);
     echo ' [*] Servicio listener para el calculo de notas sugeridas ,  CTRL+C para cancelar', "\n";
     $callback = function($msg) {
      try{
     	 $node=json_decode($msg->body);
     	 $this->make($node->user);
      }catch (\Exception $e) {
          var_dump($e);
      }
      break;
     };

     $channel->basic_consume(SITESLUG.'_user_sugeridos', '', false, true, false, false, $callback);  
     while(count($channel->callbacks)) {
         $channel->wait();
     }
    }

    public function make($user)
    {
     Cache::request()->save(
	                           'analitica.sugerido.rebuild'.$user,
	                            true,
	                            Cache::get_conf()->cache_time->analitica_user_recomendados_rebuild
                           );

      $intervalos_timeline=array(12,24,36,48,60);
      $nids_view = array();
      $tag_rank_timeline = array();
      $nids_by_tag = array();
      $nids_sugeridos_by_tag = array();
      foreach($intervalos_timeline as $intervalo) {
  	    $now=$intervalo-12;
        $notas_muestra = $this->redis->zRangeByScore(user_notas.$user, strtotime("-$intervalo hours"), strtotime("-$now hours"), array('limit' => array(0,20)));
        $notas_muestra = array_reverse($notas_muestra);
        foreach ($notas_muestra  as $time_nid) {
          $time_nid = explode(":", $time_nid);
          $nids_view[$time_nid[0]]=$time_nid[0];
          $mtags = \Rpp\Services\Get\Content::part($time_nid[0],'tags');
	  	  if(is_array($mtags)){
	         foreach ($mtags as $tag ) {
	            	if(isset($tag_rank_timeline[$tag['slug']])) $tag_rank_timeline[$tag['slug']] ++;
	            	else $tag_rank_timeline[$tag['slug']] = 1 ;
	         }
	      }
        }
      }

      arsort($tag_rank_timeline);

      $tag_rank_timeline = array_slice($tag_rank_timeline,0,15);
      
      $notas_by_tops = $this->redis->zRevRangeByScore('notas:views',10000000 ,0,array('withscores' => TRUE ,'limit' => array(0,60)));
      $notas_by_tops = array_reverse(array_keys($notas_by_tops));
      $notas_by_tops = array_combine($notas_by_tops,$notas_by_tops);
      $notas_by_tops = array_diff($notas_by_tops,$nids_view);

      $SearchPatternBuilder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Tag());
      foreach ($tag_rank_timeline as $slug => $score) {
      	$Pattern= $SearchPatternBuilder->addFields(array("_id"))->addFilter(   array("tags.slug"=> $slug ) )->addLimit(30)->build(); 
      	$result = $Pattern->load();
        foreach ($result as $node) {
	         	$nids_by_tag[$slug][$node->_id] = $node->_id ;
	    }
        $nids_by_tag[$slug]  = array_diff($nids_by_tag[$slug],$nids_view);
      }

      foreach ($nids_by_tag as $slug => $list) {
      	$nids_sugeridos_by_tag[$slug] = array_intersect($list,$notas_by_tops);
      }

      

      $nids_by_secciones  = array();
      $menu = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/menu.ini");
      $secciones=explode(",", $menu->secciones->slug);
      $Pattern= $SearchPatternBuilder->reset( new \Rpp\Repositorio\Builder\Search\Pattern\Seccion() );
      foreach ($secciones as $seccion) {
        $Pattern= $SearchPatternBuilder->addFields(array("_id"))->addSlug($seccion)->addLimit(20)->build(); 
        $result = $Pattern->load();
        foreach ($result as $node) {
	         	$nids_by_secciones[$seccion][$node->_id] = $node->_id ;
	    }

	    $nids_by_secciones[$seccion] = array_diff($nids_by_secciones[$seccion],$nids_view);
      }
      

      $nids_sugeridos_by_secciones= array();
      foreach ($nids_by_secciones as $seccion => $list) {
      	$nids_sugeridos_by_secciones[$seccion] = array_intersect($list,$notas_by_tops);
      }


      /*----guardando tags------*/
      foreach ($nids_sugeridos_by_tag as $tag => $list) {
         var_dump($tag);
  		   Cache::request()->save(
	                           'analitica.sugeridos.tag.'.$tag.'-'.$user,
	                           $list,
	                           Cache::get_conf()->cache_time->analitica_user_sugeridos
                           );
  		   var_dump(Cache::request()->get('analitica.sugeridos.tag.'.$tag.'-'.$user));
      }

      foreach ($nids_sugeridos_by_secciones as $seccion => $list) {
  		   Cache::request()->save(
                   'analitica.sugeridos.seccion.'.$seccion.'-'.$user,
                   $list,
                   Cache::get_conf()->cache_time->analitica_user_sugeridos
               );
  		   var_dump(Cache::request()->get('analitica.sugeridos.seccion.'.$seccion.'-'.$user));
      }

    }
}

class Cache{
  public static $cache;
  public static $conf;



  public  static function request()
  {
   if(empty(self::$cache)) {
    
      $frontCache = new \Phalcon\Cache\Frontend\Data(array("lifetime" => static::get_conf()->memcache->lifetime));
      static::$cache = new \Rpp\Extend\Memcache($frontCache, array(
                                                                        "host" => static::get_conf()->memcache->host,
                                                                        "port" => static::get_conf()->memcache->port,
                                                                        "prefix" => static::get_conf()->memcache->prefix,
                                                                        "statsKey" => static::get_conf()->memcache->stats,
                                                                        ));

      static::$cache->localconnect();

      return   static::$cache;
    }else return static::$cache;
  }

  public static function get_conf()
  {
    if(empty(static::$conf)) return static::$conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/publish_custom.ini");
    else return static::$conf;
  }
 }