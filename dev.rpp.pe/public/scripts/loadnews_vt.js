var rppNewsVP = window.rppNewsVP || {};
rppNewsVP = function(tag){
    var tagVP = tag;
    var newsVP = $('#newsVP');
    var preloadVP = $('#preloadVP');
    var btnGetNewsVP = $('#btnGetNewsVP');
    var btnGetNewsVPP = btnGetNewsVP.parent();
    var getNewsVP = function(tagVP){
        preloadVP.show();
        var html = '<div class="vp-masnoticias">';
        $.getJSON(tagVP, function(data){
            var items = (data)?data:[];
            if(items.length<=0){
                preloadVP.hide();
                btnGetNewsVPP.hide();
            }else{
                $.each( items, function( key, val ) {
                    var type = 'none';
                    switch (val.tipo) {
                        case 'video':
                            type = 'icon-8';
                            break;
                        case 'audio':
                            type = 'icon-4';
                            break;
                        case 'galeria':
                            type = 'icon-6';
                            break;
                        case 'infografia':
                            type = 'icon-infografia';
                            break;
                        default:
                    }
                    html += '<article class=" hnews group vp-news">'+
                    '<figure class="hmedia">'+
                    '   <span class="icon '+type+'"></span>'+
                    '   <a href="'+ val.nota_url +'">'+
                    '      <img class="photo lazy" src="'+ val.img +'" alt="'+ val.titulo +'" style="display:block;width:100%;"/>'+
                    '   </a>'+
                    '   <figcaption class="fn hide">'+ val.titulo +'</figcaption>'+
                    '</figure>'+
                    '<div class="entry-cont ">'+
                    '   <p class="cat" data-size-ancla="0">'+
                    '       <a href="'+val.categoria_url+'">'+ val.categoria +'</a>'+
                    '       <time class="pubdate" datetime="'+ val.fecha +'">'+ val.fecha +'</time>'+
                    '   </p>'+
                    '   <h2 class="entry-title"><a class="url" href="'+ val.nota_url +'" rel="bookmark">'+ val.titulo +'</a></h2>'+
                    '   <p>'+ val.bajada +'</p>'+
                    '   <footer>'+
                    '       <p class="hide source-org vcard"><a class="fn url org" href="#">RPP Noticias</a></p>'+
                    '   </footer>'+
                    '</div>'+
                    '</article>';
                });
                html += '</div>';
                newsVP.append(html);
                if(items.length<3){
                    btnGetNewsVPP.hide();
                }else{
                    btnGetNewsVPP.show();
                }
                preloadVP.hide();
            }
        }).error(function(err) {
            preloadVP.hide();
        });
    };
    getNewsVP(tagVP);
    var countVP = 2;
    btnGetNewsVP.on('click', function(e){
        e.preventDefault();
        btnGetNewsVPP.hide();
        var tagVPN = tagVP + '/' + countVP++;
        getNewsVP(tagVPN);
    });
};
