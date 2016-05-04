<?php
namespace Rpp\Pages;
class Debate extends \Rpp\Pages\Page
{
    public $titulo;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public $candidatos;
    public function __construct($slug)
    {
      parent::__construct();
      $this->candidato_slug = $slug;
      $this->titulo='Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'portada.resumen.de.la.hora';
      $this->ref = load_ref();
      $this->load_comscore();
      $this->comscore = 'resumen_de_la_hora';
      $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
      $this->titulo_social = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
      $this->url_social = '';
      
    }

     public function load_comscore() {
        $this->comscore = 'elecciones-peru-2016.debate.resultados';
        $this->dax_theme_img = '&amp;theme=|elecciones-peru-2016|';
        $this->dax_theme_script = '&theme=|elecciones-peru-2016|';
    }

    public function load_epl() {        
        $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3","Intersticial","Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" ,"Interna10" ';
        $this->epl_kvs = 'elecciones-peru-2016';
        $this->scri_bgbanner = '1';
        $this->epl_sec = 'Tag'; 
    }
}

