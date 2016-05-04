           <section class="tags">
              <h3>Tags:</h3>
             
             <?php foreach (\Rpp\Services\Get\Content::part($this->model->nid,'tags') as $tag): ?> 
                <?php echo $this->partial('partials/nota/tags/list', array('tag' => $tag)); ?>
             <?php endforeach; ?>
           </section>