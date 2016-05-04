<?php
namespace Rpp\Pages;
use \Shared\MQ;
use \Shared\Cache;
class Resultados extends \Rpp\Pages\Page
{
    public $titulo;
    public $channel;
    public $ref ;
    public $slug ;
    public $torneo;
    public $fase;
    public $epl;
    public $comscore;
    public $package;
    public $tipofase;
    public $description;
    public $keywords;
    public function __construct()
    {
      parent::__construct();
      $this->titulo='Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'resultados.';
      $this->ref = load_ref();
      $this->epl = 'Portada';
      $this->tipofase = 1;
      $this->slug = 'resultados';
      $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
      $this->titulo_social = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
     $this->url_social = '';
      $this->portada = 'resultados';
    }


    public function load_custom()
    {
      switch ($this->torneo) {
        case "peru":
          $this->fase = 'torneo-clausura-copa-movistar';
          $this->seccion = 'Fútbol Peruano';
          $this->categoria = 'Copa Movistar';
          $this->epl = 'Futbol_Peruano_Descentralizado';
          $this->slug = array('futbol-peruano','descentralizado');
          break;
        case "champions":
          $this->fase = 'fase-de-grupos';
          $this->seccion = 'Fútbol Internacional';
          $this->categoria = 'Champions League';
          $this->epl = 'Futbol_Internacional_Champions_League';
          $this->slug = array('futbol-internacional','champions-league');
          break;
        case "premierleague":
          $this->fase = 'temporada-regular';
          $this->seccion = 'Fútbol Internacional';
          $this->categoria = 'Premier League';
          $this->epl = 'Futbol_Internacional_Premier_League';
          $this->slug = array('futbol-internacional','premier-league');
          break;
        case "espana":
          $this->fase = 'temporada-regular';
          $this->seccion = 'Fútbol Internacional';
          $this->categoria = 'La Liga';
          $this->epl = 'Futbol_Internacional_Liga_Bbva';
          $this->slug = array('futbol-internacional','liga-bbva');
          break;
        case "italia":
          $this->fase = 'temporada-regular';
          $this->seccion = 'Fútbol Internacional';
          $this->categoria = 'Serie A';
          $this->epl = 'Futbol_Internacional_Serie_A';
          $this->slug = array('futbol-internacional','serie-a');
          break;
        case "alemania":
          $this->fase = 'temporada-regular';
          $this->seccion = 'Fútbol Internacional';
          $this->categoria = 'Bundesliga';
          $this->epl = 'Futbol_Internacional_Bundesliga';
          $this->slug = array('futbol-internacional','bundesliga');
          break;
        default:
          $this->fase = 'temporada-regular';
          $this->seccion = 'Fútbol Internacional';
          $this->categoria = 'La10';
          $this->slug = array('futbol-internacional','');
          break;
      }
    }

    public function recalculate()
    {
      if(empty(Cache::request()->get(MQ::get_conf()->cache_prefix->resultados_df.$this->torneo)))
      {
         if(Cache::request()->status_connect()) {
          Cache::request()->save(MQ::get_conf()->cache_prefix->resultados_df.$this->torneo,true,MQ::get_conf()->cache_time->resultados_df);
          MQ::send_message(MQ::get_conf()->colas->resultados_df,array("torneo" => $this->torneo ,"site"=> SITESLUG));
         }else return false;
      }
    }
}
