<?php $i=0;foreach (\Rpp\Services\Get\Content::part($this->model->nid,'contenido') as $contenido): ?> 
         <?php if ($contenido['tipo'] == 'photo') { ?>
            <section class="img-news">                                           
            <figure class="media full"><img src="<?php echo $contenido['foto']['url']; ?>" alt="<?php echo $contenido['foto']['alt']; ?>">
            <figcaption class="help-media">Agencia AFP</figcaption>
            </figure>
            <span class="gallery-trigger prev"><i class="icon icon-angle-left"></i></span><span class="gallery-trigger next"><i class="icon icon-angle-right"></i></span>
            </section>
            <?php \Rpp\Services\Get\Content::unset_part($this->model->nid,'contenido',$i)?>
         <?php break; ?>
         <?php } ?>
         <?php $i++?>
<?php endforeach;?>