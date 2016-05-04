<?php foreach ($response->docs as $key => $item) { ?>
    <?php echo $this->partial('partials/portada/flujo/box/normal', array('nid' => $item->id, 'position' => $key + 1)); ?>
<?php } ?>

