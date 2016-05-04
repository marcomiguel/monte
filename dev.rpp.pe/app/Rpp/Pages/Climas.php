<?php
namespace Rpp\Pages;
class Climas extends \Rpp\Pages\Page
{
    public $titulo;
    public $channel;
    public $epl;
    public $comscore;
    public $description;
    public $keywords;
    public $slug;
    public $pronostico;
    public function __construct()
    {
      parent::__construct();
      $this->titulo='Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'portada.concursos';
      $this->comscore = 'clima.paginaprincipal';
      $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
      $this->titulo_social = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
      $this->url_social = '';
    }

    public function load_pronostico()
    {
      $data['Mon']=array('label' => 'Lunes');
      $data['Tue']=array('label' => 'Martes');
      $data['Wed']=array('label' => 'Miércoles' );
      $data['Thu']=array('label' => 'Jueves');
      $data['Fri']=array('label' => 'Viernes');
      $data['Sat']=array('label' => 'Sábado');
      $data['Sun']=array('label' => 'Domingo');
      $pronostico = array();
      foreach (\Rpp\Services\Get\Climas::get($this->slug)->item['forecast'] as $key => $day) {
         $pronostico[] = array('nombre' => $data[$day['day']]['label'] , 'codigo' => $day['code'] , 'minimo' => $day['low'] , 'maximo'=>  $day['high']);
      }

      $this->pronostico = $pronostico;
    }

}

