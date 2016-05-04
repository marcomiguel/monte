<?php
namespace Rpp\Pages;
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
    public $agrupador = false;
    public function __construct($slug_seccion,$slug_categoria,$dispatcher)
    {
      parent::__construct();
      $this->slug_seccion = $slug_seccion;
      $this->slug_categoria = $slug_categoria;
      $package = false;
      if(empty($this->slug_categoria)){
        \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'seccion.'.$this->slug_seccion;
        $slug = $this->slug_seccion;
        $this->package = 'seccion';
        $this->load_epl_seccion();
        $this->load_comscore_seccion();
      } else{
        \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'categoria.'.$this->slug_categoria;
        $slug = $this->slug_seccion."/".$this->slug_categoria;
        $this->package  = 'categoria';
        $this->load_epl_categoria();
        $this->load_comscore_categoria();
      } 
      $this->submenu ='seccion';
      $this->slug=$slug;
      $this->portada = str_replace("/", ".", $this->slug); 
      $this->keyseccion = str_replace("/", "-", $this->slug); 
      $this->dispatcher=$dispatcher;
      $this->load_seccion_info();           
      $this->parent_slug = str_replace("rpp/","",$this->seccion_info->parent_slug);
      $this->titulo = @\Rpp\Services\Get\Destacados::metadata($this->parent_slug)->titulo;
      $this->description = @\Rpp\Services\Get\Destacados::metadata($this->parent_slug)->descripcion;
      $this->keywords = implode(",", @\Rpp\Services\Get\Destacados::metadata($this->parent_slug)->tags);
      $this->titulo_social = @\Rpp\Services\Get\Destacados::metadata($this->parent_slug)->titulo;
      $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
      $this->url_social = '';
      $this->ref = load_ref(); 
      $this->urlcanonical ='/'.$slug;
      if(!empty($this->slug_categoria)){
        $this->titulo = $this->slug_categoria.': Noticias, Imágenes, Fotos, Vídeos, audios y más';
        $this->description = 'Todo sobre '.$this->slug_categoria.', noticias en imagenes, fotos, videos, audios, infografias, interactivos y resumenes de '.$this->slug_categoria;
        $this->keywords = $this->slug_categoria.', noticias de '.$this->slug_categoria.', imagenes de '.$this->slug_categoria.', fotos de '.$this->slug_categoria.', videos de '.$this->slug_categoria.', infografias de '.$this->slug_categoria.', interactivos de '.$slug.', resumenes de '.$slug;
        $this->titulo_social = $this->slug_categoria.': Noticias, Imágenes, Fotos, Vídeos, audios y más';
        
      }

    }

    private function load_seccion_info()
    {
     $this->seccion_info = $this->load_agrupacion($this->slug);
     if($this->seccion_info){
        $this->agrupador = true;
        $this->load_agrupador_rewrite();
        return true;
     } 
     
     $this->seccion_info=\Rpp\Services\Get\Categorias::get_categoria($this->slug);

     if(!is_object($this->seccion_info))
     {
       $this->dispatcher->forward(array('controller' => 'error', 'action' =>   'show404'));
     }
    }


    public function load_comscore_seccion() {        
        $data = \Rpp\Services\Get\Categorias::get_categoria($this->slug_seccion);
        if (is_null($data))
            $data = $this->load_agrupacion($this->slug_seccion);
        $data = ucwords(str_replace("rpp/", "", $data->parent_slug));
        $this->dax_category_img = '&amp;category=' . $data;
        $this->dax_category_script = '&category=' . $data;

        $this->comscore = $this->slug_seccion . '.portada';
    }

    public function load_comscore_categoria() {
        $data = \Rpp\Services\Get\Categorias::get_categoria($this->slug_seccion);
        if (is_null($data))
            $data = $this->load_agrupacion($this->slug_seccion);
        $data = ucwords(str_replace("rpp/", "", $data->parent_slug));
        
        $this->comscore = $this->slug_seccion . '.' . $this->slug_categoria . '.portada';
        $this->dax_category_img = '&amp;category=' . $data;
        $this->dax_category_script = '&category=' . $data;
    }

    public function load_epl_categoria()
    {
      $seccion_epl = str_replace('-','_', $this->slug_seccion);
      $categoria_epl = str_replace('-','_', $this->slug_categoria);
      $this->epl_sec = $seccion_epl;
      $this->epl_ss = 'ss:"'.$categoria_epl.'_Portada",';
      $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3","Intersticial","Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" , "Interna10"';      
      $this->epl_kvs = $this->slug_seccion.'|'.$this->slug_categoria;
    }

    public function load_epl_seccion()
    {
      $seccion_epl = str_replace('-','_', $this->slug_seccion);
      $this->epl_sec = $seccion_epl;
      $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3","Intersticial","Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" , "Interna10"';
      $this->epl_kvs = $this->slug_seccion;
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

      $agrupador['vida']['epl'] = 'vida_y_estilo';
      $agrupador['vida']['submenu'] = 'agrupador';

      $agrupador['tec']['epl'] = 'tecnologia';
      $agrupador['tec']['submenu'] = 'agrupador';

      $agrupador['virales']['epl'] = 'virales';
      $agrupador['virales']['submenu'] = 'agrupador';


      $this->comscore = $agrupador[$this->slug_seccion]['epl'].'.'.$this->slug_seccion.'.portada';
      $this->epl_sec =$agrupador[$this->slug_seccion]['epl'];

      $this->submenu = $agrupador[$this->slug_seccion]['submenu'];

    }

    public function load_agrupacion($slug)
    {
      $agrupador['autores'] = json_decode(json_encode(array('_id'=> 'rpp/autores', 'parent_slug' => 'autores' , 'seccion'=>'Autores')), FALSE);
      $agrupador['politica'] = json_decode(json_encode(array('_id'=> 'rpp/politica', 'parent_slug' => 'politica' , 'seccion'=>'Política')), FALSE);
      $agrupador['actualidad'] = json_decode(json_encode(array('_id'=> 'rpp/actualidad', 'parent_slug' => 'actualidad' , 'seccion'=>'Actualidad')), FALSE);
      $agrupador['deportes'] = json_decode(json_encode(array('_id'=> 'rpp/deportes','parent_slug' => 'deportes' ,'seccion'=>'Deportes')), FALSE);
      $agrupador['entretenimiento'] = json_decode(json_encode(array('_id'=> 'rpp/entretenimiento', 'parent_slug' => 'entretenimiento', 'seccion'=>'Entretenimiento')), FALSE);
      $agrupador['peru'] = json_decode(json_encode(array('_id'=> 'rpp/peru', 'parent_slug' => 'peru' ,  'seccion'=>'Perú')), FALSE);
      $agrupador['mundo'] = json_decode(json_encode(array('_id'=> 'rpp/mundo', 'parent_slug' => 'mundo' , 'seccion'=>'Mundo')), FALSE);
      $agrupador['economia'] = json_decode(json_encode(array('_id'=> 'rpp/economia', 'parent_slug' => 'economia' , 'seccion'=>'Economía')), FALSE);
      $agrupador['vida'] = json_decode(json_encode(array('_id'=> 'rpp/vida', 'parent_slug' => 'vida' , 'seccion'=>'Vida')), FALSE);
      $agrupador['tec'] = json_decode(json_encode(array('_id'=> 'rpp/tec', 'parent_slug' => 'tec' , 'seccion'=>'Tecno')), FALSE);
      $agrupador['virales'] = json_decode(json_encode(array('_id'=> 'rpp/virales', 'parent_slug' => 'virales' , 'seccion'=>'Viral')), FALSE);

      if(array_key_exists($slug,$agrupador)) return $agrupador[$slug];
      
      return false;
    }


}