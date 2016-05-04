<?php
namespace Rpp\Services\Unpublish;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Repositorio\Builder\Search\Pattern\Nota;
use \Shared\Cache;
use \Shared\Cachejson;
class Noticia extends \Phalcon\Mvc\User\Component{
  private $nota;
  private $nid;
  private $patternBuilder;
  public function __construct($nid)
  {
	 $this->nid = (int) $nid;
   $this->patternBuilder = new SearchPatternBuilder(new Nota());
  }
  
  public function builder()
  {
   var_dump("Corrigiendo bug eliminar");
   $Pattern = $this->patternBuilder->addFilter(array('_id'=>$this->nid , 'estado' => 'despublicado'))->build();
   $this->nota = $Pattern->load(); 
   foreach ($this->nota as $key => $value) {
    
   Cache::request()->save(
                       Cache::get_conf()->cache_prefix->nota.$this->nid.'.'.$key,
                       null,
                       Cache::get_conf()->cache_time->nota
    );
    Cachejson::request()->save(
                       Cachejson::get_conf()->cache_prefix->nota.$this->nid.'.'.$key,
                       null,
                       Cachejson::get_conf()->cache_time->nota
                        );

   }


    Cache::request()->save(
                        Cache::get_conf()->cache_prefix->nota.$this->nid.'.node',
                        null,
                        Cache::get_conf()->cache_time->nota
                      );

    Cachejson::request()->save(
                        Cachejson::get_conf()->cache_prefix->nota.$this->nid.'.node',
                        null,
                        Cachejson::get_conf()->cache_time->nota
                        );

   \Rpp\Services\Get\Content::$content=null;
   \Rpp\Services\Get\Flow::$flow=null;
   $home = new \Rpp\Services\Publish\Dominio\Home();
   $home->make();

    //---flujo galerias----//
    if($this->nota->tipo=='galeria')\Rpp\Services\Get\Gallery::home();
    //--flujo de notas tipo blog/autor----//
    elseif($this->nota->tipo=='blog')\Rpp\Services\Get\Flow::autor();
    //--flujo de notas tipo brandcontent----//
    elseif($this->nota->tipo=='brandcontent')\Rpp\Services\Get\Flow::brandcontent();
    
    \Rpp\Services\Get\Instantarticle::flow();
    \Rpp\Services\Get\Instantarticle::flowupd();


   $seccion = new \Rpp\Services\Publish\Dominio\Seccion();
   var_dump($this->nota->categoria_slug);
   foreach ($this->nota->categoria_slug as $seccion_slug) {
      $seccion_slug = explode("/",$seccion_slug);
      unset($seccion_slug[0]);
      if(count($seccion_slug)>0)
      {
        for ($i=count($seccion_slug); $i > 0 ; $i--) { 
          //var_dump('del:',implode('/',$seccion_slug));
          $seccion->set_slug(implode('/',$seccion_slug));
          $seccion->make();
          unset($seccion_slug[$i]);
        }
      }
    }

    $tag = new \Rpp\Services\Publish\Dominio\Tag();
    foreach ($this->nota->tags as $tag_slug) {
       $tag->set_slug($tag_slug['slug']);
       $tag->make();
    }

    $this->viewCache->delete("portada.bodyopen.home" ); 
    $this->viewCache->delete("portada.bodycentral.home" ); 
    $this->viewCache->delete("portada.bodyclose.home" );

    ###remaquetado##########
    $this->viewCache->delete("portada.body.open.home" ); 
    $this->viewCache->delete("portada.body.central.home" ); 
    $this->viewCache->delete("portada.body.close.home" );

    if($this->nota->tipo == 'galeria')
    {
          foreach ($this->nota->galeria as $v => $e) {
            $this->viewCache->delete("nota.header.geleria." . $this->nid . "." . $v );
            ###remaquetado########## 
            $this->viewCache->delete("nota.header.galeria." . $this->nid . "." . $v ); 
          }      
    } 
    $this->viewCache->delete("nota.wrap.group." . $this->nid );
    ###remaquetado##########
    $this->viewCache->delete( "nota.article.body." . $this->nid ); 

    var_dump("terminate.......");
  }
}

