<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<?php foreach(\Rpp\Services\Get\Archivo::ultimas_seccion($slug,168) as $item): ?>
<url>
   <loc>
    <?php echo $host; ?><?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?>
   </loc>
   <image:image>
      <image:loc>getNode(item._id).imagen_portada['url']</image:loc>
      <image:title>
         <![CDATA[<?php echo \Rpp\Services\Get\Content::node($item->_id)->titulo; ?>]]>
      </image:title>
  </image:image>
   <news:news>
      <news:publication>
      <news:name>La10.pe</news:name>
      <news:language>es</news:language>
      </news:publication>
      <news:publication_date><?php echo date('Y-m-d\TH:i:sP', \Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion); ?></news:publication_date>
      <news:title>
      <![CDATA[<?php echo \Rpp\Services\Get\Content::node($item->_id)->titulo; ?>]]>
      </news:title>
      <news:keywords>
      <?php $keywords = \Rpp\Services\Get\Content::part($item->_id, 'keywords'); if(!is_array($keywords)) $keywords = array(); $list = array(); ?>
      <?php foreach($keywords as $key): $list[] = $key['nombre'];  endforeach;?>
      <![CDATA[<?php echo implode(',',$list); ?>]]>
      </news:keywords>
   </news:news>
</url>
<?php endforeach; ?>
</urlset>