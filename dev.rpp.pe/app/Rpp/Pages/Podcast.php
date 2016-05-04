<?php

namespace Rpp\Pages;

use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Services\Get\Sugeridos;
use Shared\Cache;

class Podcast extends \Rpp\Pages\Page {

    public $title;
    public $subTitle;
    public $url;
    public $media;
    public $adUrl;
    public $adImage;

    public function __construct($pcid) {
        $object = \Rpp\Services\Get\Podcast::get($pcid);
        $object->lista[0] = (object) $object->lista[0];
        $this->title = $object->nombre;
        $this->subTitle = $object->lista[0]->titulo;
        $this->url = $object->nombre;
        $this->media = $object->lista[0]->url;
        $this->adUrl = (empty($object->branded_url)) ? "" : $object->branded_url;
        $object->branded = (object) $object->branded;        
        $this->adImage = (empty($object->branded->url)) ? "" : $object->branded->url;
    }

}
