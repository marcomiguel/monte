<?php $e=0?>
<?php if($this->model->mode == 'ultimas'): ?>
	<?php foreach (\Rpp\Services\Get\Archivo::ultimas($this->model->intervalo,300,1) as $item) : ?>
	    <?php echo $this->partial('partials/portada/flujo/box/normal', array('nid' => $item->_id, 'position' => $e + 1)); ?>
	<?php $e++;?>
	<?php endforeach;?>
<?php elseif ($this->model->mode == 'seccion'):?>
	<?php foreach (\Rpp\Services\Get\Archivo::seccion($this->model->slug,$this->model->fecha,200) as $item) : ?>
	    <?php echo $this->partial('partials/portada/flujo/box/normal', array('nid' => $item->_id, 'position' => $e + 1)); ?>
	<?php $e++;?>
	<?php endforeach;?>
<?php endif;?>

