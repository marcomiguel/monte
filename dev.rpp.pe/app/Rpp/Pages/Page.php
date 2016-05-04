<?php
namespace Rpp\Pages;
abstract class Page
{
    public $epl_kvs;
    public $dax_category;
    public function __construct()
    {
       $this->epl_kvs = '';
       $this->epl_position = '"Top","Peel","VerticalLeft","VerticalRight","Expandible","Middle1","Middle2","RightSmall","Right","Right1","Right2","Right3", "Auspiciado1","Auspiciado2","Auspiciado3","Intersticial"';
       //$this->epl_ss = 'ss:"",';
       $this->epl_ss = '';
       $this->epl_sec = 'Home';
       //$this->epl_sec = 'ZonaTest';
       $this->urlcanonical = '';
       $this->alert = false;
       $this->no_view_cache_open = false;
       $this->no_view_cache_central = false;
       $this->no_view_cache_sidebar = false;
       $this->no_view_cache_close = false;
       $this->submenu = "tags";
       $this->comscore='home.portada';

       $this->user = @$_COOKIE[SITESLUG.'_cnu'];
       $this->user_ga = @$_COOKIE['_ga'];
       $this->dax_category_img = '';
       $this->dax_category_script = '';

       $this->dax_theme_img = '';
       $this->dax_theme_script = ''; 
       $this->alert = \Rpp\Services\Get\Alert::active();
       $this->cabecera = 'general' ;

       $this->scri_bgbanner = '';
       $this->js_app = 'slide';
       $this->img_social = 'http://s.rpp-noticias.io/images/imgshare.jpg';
       $this->hora_planeta = false;
       $this->s3_raiz = \Rpp\Services\Get\UrlMedia::get_conf()->endpoint->fuente;
       $this->htmlrel = '';
    }
} 