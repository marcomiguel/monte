                    <header>
                     <?php echo $this->partial('partials/nota/header/pubtime', array('fecha_publicacion' => $this->notapreview->fecha_publicacion)); ?>
                     <?php echo $this->partial('partials/nota/header/antetitulo', array('antetitulo' => $this->notapreview->volada)); ?>
                     <?php echo $this->partial('partials/nota/header/titulo', array('titulo' => $this->notapreview->titulo)); ?>
                     <?php echo $this->partial('partials/nota/header/bajada', array('bajada' => $this->notapreview->bajada)); ?> 
                    </header>