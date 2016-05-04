<?php

namespace Rpp\Pages;

class Programacioncabina extends \Rpp\Pages\Page {

    public $titulo;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;

    public function __construct() {
        parent::__construct();
        $this->titulo = 'HORARIO DE PROGRAMACIÓN RPP TV  | RPP NOTICIAS';
        \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'page.programacion.cabina';
        $this->comscore = 'page.programacion.cabina';
        $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
        $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
        $this->titulo_social = 'HORARIO DE PROGRAMACIÓN RPP TV  | RPP NOTICIAS';
        $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
        $this->url_social = '';
        $this->slug = 'programacion/tv';
        $this->preroll = "http://ads.us.e-planning.net/eb/4/17632/programacion_tv/Preroll?o=v&ma=1&vv=3";
        $this->tipon = 'cabina';
        $this->tipop = 'streamRPPRD';
        $this->urlcanonical ='/programacion/tv';
    }

}
