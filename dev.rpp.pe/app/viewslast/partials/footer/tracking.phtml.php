<script type="text/javascript">
  (function() {
    var owntrck = document.createElement('script'); owntrck.type = 'text/javascript'; owntrck.async = true;
    owntrck.src = '<?php echo TRACKING_HOST ?>/?site=<?php echo SITESLUG ?>&cokkie_user=<?php echo $_COOKIE[SITESLUG."_cnu"]?><?php if(isset($this->model->nid)) echo "&nid=".$this->model->nid?><?php if(!empty($this->model->ref)) echo "&ref=".$this->model->ref ?><?php if(isset($this->model->portada)) echo "&portada=".$this->model->portada?><?php if(isset($this->model->tema)) echo "&tema=".$this->model->tema ?><?php if(isset($this->model->search_text)) echo "&search=".$this->model->search_text ?>' ;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(owntrck, s);
  })();
</script>
