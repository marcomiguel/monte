<?php

namespace Rpp\Pages\Preview;

class Tag extends \Rpp\Pages\Page {

    public $slug;
    public $titulo;
    public $flujo;
    public $channel;
    public $ref;
    public $epl;
    public $comscore;
    public $tag_info;
    public $description;
    public $keywords;

    public function __construct($slug, $dispatcher) {
        parent::__construct();
        $this->slug = $slug;
        $this->seccion = $slug;
        $this->tema = $slug;
        $this->load_tag_info();
        $this->tag_personalidad = (int)!empty(@$this->tag_info->personalidad);
        $this->package = 'tag';
        \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'tema.' . $slug;
        $this->ref = load_ref();
        $this->load_comscore();
        $this->load_epl();
        $this->titulo = $this->tag_info->nombre.': Noticias, Imágenes, Fotos, Vídeos, audios y más';
        $this->description = 'Todo sobre '.$this->tag_info->nombre.', noticias en imagenes, fotos, videos, audios, infografias, interactivos y resumenes de '.$this->tag_info->nombre;
        $this->keywords = $this->tag_info->nombre.', noticias de '.$this->tag_info->nombre.', imagenes de '.$this->tag_info->nombre.', fotos de '.$this->tag_info->nombre.', videos de '.$this->tag_info->nombre.', infografias de '.$this->tag_info->nombre.', interactivos de '.$this->tag_info->nombre.', resumenes de '.$this->tag_info->nombre;
        $this->titulo_social = $this->tag_info->nombre.': Noticias, Imágenes, Fotos, Vídeos, audios y más';
        $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
        $this->url_social = '';
        $this->urlcanonical ='/tema-'.$slug;
        $this->tag_slug_portada = 'tag/'.$this->slug;
    }

    public function load_comscore() {
        $this->comscore = 'tags.' . $this->slug . '.portada';
        $this->dax_theme_img = '&amp;theme=|' . $this->slug . '|';
        $this->dax_theme_script = '&theme=|' . $this->slug . '|';
    }

    public function load_tag_info() {
        $this->tag_info = \Rpp\Services\Get\Tags::get_tag($this->slug);
    }

    public function load_epl() {        
        $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3","Intersticial","Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" ,"Interna10" ';
        $this->epl_kvs = $this->slug;
        $this->scri_bgbanner = '1';
    }


   public function load_destacado($slug,$obj)
   {
     \Rpp\Services\Get\Destacados::set_portada( 'tag/'.$slug , $obj );   
   }
}
