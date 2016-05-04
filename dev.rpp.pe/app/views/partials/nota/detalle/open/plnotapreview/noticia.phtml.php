<?php $i=0; foreach ($this->notapreview->contenido as $contenido): ?>  
         <?php if ($contenido['tipo'] == 'photo') { ?>
            <section class="img-news">                                           
            <figure class="media full">
            <img src="<?php echo $contenido['foto']['data']['data']; ?>" alt="<?php echo $contenido['foto']['alt']; ?>">
            <figcaption class="help-media">Agencia AFP</figcaption>
            </figure>
            </section>
            <?php unset($this->notapreview->contenido[$i]) ?>
         <?php break; ?>
         <?php } elseif ($contenido['tipo'] == 'video') { ?>
            <section class="img-news">
            <div id="swfplayer_open" class="nd_galeriaopen_">   </div>
            <script type="text/javascript">setJW6("swfplayer_open", "<?php echo $contenido['video']['url']; ?>", "<?php echo $contenido['video']['url_cover']; ?>");</script>
            </section>
            <?php unset($this->notapreview->contenido[$i]) ?>
         <?php break; ?>
         <?php } elseif ($contenido['tipo'] == 'youtube') { ?>
         <div id="swfplayer_<?php echo $contenido['youtube']['id']; ?>" class="nd_galeriaopen_<?php echo $contenido['youtube']['id']; ?>"></div></p>
         <script type="text/javascript">setJW6("swfplayer_<?php echo $contenido['youtube']['id']; ?>", "https://www.youtube.com/watch?v=<?php echo $contenido['youtube']['id']; ?>", "http://img.youtube.com/vi/<?php echo $contenido['youtube']['id']; ?>/0.jpg");</script>
         <?php unset($this->notapreview->contenido[$i]) ?>
         <?php break; ?>
         <?php } ?>
         <?php $i++?>
<?php endforeach;?>