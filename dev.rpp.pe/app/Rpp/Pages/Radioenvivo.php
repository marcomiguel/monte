<?php

namespace Rpp\Pages;

class Radioenvivo extends \Rpp\Pages\Page {

    public $titulo;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public $player;

    public function __construct() {
        parent::__construct();
        $this->titulo = 'Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
        \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'portada.404';
        $this->comscore = 'page.envivo.radio';
        $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
        $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
        $this->titulo_social = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
        $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
        $this->url_social = '';
        $this->slug = 'radioenvivo';
        $this->preroll = "https://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=/1028310/RPP_Video&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]";
        $this->tipon = 'radio';
        $this->tipop = 'streamRPPRD';
        $this->file = "rtmp://rpplivefs.fplive.net/rpp02live-live/streamRPPRD";
        $this->player = \Rpp\Services\Get\Player::player('radio');
        $this->urlcanonical = '/radioenvivo';
        $this->cover = "images/envivo.jpg";
    }

}