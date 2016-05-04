<?php
namespace Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Repositorio\Builder\Search\Pattern;
use Rpp\Services\Buscador\SolrApi;
class Buscador extends Pattern {
	public function __construct()
    {
      $this->filter = array();
      $this->sort = array("id" => "DESC");
      $this->limit=200;
      $this->fields=array("id");
      $this->conf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH.DIRS."ini/solr.ini");
    }

    private function get_url()
    {
      //echo $this->conf->api->host.'select?q='.$this->filter['text'].'&sort=fecha_dt+DESC&fl='.implode(',',$this->fields).'&start=0&rows='.$this->limit.'&wt=json&indent=true&fq=estado_s:publicado&fq=sitio_s:'.SITESLUG;
      return $this->conf->api->host.'select?q="'.$this->filter['text'].'"&sort=fecha_dt+DESC&fl='.implode(',',$this->fields).'&start=0&rows='.$this->limit.'&wt=json&indent=true&fq=estado_s:publicado&fq=sitio_s:'.SITESLUG;
    }

    public function load()
    {
      return SolrApi::find($this->get_url());
    }
}