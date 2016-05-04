<?php
namespace Rpp\Pages;
class Relectorales extends \Rpp\Pages\Page
{
    public $titulo;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public function __construct()
    {
      parent::__construct();
      $this->titulo='Elecciones Perú 2016: Noticias, Imágenes, Fotos, Vídeos, audios y más';
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'elecciones-peru-2016.resultados-electorales';
      $this->description = 'Todo sobre Elecciones Perú 2016, noticias en imagenes, fotos, videos, audios, infografias, interactivos y resumenes de Elecciones Perú 2016';
      $this->keywords = 'Elecciones Perú 2016, noticias de Elecciones Perú 2016, imagenes de Elecciones Perú 2016, fotos de Elecciones Perú 2016, videos de Elecciones Perú 2016, infografias de Elecciones Perú 2016, interactivos de Elecciones Perú 2016, resumenes de Elecciones Perú 2016';
      $this->titulo_social = 'Elecciones Perú 2016: Noticias, Imágenes, Fotos, Vídeos, audios y más';
      $this->img_social = 'http://s.rpp-noticias.io/elecciones-peru-2016/img/resultado_electorales.jpg';
      $this->url_social = '';
      $this->load_comscore();
      $this->load_epl();
    }


    public function load_epl() {        
        $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3","Intersticial","Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" ,"Interna10" ';
        $this->epl_kvs = 'elecciones-peru-2016';
        $this->scri_bgbanner = '1';
        $this->epl_sec = 'Tag'; 
    }


     public function load_comscore() {
        $this->comscore = 'elecciones-peru-2016.resultados.electorales';
        $this->dax_theme_img = '&amp;theme=|elecciones-peru-2016|';
        $this->dax_theme_script = '&theme=|elecciones-peru-2016|';
    }

}

