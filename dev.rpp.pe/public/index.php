<?php

error_reporting(-1);
error_reporting(E_ALL);
ini_set('display_errors', TRUE);

try
{
  
if (!defined('DIRS')) {
define('DIRS', DIRECTORY_SEPARATOR);
}

if (!defined('ROOTFULLPATH')) {
define('ROOTFULLPATH', dirname(__DIR__));
}

if (!defined('TRACK')) {
define('TRACK', TRUE);
}

require_once ROOTFULLPATH . '/vendor/autoload.php';
$profiler = new \Fabfuel\Prophiler\Profiler();
$bootstrap = $profiler->start('Bootstrap', ['lorem' => 'ipsum'], 'Application');

require_once 'bootstrap/Load.php';
$di  = new \Phalcon\DI\FactoryDefault();
$di->setShared('profiler', $profiler);
$Load = new Load($di);
$app = $Load->run();
$profiler->stop($bootstrap);
echo $app->handle()->getContent();

} catch (\Phalcon\Exception $e) {
    echo $e->getMessage();
}


$toolbar = new \Fabfuel\Prophiler\Toolbar($profiler);
$toolbar->addDataCollector(new \Fabfuel\Prophiler\DataCollector\Request());
//echo $toolbar->render();
