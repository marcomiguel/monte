<?php
namespace Rpp\Pages;
class Add extends \Rpp\Pages\Page
{

    public function __construct($nid,$position)
    {
      parent::__construct();
      $this->nid = (int)$nid;
      $this->position = $position;
      $this->slug_seccion = explode("/",\Rpp\Services\Get\Content::node($nid)->categoria['slug']);
      $this->brandeo = !empty(\Rpp\Services\Get\Content::part($this->nid,'imagen_branding'));
      
      $seccion_epl = str_replace('-','_', $this->slug_seccion[1]);
      $categoria_epl = str_replace('-','_', @$this->slug_seccion[2]);
      

      $eplsec=array( $seccion_epl , 'Tag');

      $this->epl_sec = $eplsec[$this->brandeo];

      $eplss['nota']=array( $categoria_epl.'_Nota' , 'Auspiciado_Nota');
      $eplss['galeria']=array( $categoria_epl.'_Galeria' , 'Auspiciado_Galeria');


      if(\Rpp\Services\Get\Content::node($this->nid)->tipo=='galeria'){ 
        $this->epl_ss = 'ss:"'.$eplss['galeria'][$this->brandeo].'",'; 
        $this->slug_categoria=$eplss['galeria'][$this->brandeo];
      }else{ 
        $this->epl_ss = 'ss:"'.$eplss['nota'][$this->brandeo].'",';
        $this->slug_categoria=$eplss['nota'][$this->brandeo];
      }
      

      $this->preroll = "";
      $this->epl_position = '"Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" , "Interna10"';
      $this->epl_kvs = "";
      $this->scri_bgbanner = '1';
    }

}