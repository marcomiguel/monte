<?php foreach (\Rpp\Services\Get\Flow::home(1) as $item) : ?>
                 <article class="flow-prominent">
                    <h1> <a href="/nota/detalle/<?php echo $node->_id; ?>"><?php echo $node->titulo; ?></a></h1>
                    <div class="prominent-media">

                   <?php foreach ($node->contenido as $contenido) { ?> 
                      <?php if(isset($contenido['tipo'])):?>                     
                      <?php if ($contenido['tipo'] == 'text') { ?>
                       <?php if ($contenido['foto']['url']) { ?>
                       <?php } else { ?>  
                      <figure class="media"><a href="/nota/detalle/<?php echo $node->_id; ?>"><img src="<?php echo $contenido['foto']['url']; ?>" alt="<?php echo $contenido['foto']['alt']; ?>s" width="445" height="251"></a></figure>
                       <?php break; ?>
                       <?php } ?>
                      <?php } elseif ($contenido['tipo'] == 'embed') { ?>                   
                       <?php echo $contenido['embed']; ?> 
                      <?php break; ?>
                      <?php } elseif ($contenido['tipo'] == 'youtube') { ?>
                        <p><iframe width="445" height="251" src="https://www.youtube.com/embed/<?php echo $contenido['youtube']['id']; ?>" frameborder="0" allowfullscreen=""></iframe></p>
                        <?php break; ?>
                      <?php } ?>
                      <?php endif; ?>
                    <?php } ?>
                      <div class="prominent-txt"> 
                        <p>
                          <?php echo $node->bajada; ?>
                        </p>
                        <div class="time-related">Publicado el 
                          <time datetime="<?php echo date('Y-m-d H:i', $node->fecha_publicacion); ?>"> <?php echo date('d/m/y', $node->fecha_publicacion); ?>  </time>
                        </div>
                      </div>
                    </div>
                  </article>
<?php break; endforeach;?>