<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0" xml:base="<?php echo $host; ?>">
<channel>
    <title>La 10.pe</title>
    <link><?php echo $host; ?></link>
    <description><![CDATA[La 10.pe, Resultados en Vivo y todas las Noticias del Fútbol y el Deporte. ]]></description>
    <language>es</language>
    <copyright>La 10.pe</copyright>
    <lastBuildDate><?php echo date('r') ?></lastBuildDate>
    <ttl>15</ttl>

	<image>
		<title>La 10.pe</title>
		<url><?php echo $host; ?>/tmp/img/imglogo.jpg</url>
		<link><?php echo $host; ?></link>
	</image>

     <?php foreach(\Rpp\Services\Get\Flow::seccion($slug,150) as $item) :  ?>
      <item>
        <title><![CDATA[<?php echo \Rpp\Services\Get\Content::node($item->_id)->titulo; ?>]]></title>
        <description><![CDATA[getNode(item._id).bajada]]></description>
        <pubDate><?php echo date('r', \Rpp\Services\Get\Content::node($item->_id)->fecha_publicacion); ?></pubDate>
        <link><?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?></link>
        <guid><?php echo \Rpp\Services\Get\Content::nurl($item->_id); ?></guid>
        <dc:type>Artículo</dc:type>
                <media:content url="<?php echo \Rpp\Services\Get\Content::node($item->_id)->imagen_portada['url']; ?>" type="image/jpeg">
        <media:description/></media:content>
        <media:keywords><![CDATA[<?php foreach (\Rpp\Services\Get\Content::part($item->_id,'tags') as $tag): ?> <?php echo $tag['nombre']; ?>,<?php endforeach; ?> Noticias Última Hora]]></media:keywords>
      </item>
     <?php endforeach;?>
</channel>
</rss>