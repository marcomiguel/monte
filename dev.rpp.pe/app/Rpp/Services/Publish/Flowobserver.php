<?php
namespace Rpp\Services\Builder;
use Rpp\Repositorio\Builder\SearchPatternBuilder;
use Rpp\Repositorio\Builder\Search\Pattern\Home;
class abstract Flowobserver 
{
    public function __construct($subject = null) {
        if (is_object($subject) && $subject instanceof Subject) {
            $subject->attach($this);
        }
    }
 
    public function update($subject) {
        
        if (method_exists($this, $subject->getState())) {
            call_user_func_array(array($this, $subject->getState()), array($subject));
        }
    }
}


abstract class Subject
{
    protected $observers;
    protected $state;
 
    public function __construct() {
        $this->observers = array();
        $this->state = null;
    }
 
    public function attach(Observer $observer) {
        $i = array_search($observer, $this->observers);
        if ($i === false) {
            $this->observers[] = $observer;
        }
    }
 
    public function detach(Observer $observer) {
        if (!empty($this->observers)) {
            $i = array_search($observer, $this->observers);
            if ($i !== false) {
                unset($this->observers[$i]);
            }
        }
    }
 
    public function getState() {
        return $this->state;
    }
 
    public function setState($state) {
        $this->state = $state;
        $this->notify();
    }
 
    public function notify() {
        if (!empty($this->observers)) {
            foreach ($this->observers as $observer) {
                $observer->update($this);
            }
        }
    }
 
 
    public function getObservers() {
        return $this->observers;
    }
}



class Auth extends Subject
{
    function login() {
        // existing code to perform login authentication
        // ...
 
        // signal any observers that the user has logged in
        $this->setState("login");
    }
 
    function logout() {
        // existing code to perform some operation when user logs out
        // e.g. destroy session, etc...
 
        // signal any observers that the user has logged out
        $this->setState("logout");
    }
}


class Auth_ForumHook extends Observer
{
    function login($subject) {
        // call the forum's API functions to log the user in
        // ...
    }
 
    function logout($subject) {
        // call the forum's API functions to log the user out
        // ...
    }
}




$auth = new Auth();
$auth->attach(new Auth_ForumHook());


?>