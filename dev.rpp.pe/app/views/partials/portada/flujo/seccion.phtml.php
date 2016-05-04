<?php $e=0?>
<?php foreach (\Rpp\Services\Get\Flow::seccion($slug,50,1) as $item) : ?>
    <?php echo $this->partial('partials/portada/flujo/box/normal', array('nid' => $item->_id, 'position' => $e + 1)); ?>
<?php $e++;?>
<?php endforeach;?>