<?php

use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

class WidgetTask extends \Phalcon\CLI\Task {

    private $mqconf;

    public function procesoAction() {
        $this->mqconf = new \Phalcon\Config\Adapter\Ini(CONFIG_PATH . DIRS . "ini/mq.ini");
        $connection = new AMQPConnection($this->mqconf->host, $this->mqconf->port, $this->mqconf->user, $this->mqconf->pasw);
        $channel = $connection->channel();
        $channel->queue_declare(SITESLUG . '_widget', false, true, false, false);
        echo ' [*] Servicio listener para widgets ,  CTRL+C para cancelar', "\n";
        $callback = function($msg) {

            try {
                $data = json_decode($msg->body);
                echo $data->widget;

                $method = "widget_{$data->widget}";
                unset($data->widget);

                if (method_exists($this, $method)) {
                    $this->$method($data);
                }
            } catch (\Exception $e) {
                var_dump($e);
            }
        };
        $channel->basic_consume(SITESLUG . '_widget', '', false, true, false, false, $callback);

        while (count($channel->callbacks)) {
            $channel->wait();
        }
    }

//    public function testAction() {
//
//        $proceso = new \Rpp\Services\Get\Alert();
//        var_dump($proceso->active()->tipo);
//    }

    private function widget_socialtv($data) {
        $proceso = new \Rpp\Services\Get\Socialtv();
        $proceso->procesar($data);
    }

    private function widget_alert($data) {
        $proceso = new \Rpp\Services\Get\Alert();
        $proceso->procesar($data);
    }

    private function widget_player($data) {
        $proceso = new \Rpp\Services\Get\Player();
        $proceso->procesar($data);
    }

    private function widget_podcast($data) {
        $proceso = new \Rpp\Services\Get\Podcast();
        $proceso->procesar($data);
    }

}
