<?php
namespace Rpp\Extend;
use \Rpp\Services\Get\UrlTrack;
class Volt extends  \Phalcon\Mvc\View\Engine\Volt
{
 public function partial($partialPath,  $params = array() , $track=false)
 {
 	
 	if($track)  UrlTrack::$ns_campaign = UrlTrack::get_conf()->{str_replace("/", ".", $partialPath )};
    parent::partial($partialPath,  $params  );
 }
}