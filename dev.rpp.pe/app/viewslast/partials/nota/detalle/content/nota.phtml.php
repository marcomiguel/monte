 <?php echo \Rpp\Services\Get\Content::part($this->model->nid, 'entradilla'); ?> 
<?php foreach (\Rpp\Services\Get\Content::part($this->model->nid,'contenido') as $contenido): ?>                                   
    <?php if ($contenido['tipo'] == 'text') { ?>
     <p> <?php echo $contenido['texto']; ?> </p>
                             <section class="related-news">
                          <ul>
                            <li>
                              <h4><?php echo $contenido['cita']['titulo']; ?></h4>
                              <h2><a href="#"><?php echo $contenido['cita']['desarrollo']; ?></a></h2>
                            </li>
                          </ul>
                        </section>
    <?php } elseif ($contenido['tipo'] == 'photo') { ?> 
    <?php if ( \Rpp\Services\Get\Content::node($this->model->nid)->tipo == 'galeria' ):?>
       <?php continue; ?>
    <?php endif?>
    <figure class="media full">
    <p> <?php echo $contenido['subtitulo']; ?> </p>
    <?php echo $this->partial('partials/nota/contenido/bloque/' . $this->model->package . 'imagen', $contenido); ?>
    <figcaption class="help-media"><?php echo $contenido['texto']; ?></figcaption>
    </figure>
    <?php } elseif ($contenido['tipo'] == 'embed') { ?>
     <p> <?php echo $contenido['subtitulo']; ?> </p>
     <p> <?php echo $contenido['embed']; ?> <div>Credito: <?php echo $contenido['credito']; ?> | Via: <?php echo $contenido['via']; ?></div></p>
     <p> <?php echo $contenido['texto']; ?> </p>
    <?php } elseif ($contenido['tipo'] == 'youtube') { ?>
      
    <p> <?php echo $contenido['subtitulo']; ?> </p>
<p>
<div id="swfplayer_<?php echo $contenido['youtube']['id']; ?>" class="nd_galeriaopen_<?php echo $contenido['youtube']['id']; ?>"></div></p>
<script type="text/javascript">setJW6("swfplayer_<?php echo $contenido['youtube']['id']; ?>", "https://www.youtube.com/watch?v=<?php echo $contenido['youtube']['id']; ?>", "http://img.youtube.com/vi/<?php echo $contenido['youtube']['id']; ?>/0.jpg");</script>
<div>Credito: <?php echo $contenido['credito']; ?> | Via: <?php echo $contenido['via']; ?></div>
<?php } elseif ($contenido['tipo'] == 'video') { ?>
<p> <?php echo $contenido['subtitulo']; ?> </p>
<p>
<div id="swfplayer" class="nd_galeriaopen_">
</div>
</p>

<script type="text/javascript">setJW6("swfplayer", "<?php echo $contenido['video']['url']; ?>", "<?php echo $contenido['video']['url_cover']; ?>");</script>
<div>Credito: <?php echo $contenido['credito']; ?> | Via: <?php echo $contenido['via']; ?></div>
<?php } ?>
<?php endforeach;?>