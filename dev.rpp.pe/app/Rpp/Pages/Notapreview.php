<?php
namespace Rpp\Pages;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
class Notapreview extends \Rpp\Pages\Page
{
    public $titulo;
    public $channel;
    public $sugeridas;
    public $epl;
    public $comscore;
    public $package;
    public function __construct()
    {
      parent::__construct();
     \Rpp\Services\Get\UrlTrack::$channel = 'articulo.preview';
     $this->epl = 'Portada';
     $this->sugeridas = array();
     $this->comscore = 'nota.preview';
    }
}