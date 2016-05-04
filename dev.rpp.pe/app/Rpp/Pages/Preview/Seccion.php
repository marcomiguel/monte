<?php
namespace Rpp\Pages\Preview;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
class Seccion extends \Rpp\Pages\Page
{
	  public $slug;
    public $slug_seccion;
    public $slug_categoria;
    private $dispatcher;
    public $titulo;
    public $seccion_info;
    public $package;
    public $channel;
    public $ref ;
    public $epl;
    public $comscore;
    public $torneo;
    public $description;
    public $keywords;
    public $keyseccion;
    public function __construct($slug_seccion,$dispatcher)
    {
      parent::__construct();
      $this->slug_seccion = $slug_seccion;
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'seccion.'.$this->slug_seccion;
      $slug = $this->slug_seccion;
      $this->package = 'seccion';
      
      $this->slug=$slug;
      $this->portada = str_replace("/", ".", $this->slug); 
      $this->keyseccion = str_replace("/", "-", $this->slug); 
      $this->dispatcher=$dispatcher;
      $this->load_seccion_info(); 
      $this->load_comscore();
      $this->load_epl();     
      $this->titulo ='Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
      $this->description = 'RPP Noticias tiene las &uacute;ltimas noticias sobre pol&iacute;tica, futbol y far&aacute;ndula nacional e internacional. Ediciones regionales y de todo el Peru';
      $this->keywords = 'rppnoticias, noticias del peru y el mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump';
      $this->titulo_social = 'Noticias del Peru y del Mundo ,Ollanta Humala,Nadine Heredia,Perumin,Caso Oropeza,Humberto Martínez Morosini,Aylan Kurdi,Donald Trump  | RPP NOTICIAS';
      $this->img_social = 'http://www.rpp.com.pe/tmp/img/logo_rpp.png';
      $this->url_social = '';
      $this->ref = load_ref(); 
    }

    private function load_seccion_info()
    {
     $this->seccion_info = $this->load_agrupacion($this->slug);
     if($this->seccion_info){
        $this->load_agrupador_rewrite();
        return true;
     } 
     
     $this->seccion_info=\Rpp\Services\Get\Categorias::get_categoria($this->slug);

     if(!is_object($this->seccion_info))
     {
       $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
     }
    }


    public function load_comscore()
    {

       $this->comscore = explode('-',$this->keyseccion);
       array_walk($this->comscore , function(&$value) { $value = ucwords($value); }); 
       $this->comscore = implode('_', $this->comscore).'.paginaprincipal';
     
       $this->dax_category_img='&amp;category='.$this->portada;
       $this->dax_category_script='&category='.$this->portada;
    }

    public function load_epl()
    {
      $this->epl = explode('-' , $this->keyseccion);
      array_walk($this->epl, function(&$value) { $value = ucwords($value); });
      $this->epl = implode('_', $this->epl);
    }

    public function load_agrupador_rewrite()
    {
      $agrupador['autores']['epl'] = 'autores';
      $agrupador['autores']['submenu']  = 'tags';

      $agrupador['politica']['epl'] = 'politica';
      $agrupador['politica']['submenu']  = 'seccion';

      $agrupador['actualidad']['epl'] = 'lima';
      $agrupador['actualidad']['submenu']  = 'agrupador';

      $agrupador['deportes']['epl'] = 'futbol';
      $agrupador['deportes']['submenu'] = 'agrupador';

      $agrupador['entretenimiento']['epl'] = 'tv';
      $agrupador['entretenimiento']['submenu']='agrupador';

      $agrupador['peru']['epl'] = 'peru';
      $agrupador['peru']['submenu'] = 'seccion';

      $agrupador['mundo']['epl'] = 'mundo';
      $agrupador['mundo']['submenu'] = 'seccion';

      $agrupador['economia']['epl'] = 'economia';
      $agrupador['economia']['submenu'] = 'seccion';

      $agrupador['vida']['epl'] = 'vida-y-estilo';
      $agrupador['vida']['submenu'] = 'agrupador';

      $agrupador['tec']['epl'] = 'tecnologia';
      $agrupador['tec']['submenu'] = 'agrupador';

      $agrupador['viral']['epl'] = 'virales';
      $agrupador['viral']['submenu'] = 'agrupador';


      $this->comscore = $agrupador[$this->slug_seccion]['epl'].'.'.$this->slug_seccion.'.portada';
      $this->epl_sec =$agrupador[$this->slug_seccion]['epl'];

      $this->submenu = $agrupador[$this->slug_seccion]['submenu'];

    }


    public function load_agrupacion($slug)
    {
      $agrupador['autores'] = json_decode(json_encode(array('_id'=> 'rpp/autores', 'parent_slug' => 'autores' , 'seccion'=>'Autores')), FALSE);
      $agrupador['actualidad'] = json_decode(json_encode(array('_id'=> 'rpp/actualidad', 'parent_slug' => 'actualidad' , 'seccion'=>'Actualidad')), FALSE);
      $agrupador['deportes'] = json_decode(json_encode(array('_id'=> 'rpp/deportes','parent_slug' => 'deportes' ,'seccion'=>'Deportes')), FALSE);
      $agrupador['entretenimiento'] = json_decode(json_encode(array('_id'=> 'rpp/entretenimiento', 'parent_slug' => 'entretenimiento', 'seccion'=>'Entretenimiento')), FALSE);
      $agrupador['peru'] = json_decode(json_encode(array('_id'=> 'rpp/peru', 'parent_slug' => 'peru' ,  'seccion'=>'Perú')), FALSE);
      $agrupador['mundo'] = json_decode(json_encode(array('_id'=> 'rpp/mundo', 'parent_slug' => 'mundo' , 'seccion'=>'Mundo')), FALSE);
      $agrupador['economia'] = json_decode(json_encode(array('_id'=> 'rpp/economia', 'parent_slug' => 'economia' , 'seccion'=>'Economía')), FALSE);
      $agrupador['vida'] = json_decode(json_encode(array('_id'=> 'rpp/vida', 'parent_slug' => 'vida' , 'seccion'=>'Vida')), FALSE);
      $agrupador['tec'] = json_decode(json_encode(array('_id'=> 'rpp/tec', 'parent_slug' => 'tec' , 'seccion'=>'Tecno')), FALSE);
      $agrupador['viral'] = json_decode(json_encode(array('_id'=> 'rpp/virales', 'parent_slug' => 'virales' , 'seccion'=>'Viral')), FALSE);

      if(array_key_exists($slug,$agrupador)) return $agrupador[$slug];
      
      return false;
    }

    public function load_destacado($slug,$obj)
    {
        \Rpp\Services\Get\Destacados::set_portada($slug,$obj);
    }
}