<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    public function beforeExecuteRoute($dispatcher)
    {
        if(@$_GET['lflush']) 
        {
        	$this->viewCache->delete("portada.bodyopen.home" ); 
            $this->viewCache->delete("portada.bodycentral.home" ); 
            $this->viewCache->delete("portada.bodyclose.home" );
        }
    }
}
