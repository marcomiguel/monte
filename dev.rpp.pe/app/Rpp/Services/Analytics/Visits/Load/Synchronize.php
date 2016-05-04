<?php
namespace Rpp\Services\Analytics\Visits\Load;
abstract class Synchronize extends \Phalcon\Mvc\User\Component {
	abstract function calculate();
}