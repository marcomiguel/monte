       <?php $e=0?>
       <?php foreach (\Rpp\Services\Get\Flow::home(20) as $item) : ?>
            <?php echo $this->partial('partials/portada/flujo/box/' . \Rpp\Services\Get\Content::node($item->_id)->tipo, array('nid' => $item->_id, 'position' => $e + 1)); ?>
        <?php $e++;?>
        <?php if(($e + \Rpp\Services\Get\Destacados::$size['home'] - 1)%5==0):?>
        	<?php echo $this->partial('partials/portada/flujo/box/ads'); ?>
        <?php endif;?>
       <?php endforeach;?>

