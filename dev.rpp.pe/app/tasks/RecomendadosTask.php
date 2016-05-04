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
class RecomendadosTask extends \Phalcon\CLI\Task
{
    private $user;

    public function mainAction() {
         echo "\n Recomendados\n";
    }
   
    public function calculateAction() 
    {
       $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/mq.ini");
       $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port,$this->mqconf->user, $this->mqconf->pasw);
       $channel = $connection->channel();
       $channel->queue_declare(SITESLUG.'_user_recomendadas', false, true, false, false);
       echo ' [*] Servicio listener para el calculo de notas recomendadas ,  CTRL+C para cancelar', "\n";
       $callback = function($msg) {
        
       try{
       	 $node=json_decode($msg->body);
       	 var_dump($node);
       	 $this->make($node->user);

        }catch (\Exception $e) {
          var_dump($e);
        }
        break;
       };

       $channel->basic_consume(SITESLUG.'_user_recomendadas', '', false, true, false, false, $callback);  
       while(count($channel->callbacks)) {
           $channel->wait();
       }
    }

    public function make($user) {

         Cache::request()->save(
		                           'analitica.recomendadas.rebuild'.$user,
		                            true,
		                            Cache::get_conf()->cache_time->analitica_user_recomendados_rebuild
	                           );


         $intervalos_timeline=array(12,24,36,48,60,72,84,96,108,120);/*intervalos de timeline*/
         $hot_minimo_numero = 2;
         $nids_view = array();
         $nids_suggested = array();
         $secciones_rank_timeline = array();
         $tag_rank_timeline = array();
         
         foreach($intervalos_timeline as $intervalo) {
         	  $now=$intervalo-12;
            $notas_muestra = $this->redis->zRangeByScore(user_notas.$user, strtotime("-$intervalo hours"), strtotime("-$now hours"), array('limit' => array(0,20)));
            $notas_muestra = array_reverse($notas_muestra);
            foreach ($notas_muestra  as $time_nid) {
	         	$time_nid = explode(":", $time_nid);
	         	//var_dump("[", date("Y:m:d G:i:s",$time_nid[1]) , " ]");
	         	$nids_view[$time_nid[0]]=$time_nid[0];
	         	$mtags = \Rpp\Services\Get\Content::part($time_nid[0],'tags');
	         	if(is_array($mtags)){
		            foreach ($mtags as $tag ) {
		            	if(isset($tag_rank_timeline[$tag['slug']])) $tag_rank_timeline[$tag['slug']] ++;
		            	else $tag_rank_timeline[$tag['slug']] = 1 ;
		            }
	         	}
	            $categoria = \Rpp\Services\Get\Content::part($time_nid[0],'categoria')['slug'];

	            if(isset($secciones_rank_timeline[$categoria])) $secciones_rank_timeline[$categoria] ++;
	            else $secciones_rank_timeline[$categoria]  = 1;
            }
         } 

         arsort($tag_rank_timeline);
         arsort($secciones_rank_timeline);

         $portadas_view_rank=array();
         foreach ($intervalos_timeline as $intervalo) {
            $now=$intervalo-12;
         	$portadas_view = $this->redis->zRangeByScore(user_portadas.$user, strtotime("-$intervalo hours"), strtotime("-$now hours"), array('limit' => array(0,20)));
         	foreach ($portadas_view as $portada) {
         		$time_portada = explode(":", $portada);
         		if(isset($portadas_view_rank[$time_portada[0]])) $portadas_view_rank[$time_portada[0]]++;
         		else $portadas_view_rank[$time_portada[0]]=1;
         	}
         }

         arsort($portadas_view_rank);
         
         $nids_portada_top = array(); /*nids de la portada hot*/
         if(count($portadas_view_rank)>0)
         {
            foreach ($portadas_view_rank as $portada => $rank) {
              if($rank >= $hot_minimo_numero)
              {
              	$portada = str_replace(".", "/", $portada);
              	foreach ( \Rpp\Services\Get\Flow::seccion($portada,30) as  $node) {
              	   $nids_portada_top[$node->_id] = $node->_id;	
              	}
              	break;
              }else break;
            }
         }

         /*var_dump("<!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>");
         $ultimas_temas = $this->redis->zRevRange(user_temas.$user, 0,50, true);  

         foreach ($ultimas_temas as $tema => $time) {
         	$tema = explode(":", $tema);
         	var_dump("[",date("Y:m:d h:i:s",$time)," => ", $tema[0] , " ]");
         }

         var_dump("<!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>");
         $ultimas_search = $this->redis->zRevRange(user_search.$user, 0,50, true);
         foreach ($ultimas_search as $search => $time) {
         	var_dump("[",date("Y:m:d h:i:s",$time)," => ", $search , " ]");
         }*/
         $nids_suggested[1]=array();
         $nids_suggested[2]=array();
         $nids_suggested[3]=array();
         $tags_top =  array_slice($tag_rank_timeline,0,3);
         $secciones_top = array_slice($secciones_rank_timeline,0,3);
         if(count($tags_top)>0)
         {
             $tags_slug =   array_keys($tags_top) ; 
	         $SearchPatternBuilder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Tag());
	         $Pattern= $SearchPatternBuilder->addFields(array("_id"))->addFilter(   array("tags.slug"=> $tags_slug[0] ) )->addLimit(20)->build();  
	         $result = $Pattern->load();
	         foreach ($result as $suggested) {
	         	$nids_suggested[1][$suggested->_id] = $suggested->_id ;
	         }


	         $Pattern= $SearchPatternBuilder->addFilter(   array("tags.slug"=>array('$in' => $tags_slug ) ) )->build();         
	         $result = $Pattern->load();
	         foreach ($result as $suggested) {
	         	$nids_suggested[3][$suggested->_id] = $suggested->_id ;
	         }

	       
	         array_pop($tags_top);
	         if(count($tags_top)>0)
	         {

                 $tags_slug =   array_keys($tags_top) ; 
		         $Pattern= $SearchPatternBuilder->addFilter(   array("tags.slug"=> $tags_slug[0] ) )->build();  
		         $result = $Pattern->load();
		         foreach ($result as $suggested) {
		         	$nids_suggested[1][$suggested->_id] = $suggested->_id ;
		         }


		         $Pattern=$SearchPatternBuilder->addFilter(   array("tags.slug"=>array('$in' => $tags_slug ) ) )->build();
		         $result = $Pattern->load();
		         foreach ($result as $suggested) {
		         	$nids_suggested[2][$suggested->_id] = $suggested->_id ;
		         }
	         }
         }



         $add = 20;
         $top_rangos = array(3=>20 , 2=>40 , 1=>60);
         $notas_by_tops = array();
         $sugeridas_news_calculate[3]  = array();
         $sugeridas_news_calculate[2]  = array();
         $sugeridas_news_calculate[1]  = array();
         foreach ( $top_rangos as $id => $rango) {
         	         $notas_by_tops[$id] = $this->redis->zRevRangeByScore(SITESLUG.':notas:views',10000000 ,0,array('withscores' => TRUE ,'limit' => array(($rango-$add),$rango)));
                     $notas_by_tops[$id] = array_reverse(array_keys($notas_by_tops[$id]));
                     $notas_by_tops[$id] = array_combine($notas_by_tops[$id],$notas_by_tops[$id]);
         }



         foreach ($notas_by_tops as $id => $top) {
  	         $notas_by_tops[$id]=array_diff($top,$nids_view);
         }

         foreach ($nids_suggested as $id => $suggested) {
         	$nids_suggested[$id]  = array_diff($suggested,$nids_view);;
         }
        
         $nids_portada_top = array_diff($nids_portada_top,$nids_view);
       

         $sugeridas_portadas_calculate  = array();

         $levels = array(3,2,1);
         foreach ($levels as $lsuge) {
		         $sugeridas_news_calculate['level'][$lsuge] = array();
		         foreach ($levels as $ltops) {	
		           $sugeridas_news_calculate['level'][$lsuge]=$sugeridas_news_calculate['level'][$lsuge]+array_intersect($nids_suggested[$lsuge],$notas_by_tops[$ltops]);
		         }
         }

         foreach ($levels as $ltops) {
         	$sugeridas_portadas_calculate = $sugeridas_portadas_calculate + array_intersect($nids_portada_top,$notas_by_tops[$ltops]);
         }


         $nids_sugeridos = array();
  
         $nids_sugeridos =  array_slice($sugeridas_news_calculate['level'][3],0,3,true)
                           + array_slice($sugeridas_portadas_calculate,0,2,true)+array_slice($sugeridas_news_calculate['level'][3],3,6,true)
                           + array_slice($sugeridas_portadas_calculate,2,2,true)+array_slice($sugeridas_news_calculate['level'][3],6,20,true)
                           + array_slice($sugeridas_news_calculate['level'][2],0,3,true) + array_slice($sugeridas_portadas_calculate,4,8,true)
                           + array_slice($sugeridas_news_calculate['level'][2],3,true)+$sugeridas_news_calculate['level'][1];

         $nids_sugeridos = array_slice($nids_sugeridos,0,15,true);


	     Cache::request()->save(
		                           'analitica.recomendadas.'.$user,
		                           $nids_sugeridos,
		                           Cache::get_conf()->cache_time->analitica_user_recomendados
	                           );

         $this->viewCache->delete('sidebar.recomendados.'.$user);

         var_dump(Cache::request()->get('analitica.recomendadas.'.$user));


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