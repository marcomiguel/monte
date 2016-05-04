<?php
namespace Rpp\Pages;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Services\Get\Sugeridos;
//use Rpp\Services\Get\Recomendados;
use Shared\Cache;
class Noticia extends \Rpp\Pages\Page
{
    public $titulo;
    public $dispatcher;
    public $nid;
    public $channel;
    public $sugeridas;
    public $position;
    public $epl;
    public $comscore;
    public $package;
    public $tipo;
    public $slug_seccion;
    public $description;
    public $keywords;
    public $keywords_slug;
    public $alert;
    public $preroll;
    public $recomendados;
    public $id_mam;
    public function __construct($nid)
    {
      parent::__construct();
      $this->nid = (int)$nid;
      $this->titulo = \Rpp\Services\Get\Article::node($nid)['titulo_corto'];
      $this->tipo   = \Rpp\Services\Get\Article::node($nid)['tipo'];
      $this->slug_seccion = explode("/",\Rpp\Services\Get\Article::node($nid)['categoria']['slug']);
      $keywords = array();
      $this->keywords = array();
      $this->keywords_slug = array();
      foreach (\Rpp\Services\Get\Article::part($this->nid,'keywords') as $key => $value) {
        $this->keywords[] = $value['nombre'];
        $this->keywords_slug[] = $value['slug'];
      }
      $this->tags = \Rpp\Services\Get\Article::part($this->nid,'tags');
      $this->seccion = array();
      foreach (\Rpp\Services\Get\Article::part($this->nid,'categorias') as $key => $value) {
         if(@$value['primary']){
          $this->seccion = $value;
          break;
         }
      }
      $this->recomendados = array();
      $this->keywords = implode(",", $this->keywords );
      $this->brandeo = !empty(\Rpp\Services\Get\Article::part($this->nid,'imagen_branding'));
      $this->especial = !empty(\Rpp\Services\Get\Article::part($this->nid,'imagen_tag'));
      $this->load_comscore();
      $this->load_epl();
      $this->description = null;
      $this->sugeridas = /*$this->load_sugeridas()*/array();
      \Rpp\Services\Get\UrlTrack::$ns_mchannel = 'articulo.'.$nid;
      $this->description=\Rpp\Services\Get\Article::part($this->nid,'bajada');
      $this->titulo_social = htmlentities(\Rpp\Services\Get\Article::node($this->nid)['titulo_seo']);
      $this->img_social = \Rpp\Services\Get\Article::node($this->nid)['imagen_portada']['url'];
      $this->url_social = \Rpp\Services\Get\Article::nurl($this->nid);  
      $this->fecha_social =  \Rpp\Services\Get\Article::node($this->nid)['fecha_publicacion'];   
      $this->urlcanonical =  $this->url_social ;
      $this->id_mam = 1;          
      $this->js_app = 'slide|fotogaleria';
    }


    public static function validate($nid)
    {
     if(empty(\Rpp\Services\Get\Article::part($nid,'_id'))) return  false;
     else return true;
    }

    public function set_position($position)
    {
       $this->position = $position;
    }

    private function load_sugeridas()
    {
      $user=$this->user;
      $sugeridas = array();
      $tags_list = array();
      $nids_top = array();
      if(!empty($user))
      {
        Sugeridos::load($user);

        if(Cache::request()->exists('sugeridas:by:'.$this->nid . ':' . $user)) return $sugeridas = Cache::request()->get('sugeridas:by:'.$this->nid . ':' . $user) ;

        if(is_array(\Rpp\Services\Get\Article::part($this->nid,'tags')))
        {
          foreach (\Rpp\Services\Get\Article::part($this->nid,'tags') as $tag) {
           $tags_list[$tag['slug']] =  Sugeridos::get_tag($tag['slug']);
           foreach ($tags_list[$tag['slug']] as  $nid) {
             if(isset($nids_top[$nid])) $nids_top[$nid]++;
             else $nids_top[$nid]=1;
           }
          }
        }
        arsort($nids_top);
        unset($nids_top[$this->nid]);
        $nids_top = array_slice($nids_top,0,3,true);
        $nids_top= array_keys($nids_top);
        $nids_top = array_combine($nids_top,$nids_top);
        if(count($nids_top)>=3)
        {
          $sugeridas = $nids_top;
        }else{
          $slug = explode('/' , \Rpp\Services\Get\Article::part($this->nid,'categoria')['slug']);
          $nids_by_seccion = Sugeridos::get_seccion($slug[1]);
          unset($nids_by_seccion[$this->nid]);
          $sugeridas = $nids_by_seccion + $nids_top;
          $sugeridas = array_slice($sugeridas ,0 ,4,true);
        }
        Cache::request()->save('sugeridas:by:'.$this->nid . ':' . $user , $sugeridas , 72000);
      }
      return $sugeridas;
    }

    public function load_comscore() {

        $data = \Rpp\Services\Get\Categorias::get_categoria($this->slug_seccion[1]);
        $data = ucwords(str_replace("rpp/", "", $data->parent_slug));
        $this->dax_category_img = '&amp;category=' . $data;
        $this->dax_category_script = '&category=' . $data;

        $this->comscore = $this->slug_seccion[1] . '.' . $this->slug_seccion[2] . '.' . \Rpp\Services\Get\Article::node($this->nid)['tipo'] . '.' . $this->nid . '.interna';

        $this->dax_theme_img = '&amp;theme=|' . implode('|', $this->keywords_slug) . '|';
        $this->dax_theme_script = '&theme=|' . implode('|', $this->keywords_slug) . '|';
    }

    public function load_epl()
    {

      $seccion_epl = str_replace('-','_', $this->slug_seccion[1]);
      $categoria_epl = str_replace('-','_', @$this->slug_seccion[2]);
      

      $eplsec=array( $seccion_epl , 'Tag');

      $this->epl_sec = $eplsec[$this->brandeo];

      $eplss['nota']=array( $categoria_epl.'_Nota' , 'Auspiciado_Nota');
      $eplss['galeria']=array( $categoria_epl.'_Galeria' , 'Auspiciado_Galeria');


      if(\Rpp\Services\Get\Article::node($this->nid)['tipo']=='galeria'){ 
        $this->epl_ss = 'ss:"'.$eplss['galeria'][$this->brandeo].'",'; 
        $this->slug_categoria=$eplss['galeria'][$this->brandeo];
      }else{ 
        $this->epl_ss = 'ss:"'.$eplss['nota'][$this->brandeo].'",';
        $this->slug_categoria=$eplss['nota'][$this->brandeo];
      }
      
//      $this->preroll = "http://ads.us.e-planning.net/eb/4/17632/".$seccion_epl."/".$this->slug_categoria."/Preroll?o=v&ma=1&vv=3&kw_ctxt=rpp|".implode('|',$this->keywords_slug);
      $this->preroll = "https://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=/1028310/RPP_Video&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]";
      $this->epl_position = '"Top","Peel", "Interna1" , "Interna2" , "Interna3" , "Interna4" , "Interna5" , "Interna6" , "Interna7" , "Interna8" , "Interna9" , "Interna10" , "Intersticial", "VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3"';
      $this->epl_kvs = implode('|',$this->keywords_slug);
      $this->scri_bgbanner = '1';
    }
}