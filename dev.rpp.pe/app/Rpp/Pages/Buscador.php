<?php
namespace Rpp\Pages;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
class Buscador extends \Rpp\Pages\Page
{
	  public $slug;
    public $slug_seccion;
    public $slug_categoria;
    public $titulo;
    public $response;
    public $num_found;
    public $search_text;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public function __construct( )
    {
      parent::__construct();
      $this->titulo='Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
      $this->epl_sec = 'Buscador';
      $SearchPatternBuilder = new SearchPatternBuilder(new \Rpp\Repositorio\Builder\Search\Pattern\Buscador());
      $request = new \Phalcon\Http\Request();
      $this->search_text = urlencode($request->getPost("texto"));
      if(!empty($_GET['q'])) $this->search_text = urlencode($_GET['q']);
      if(empty($this->search_text))$this->response=null;
      else{
      	$Pattern = $SearchPatternBuilder->addFilter( array('text' => $this->search_text ) )->build(); 
        $this->response=json_decode($Pattern->load())->response;
      }
      $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
      $this->titulo_social = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
     $this->url_social = '';
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'portada.buscador';
      $this->comscore='buscador.'.$this->search_text;
      $this->slug='buscar';
    }


}