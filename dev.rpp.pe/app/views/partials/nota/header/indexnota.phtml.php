                    <header>
                     <?php echo $this->partial('partials/nota/header/pubtime', array('fecha_publicacion' => \Rpp\Services\Get\Content::node($this->model->nid)->fecha_publicacion)); ?>
                     <?php echo $this->partial('partials/nota/header/antetitulo', array('antetitulo' => \Rpp\Services\Get\Content::part($this->model->nid, 'volada'))); ?>
                     <?php echo $this->partial('partials/nota/header/titulo', array('titulo' => \Rpp\Services\Get\Content::node($this->model->nid)->titulo)); ?>
                     <?php echo $this->partial('partials/nota/header/bajada', array('bajada' => \Rpp\Services\Get\Content::node($this->model->nid)->bajada)); ?> 
                    </header>