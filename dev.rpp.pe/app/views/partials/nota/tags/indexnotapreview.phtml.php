<section class="tags">
  <h3>Tags:</h3>
  <?php foreach ($this->notapreview->tags as $tag) { ?> 
    <?php echo $this->partial('partials/nota/tags/list', array('tag' => $tag)); ?>
  <?php } ?>
</section>