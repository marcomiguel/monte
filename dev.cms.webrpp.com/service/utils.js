//BUILD SEARCH
app.service('$login', ['$http', '$q' , '$msj', function($http, $q, $msj){
    return {
        get : function(url) {
            var url = url;
            var deferred = $q.defer();
            $http.get(url)
            .success(function(data) {
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }
    };
}]);

//AUTHOR
app.service('$cacheService', function (CacheFactory, $http, $q) {
    if (!window.localStorage) {
        options.storageImpl = localStoragePolyfill;
    }
    if (!CacheFactory.get('dataCache')) {
        CacheFactory('dataCache', {
            maxAge: 30 * 60 * 1000, // 30 minutes
            cacheFlushInterval: 60 * 60 * 1000, // 1 Hora
            deleteOnExpire: 'aggressive',
            storageMode: 'localStorage',
            storagePrefix: 'RPP'
        });
    }
    return {
        get: function (url) {
            var url = url;
            var deferred = $q.defer();
            var start = new Date().getTime();
            $http.get(url, {
                cache:  (CacheFactory.get('dataCache'))?CacheFactory.get('dataCache'):true
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        },
        getState: function(){
            return [{
                nombre: 'Todos',
                slug: ''
            },{
                nombre: 'Borrador',
                slug: 'borrador'
            },{
                nombre: 'Publicado',
                slug: 'publicado'
            },{
                nombre: 'Editado',
                slug: 'editado'
            },{
                nombre: 'Despublicado',
                slug: 'despublicado'
            },{
                nombre: 'Eliminado',
                slug: 'eliminado'
            },{
                nombre: 'Programado',
                slug: 'programado'
            }];
        },
        getTypeContent: function(){
            return [{
                nombre: 'Noticia',
                slug : 'noticia',
                icon : 'format_align_justify'
            },{
                nombre: 'Galeria',
                slug: 'galeria',
                icon : 'collections'
            },{
                nombre: 'Slider',
                slug: 'slider',
                icon : 'collections'
            },{
                nombre: 'Video',
                slug: 'video',
                icon : 'videocam'
            },{
                nombre: 'Audio',
                slug: 'audio',
                icon : 'volume_up'
            },{
                nombre: 'Autores',
                slug: 'blog',
                icon : 'perm_contact_cal'
            },{
                nombre: 'Minuto a minuto',
                slug: 'mam',
                icon : 'alarm_add'
            },{
                nombre: 'Url Externo',
                slug: 'url',
                icon : 'link'
            },{
                nombre: 'Infografia',
                slug: 'infografia',
                icon : 'photo_album'
            },{
                nombre: 'BrandContent',
                slug: 'brandcontent',
                icon : 'picture_in_picture'
            }];
        },
        getPlantillas: function(){
            return {
                rpp : [{
                    nombre: 'Ninguna',
                    slug: 'ninguna',
                    maximo : 0
                },{
                    nombre: 'portada 1x1',
                    slug: 'portada1x1',
                    maximo : 1
                },{
                    nombre: 'portada 1x2',
                    slug: 'portada1x2',
                    maximo : 3
                },{
                    nombre: 'portada 1x3',
                    slug: 'portada1x3',
                    maximo : 4
                },{
                    nombre: 'portada 1x3-4',
                    slug: 'portada1x3-4',
                    maximo : 5
                },{
                    nombre: 'portada 1x4',
                    slug: 'portada1x4',
                    maximo : 5
                },{
                    nombre: 'portada 1x6',
                    slug: 'portada1x6',
                    maximo : 7
                },{
                    nombre : 'portada 1x9',
                    slug : 'portada1x9',
                    maximo : 10
                },{
                    nombre : 'portada full 1x4',
                    slug : 'portadafull1x4',
                    maximo : 5
                },{
                    nombre : 'portada full 1x1',
                    slug : 'portadafull1x1',
                    maximo : 1
                },{
                    nombre: 'portada full 1x9',
                    slug: 'portadafull1x9',
                    maximo: 1
                }],
                la10 : [{
                    nombre: 'portada 1x4',
                    slug: 'portada1x4',
                    maximo : 5
                },{
                    nombre: 'portada 0x4',
                    slug: 'portada0x4',
                    maximo : 4
                }],
                corazon: [{
                    nombre: 'portada 0x3',
                    slug: 'portada0x3',
                    maximo: 3
                }],
                capital: [{
                    nombre: 'portada 0x3',
                    slug: 'portada0x3',
                    maximo: 3
                }],
                lazona: [{
                    nombre: 'portada 1x4',
                    slug: 'portada1x4',
                    maximo: 5
                }],
                oxigeno: [{
                    nombre: 'portada 1x3',
                    slug: 'portada1x3',
                    maximo: 5
                }],
                studio92: [{
                    nombre: 'portada 1x3',
                    slug: 'portada1x3',
                    maximo: 5
                }]
            };
        },
        getPhotos: function(){
            return [{
                nombre: 'Todos',
                slug: 'todos'
            },{
                nombre: 'JPG',
                slug: 'jpg'
            },{
                nombre: 'PNG',
                slug: 'png'
            },{
                nombre: 'GIF',
                slug: 'gif'
            }];
        },
        getSites: function(){
            return [{
                nombre: 'RPP',
                slug: 'rpp'
            },{
                nombre: 'Capital',
                slug: 'capital'

            }];
        },
        getTiposAlertas: function(){
            return [{
                slug: 'critico',
                nombre: 'Crítico'
            },
            {
                slug: 'informativo',
                nombre: 'Informativo'
            },
            {
                slug: 'envivo',
                nombre: 'En vivo'
            }];
        },
        getTiposPortadas: function(){
            return [{
              slug: 'secciones',
              nombre: 'Secciones'
            }, {
              slug: 'especiales',
              nombre: 'Especiales'
            }];
        },
        getTiposEventos: function(){
            return [{
              slug: 'deporte',
              nombre: 'Deporte'
            },
            {
              slug: 'evento',
              nombre: 'Evento'
            }];
        }
    };
});

//DATA MENU
app.service('$menuleft', [function(){
    return {
        get : function(){
            return [{
                    link : '/alertas',
                    title: 'Alertas',
                    icon: 'message',
                    active : 'alertas',
                    submenu : false,
                    slug: 'alert'
                },{
                  link : '/publicador',
                  title: 'Noticias',
                  icon: 'my_library_books',
                  active : 'publicador',
                  submenu : false,
                  slug: 'noticias'
                },{
                  link : '/portadas',
                  title: 'Portadas',
                  icon: 'web',
                  active : 'portadas',
                  submenu : false,
                  slug: 'destacadas'
                },{
                  link : 'portadas/secciones/rpp',
                  title: 'Secciones',
                  icon: 'chevron_right',
                  active : 'secciones',
                  submenu : true,
                  slug: 'destacadas',
                  action: 'secciones'
                },{
                  link : 'portadas/especiales/rpp',
                  title: 'Especiales',
                  icon: 'chevron_right',
                  active : 'especiales',
                  submenu : true,
                  slug: 'destacadas',
                  action: 'especiales'
                },{
                  link : '/temas',
                  title: 'Temas',
                  icon: 'class',
                  active : 'temas',
                  submenu : false,
                  slug: 'tag'
                },{
                  link : '/videos',
                  title: 'Videos',
                  icon: 'videocam',
                  active : 'videos',
                  submenu : false,
                  slug: 'elementos'
                },{
                  link : '/audios',
                  title: 'Audios',
                  icon: 'multitrack_audio',
                  active : 'audios',
                  submenu : false,
                  slug: 'elementos'
                },{
                  link : '/fotos',
                  title: 'Fotos',
                  icon: 'image',
                  active : 'fotos',
                  submenu : false,
                  slug: 'elementos'
                }];
        }
    }
}]);

// Menu Left Redes Sociales
// mM

app.service('$menuLeftRS', [function(){
    return {
        get: function(){
            return[
                {
                    link : '/redessociales/publicadas',
                    title: 'Publicadas',
                    icon: 'web',
                    active : 'publicadas',
                    submenu : false,
                    slug: 'roles'
                },
                {
                    link : '/redessociales/programadas',
                    title: 'Programadas',
                    icon: 'web',
                    active : 'programadas',
                    submenu : false,
                    slug: 'roles'
                },
                {
                    link : '/redessociales/videos',
                    title: 'Videos',
                    icon: 'web',
                    active : 'videos',
                    submenu : false,
                    slug: 'roles'
                },
                {
                    link : '/redessociales/fotos',
                    title: 'Fotos',
                    icon: 'web',
                    active : 'fotos',
                    submenu : false,
                    slug: 'roles'
                },
                {
                    link : '/redessociales',
                    title: 'Cuentas',
                    icon: 'web',
                    active : 'cuentas',
                    submenu : false,
                    slug: 'roles'
                }
            ];
        }
    }
}]);
