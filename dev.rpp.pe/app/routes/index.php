<?php

use \Phalcon\Mvc\Router;

$router = new Router();

$router->add("/", array(
    'controller' => 'index',
    'action' => 'index'
));

$router->handle();
return $router;