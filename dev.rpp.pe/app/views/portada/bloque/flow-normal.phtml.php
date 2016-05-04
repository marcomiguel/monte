 <?php foreach ($this->notapreview->flujo as $node) { ?> 

                  <article class="flow-normal">
                    <div class="prominent-media">
                      <figure class="media"><a href="/nota/detalle/<?php echo $node->_id; ?>"><img src="<?php echo $node->imagen_portada['url']; ?>" alt="<?php echo $node->imagen_portada['alt']; ?>" width="224" height="129" ></a></figure>
                      <div class="prominent-txt"> 
                        <h2> <a href="/nota/detalle/<?php echo $node->_id; ?>"><?php echo $node->titulo; ?></a></h2>
                        <p><?php echo $node->bajada; ?></p>
                        <div class="time-related">Publicado el 
                          <time datetime="<?php echo date('Y-m-d H:i', $node->fecha_publicacion); ?>"> <?php echo date('d/m/y', $node->fecha_publicacion); ?>  </time>
                        </div>
                      </div>
                    </div>
                  </article>
<?php } ?>                   