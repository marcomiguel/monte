/*
    Config Global
*/
var CMSDATA = window.CMSDATA || {};
CMSDATA.MSJ = {
    MSJ0 : 'Inicio de sesión fallida.',
    MSJ1 : 'Error: Usuario ó Password incorrecto.',
    MSJ2 : 'Error: No se pudieron listar las noticias.',
    MSJ3 : 'Sesión Cerrada',
    MSJ4 : 'Error: No se pudo cargar la vista previa.',
    MSJ5 : 'Se guardó correctamente.',
    MSJ6 : 'Error: No se pudo guardar la noticia.',
    MSJ7 : 'Error: No se pudo editar la noticia.',
    MSJ8 : 'Error: No se pudo eliminar la noticia.',
    MSJ9 : 'Se publicó correctamente.',
    MSJ10 : 'Error: No se pudo publicar la noticia.',
    MSJ11 : 'Error: No se pudo cargar la actividad.',
    MSJ12 : 'Se cargo correctamente la actividad.',
    MSJ13 : 'Error: No se pudo cargar las categorias.',
    MSJ14 : 'Error: No se pudo subir el video.',
    MSJ15 : 'El video se subió correctamente',
    MSJ16 : 'Error: No se pudo cargar los autores.',
    MSJ17 : 'Error: No se pudo cargar los sitios.',
    MSJ18 : 'No se encontraron más coincidencias en su búsqueda.',
    MSJ19 : 'Se guardaron los destacados exitosamente.',
    MSJ20 : 'Error: No se pudo guardar los destacados.',
    MSJ21 : 'Se cargaron los destacados.',
    MSJ22 : 'Error: No se pudo cargar los destacados.',
    MSJ23 : 'Error: No se pudo subir las fotos.',
    MSJ24 : 'Las fotos se subieron correctamente',
    MSJ25 : 'Error: No se pudo mostrar la vista previa de portada.',
    MSJ26 : 'Cargando vista previa de portada.',
    MSJ27 : 'Cargando vista previa.',
    MSJ28 : 'Se cargaron los resultados de la búsqueda.',
    MSJ29 : 'Error: Hubo un error al cargar los resultados de la búsqueda.',
    MSJ30 : 'Error: No se pudo subir el audio.',
    MSJ31 : 'El audio se subió correctamente',
    MSJ32 : 'Se cargo correctamente las categorias.',
    MSJ33 : 'Error: No se pudo cargar la imagen de portada.',
    MSJ34 : 'Error: No se pudo cargar las fuentes correctamente.',
    MSJ35 : 'Error: No se pudo cargar la imagen.',
    MSJ36 : 'Debes cargar la imagen para agregar miniatura.',
    MSJ37 : 'Agrega un video y escoge una cover del video.',
    MSJ38 : 'Error: No se pudo despublicar la noticia.',
    MSJ39 : 'Error: No se pudo subir la imagen correctamente.',
    MSJ40 : 'Tienes que subir una imagen de cover.',
    MSJ41 : 'Error: No se pudo guardar los datos del usuario correctamente',
    MSJ42 : 'Error: No se pudo cargar las secciones.',
    MSJ43 : 'Error: No se pudo modificar la foto del usuario',
    MSJ44 : 'Se cargo correctamente los comentarios.',
    MSJ45 : 'La portada se cargo correctamente.',
    MSJ46 : 'Error: No se pudo cargar la portada correctamente.',
    MSJ47 : 'Error: No se pudo modificar la foto del usuario',
    MSJ48 : 'Error: Hubo un error al cargar los comentarios.',
    MSJ49 : 'Error: No se pudo guardar la historia',
    MSJ50 : 'Error: No se pudo publicar la portada.',
    MSJ51 : 'Error: No se pudieron listar los archivos multimedia.',
    MSJ52 : 'Error: No se pudo publicar la historia.',
    MSJ53 : 'Error: Debes escoger una historia',
    MSJ54 : 'Error: No se pudo listar las historias',
    MSJ55 : 'Debes ingresar la leyenda.',
    MSJ56 : 'La imagen se subió correctamente.',
    MSJ57 : 'Se actualizo correctamente.',
    MSJ58 : 'Error: No se pudo actualizar.',
    MSJ59 : 'Error: No se pudo publicar la alerta.',
    MSJ60 : 'Se recuperó la lista de tickers',
    MSJ61 : 'Error: No se pudo recuperar la lista de tickers',
    MSJ62 : 'Error: No se pudo unir los temas',
    MSJ63 : 'Error: No se pudo guardar correctamente.',
    MSJ64 : 'Error: No se pudo publicar correctamente.',
    MSJ65 : 'Error: No se pudo modificar correctamente.',
    MSJ66 : 'Error: No se pudo realizar el cambio en el streaming.',
    MSJ67 : 'Se despublicó correctamente',
    MSJ68 : 'Error: No se pudo despublicar la alerta',
    MSJ69 : 'Error: No se pudo listar los temas del día',
    MSJ70 : 'Error: No se pudo guardar la lista de temas del día',
    MSJ71 : 'Error: No se pudo obtener los temas del día',
    MSJ72 : 'La lista de temas del día se guardo correctamente',
    MSJ73 : 'Debes ingresar el título.',
    MSJ74 : 'Debes ingresar la leyenda y el título.',
    MSJ75 : 'Agrega un audio y agrega una imagen de cover.',
    MSJ76 : 'Error: El nombre ingresado ya existe',
    MSJ79 : 'Se guardaron correctamente los temas',
    MSJ80 : 'Error: No se pudieron guardar los temas',
    MSJ81 : 'Error: No se pudo cargar las entidades del rol',
    MSJ82 : 'Error: No se pudo pudieron guardar los roles',
    MSJ85 : 'Error: No se pudieron cargar las secciones',
    MSJ86 : 'Error: La portada presenta modificaciones realizadas por otro usuario, es necesario volver a cargar la portada.',
    MSJ87 : 'Error: Debe escoger un tema.',
    MSJ88 : 'Error: Debe escoger una seccion.',
    MSJ89 : 'Error: Este playlist no posee audio.',
    MSJ90 : 'Error: Debe escoger una nota en la posición 1',
    MSJ91 : 'Error: Debe escoger un tipo, una radio o fuentes de transmisión',
    MSJ92 : 'Error: No se pudieron listar los usuarios.',
    MSJ93 : 'Error: Debe escoger un video.',
    MSJ94 : 'Error: Debe ingresar una leyenda.',
    MSJ95 : 'Error: No se pudieron asignar los roles',
    MSJ96 : 'Error: No cuenta con los permisos para realizar esta acción',
    MSJ97 : 'Error: No se pudo cargar las acciones del rol',
    MSJ98 : 'Error: No se pudieron guardar las acciones',
    MSJ99 : 'Error: Debes escoger un audio'
};
//DATE ADJUST
if(!Date.prototype.adjustDate){
    Date.prototype.adjustDate = function(days){
        var date;
        days = days || 0;
        if(days === 0){
            date = new Date( this.getTime() );
        } else if(days > 0) {
            date = new Date( this.getTime() );

            date.setDate(date.getDate() + days);
        } else {
            date = new Date(
                this.getFullYear(),
                this.getMonth(),
                this.getDate() - Math.abs(days),
                this.getHours(),
                this.getMinutes(),
                this.getSeconds(),
                this.getMilliseconds()
            );
        }
        this.setTime(date.getTime());
        return this;
    };
}
CMSDATA.FILTER = {
    texto : 'Últimas noticias',
    /*desde: (new Date()).adjustDate(-30), //-30 DAY*/
    //desde: (new Date()).adjustDate(-365), //-365 DAY
    desde: (new Date()).adjustDate(-1), //-1 DAY
    hasta: new Date(),
    sitio: 'Grupo RPP'
};
CMSDATA.DIMENSION16x9 = {
    wImage : 573,
    hHeight : 322,
    widthXLarge : 825,
    heightXLarge : 464,
    widthLarge : 603,
    heightLarge : 339,
    widthMedium : 439,
    heightMedium : 248
};
CMSDATA.VIDEOLOAD = 60;
CMSDATA.VIDEOLOADMSJ = {
    MSJ1 : 'El video supera los <strong>'+ CMSDATA.VIDEOLOAD +' megas</strong> permitidos como máximo.',
    MSJ2 : 'Lo recomendable es que el video no exceda los 6 minutos de duración y un mínimo de 1 minuto y medio.'
};
CMSDATA.CONFIGEDITOR = {
    inline: false,
    plugins: 'insertdatetime contextmenu paste table print wordcount preview lists advlist autolink autoresize link searchreplace visualblocks code fullscreen',
    default_link_target: '_blank',
    wordcount_countregex: /[\w\u2019\x27\-\u00C0-\u1FFF]+/g,
    tools: 'inserttable',
	min_height: 160,
	height : 180,
    language : 'es',
    body_class: "editor-cms"
};
//OBJ NEW
CMSDATA.OBJNEW = {
    texto: '',
    tipo: 'text',
    parrafo1: '',
    parrafo2: '',
    cita: {
        alineacion: 'izquierda',
        titulo:'',
        desarrollo: ''
    },
    relacionado: {
        alineacion: 'abajo',
        items : []
    },
    embed: '',
    embed_data: {
        descripcion: '',
        tags: []
    },
    credito: '',
    via: '',
    youtube: {
        autoplay : '',
        descripcion: '',
        id : '',
        tags: [],
        timestamp : '',
        url : '',
        url_cover: ''
    },
    foto : {
        attr : {
            align: 'center'
        },
        id: '',
        data: '{ data: "", name: "" }',
        alt: '',
        descripcion: '',
        url: '',
        tags: [],
        url_b64 : ''
    },
    video : {
        url: '',
        url_cover: '',
        duracion : '',
        hash: '',
        descripcion: '',
        alt: '',
        tags: []
    },
    audio : {
        url: '',
        url_cover: '',
        duracion : '',
        hash: '',
        descripcion: '',
        alt: '',
        tags: []
    },
    mam : {
        id: '',
        datafactory: '',
        titulo: '',
        fechaInicio: ''
    }
};
CMSDATA.POSITIONMSJ = 'top right';
CMSDATA.MSJGENERALTEXT = 'Usted esta en el CMS de prueba';
CMSDATA.MSJGENERALTIME = 300000;
CMSDATA.MSJGENERAL = 1;
CMSDATA.MSJREFRESH = 0;
//CMSDATA.IDS = {
//    facebook: 948366575246990
//};
/*
dev : 948366575246990,
pre : 948367188580262,
prod : 947705811979733
*/
