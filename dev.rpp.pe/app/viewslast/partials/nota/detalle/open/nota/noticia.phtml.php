<?php $i=0;foreach (\Rpp\Services\Get\Content::part($this->model->nid,'contenido') as $contenido): ?> 
         <?php if ($contenido['tipo'] == 'photo') { ?>
            <section class="img-news">                                           
            <figure class="media full"><img src="<?php echo $contenido['foto']['url']; ?>" alt="<?php echo $contenido['foto']['alt']; ?>">
            <figcaption class="help-media">Agencia AFP</figcaption>
            </figure>
            </section>
            <?php \Rpp\Services\Get\Content::unset_part($this->model->nid,'contenido',$i)?>
         <?php break; ?>
         <?php } elseif ($contenido['tipo'] == 'video') { ?>
           <section class="img-news">
            <div id="swfplayer_open" class="nd_galeriaopen_">   </div>
            <script type="text/javascript">setJW6("swfplayer_open", "<?php echo $contenido['video']['url']; ?>", "<?php echo $contenido['video']['url_cover']; ?>");</script>
            <div class="help-media">
      <?php echo @$contenido['video']['alt']; ?> <?php if(!empty($contenido['via'])): ?>| fuente : {{contenido['via']}}<?php endif;?>
      <span> <?php echo @$contenido['credito']; ?> </span>
      </div>
           </section>
           <?php \Rpp\Services\Get\Content::unset_part($this->model->nid,'contenido',$i)?>
         <?php break; ?>
         <?php } elseif ($contenido['tipo'] == 'youtube') { ?>
         <div id="swfplayer_<?php echo $contenido['youtube']['id']; ?>" class="nd_galeriaopen_<?php echo $contenido['youtube']['id']; ?>"></div></p>
         <script type="text/javascript">setJW6("swfplayer_<?php echo $contenido['youtube']['id']; ?>", "https://www.youtube.com/watch?v=<?php echo $contenido['youtube']['id']; ?>", "http://img.youtube.com/vi/<?php echo $contenido['youtube']['id']; ?>/0.jpg");</script>
         <?php \Rpp\Services\Get\Content::unset_part($this->model->nid,'contenido',$i)?>
         <?php break; ?>
         <?php } ?>
         <?php $i++?>
<?php endforeach;?>