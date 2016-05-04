<?php
namespace Rpp\Services\Publish;

class Noticia extends \Phalcon\Mvc\User\Component{
  private $nota;
  private $nid;
  private $patternBuilder;
  private $last;
  public function __construct($nid)
  {
  	 $this->nid = (int) $nid;
     $this->last = false;
  }
  
  public function set_last($last)
  {
     $this->last = $last;
  }

  public function builder()
  {



   $this->nota=\Rpp\Services\Get\Content::nota($this->nid);
   
   \Rpp\Services\Get\Content::node($this->nid);
   \Rpp\Services\Get\Flow::home();

 

    $this->reload_categoria($this->nota->categoria_slug);

    
    $this->reload_tag($this->nota->tags);

    

    //---flujo galerias----//
    if($this->nota->tipo=='galeria')\Rpp\Services\Get\Gallery::home();
    //--flujo de notas tipo blog/autor----//
    elseif($this->nota->tipo=='blog'){
      \Rpp\Services\Get\Flow::autor();
      \Rpp\Services\Get\Flow::autor($this->nota->autor['slug']);
    }
    //--flujo de notas tipo brandcontent----//
    elseif($this->nota->tipo=='brandcontent')\Rpp\Services\Get\Flow::brandcontent();

    ##########instant article#####################################
    if(@$this->nota->instant_article){
      \Rpp\Services\Get\Instantarticle::flow();
      \Rpp\Services\Get\Instantarticle::flowupd();
    } elseif(@$this->last->instant_article){
      \Rpp\Services\Get\Instantarticle::flow();
      \Rpp\Services\Get\Instantarticle::flowupd();
    } 
    ##############################################################
    
     if(@$this->last->categoria) $this->reload_categoria($this->last->categoria);
     
     if(@$this->last->tags)
     {
      $this->last->tags = json_decode(json_encode($this->last->tags),true);
      if($this->last->tags!=$this->nota->tags)$this->reload_tag($this->last->tags);
     }
     if(@$this->last->tipo){
          if($this->last->tipo=='galeria')galeria\Rpp\Services\Get\Gallery::home();
          if($this->last->tipo=='blog')\Rpp\Services\Get\Flow::autor();
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
    $this->viewCache->delete( "nota.wrap.group." . $this->nid ); 
    ###remaquetado##########
    $this->viewCache->delete( "nota.article.body." . $this->nid ); 

    var_dump("terminate.......");
  }

  public function metas()
  {
    \Rpp\Services\Get\Content::$content=null;
    \Rpp\Services\Get\Content::$nota_repo= null;
    $stats = \Rpp\Services\Get\Content::part($this->nid , "stats");
    $last_modified = \Rpp\Services\Get\Content::part($this->nid , "last_modified");
    var_dump($stats,$last_modified);
  }

  private function builder_view()
  {
    $this->nota=\Rpp\Services\Get\Content::nota($this->nid);
  }

  private function reload_categoria($categoria)
  {
   foreach ($categoria as $seccion_slug){
      $seccion_slug = explode("/",$seccion_slug);
      unset($seccion_slug[0]);
      if(count($seccion_slug)>0)
      {
        for ($i=count($seccion_slug); $i > 0 ; $i--) { 
          \Rpp\Services\Get\Flow::seccion(implode('/',$seccion_slug));
          unset($seccion_slug[$i]);
        }
      }
    }
  }



  private function reload_tag($tags)
  {
    foreach ($tags as $tag_slug) {
       \Rpp\Services\Get\Flow::tag($tag_slug['slug']);
       \Shared\Cache::request()->delete(\Shared\Cache::get_conf()->cache_prefix->tag.'relatedtag.'.$tag_slug['slug']);
    }
  }
}
