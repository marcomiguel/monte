<?php $e=0?>
<?php foreach (\Rpp\Services\Get\Flow::tag($this->model->slug) as $item) : ?>
    <?php echo $this->partial('partials/portada/flujo/box/normal', array('nid' => $item->_id, 'position' => $e + 1)); ?>
<?php $e++;?>    
<?php endforeach;?>