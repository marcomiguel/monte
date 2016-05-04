// 'use strict';

define(['app'], function (app) {

app.register.controller('eventosDetalleCtrl', ['$scope', '$rootScope', '$location', '$preload', '$http', '$mdDialog', '$login', '$routeParams', '$filter', '$msj', '$localStorage', '$interval', '$timeout', '$window', '$logout', '$mdToast', '$bytesToSize', '$insertJavascript',
  function ($scope, $rootScope, $location, $preload, $http, $mdDialog, $login, $routeParams, $filter, $msj, $localStorage, $interval, $timeout, $window, $logout, $mdToast, $bytesToSize, $insertJavascript) {
    var ng=$scope;
  	var URL = {
      base: CMSDATA.GLOBAL.URLBASE,
      sesion:'session',
      logout:'session/logout',
      upload:'elementos/upload/photo',
      evento:{
        detalle:'eventos/',
        publicar:'eventos/publicar',
        guardar:'eventos/guardar',
        asociarNoticia:'eventos/asociar/',
        desasociarNoticia:'eventos/desasociar/',
        buscarPartidos:'eventos/buscar/'
      },
      dataFactory:{
        listarCampeonatos:'datafactory/campeonatos',
        listarAlineaciones:'datafactory/alineaciones/',
        listarEncuentro:'datafactory/encuentro/',
        listarIncidencias:'datafactory/incidencias/'
      },
      social:{
        tw:{
          conectar:'api/twitter/connect',
          desconectar:'eventos/twitter_cerrar',
          sesion:'eventos/twitter_session',
          publicar:'eventos/twitter_publicar'
        }
      }
    };
    var positionMSj = CMSDATA.POSITIONMSJ;
    ng.urlEscudos=CMSDATA.GLOBAL.URLESCUDO;
    TIMERESULT = 1000/2;

    var nid = $routeParams.nid;
    // ng.selectedTab = $routeParams.tab;

    var reloadDF=5;

    //TinyMCE
    ng.tinymceOptions = {
      inline: false,
      plugins: '',
      default_link_target: '_blank',
      wordcount_countregex: /[\w\u2019\x27\-\u00C0-\u1FFF]+/g,
      tools: '',
      min_height: 80,
      height : 90,
      language : 'es',
      body_class: "editor-cms",
      menubar:false,
      statusbar: false,
      toolbar1: "bold italic"
    };

    //FB
    $insertJavascript.fb('2.5');

    // ---- INICIO SESION ---- // 
    ng.user = { pictureUrl: false };
    var rechazarSesion=function(){
      $msj.show(CMSDATA.MSJ.MSJ0, positionMSj);
      delete $localStorage.login;
      $preload.hide();
      $location.path('/');
    };
    var verificarSesion=function(){
      $preload.show();
      $login.get(URL.base + URL.sesion).then(
        function(data) {
            var data = data;
            if(data.status){
                ng.user.pictureUrl = (data.response.foto=="")?false:data.response.foto+"?"+new Date().getTime();
                verificarEvento();
                $preload.hide();
            }else{
              rechazarSesion();          
            }
        },
        function(msgError) {
            rechazarSesion();
        }
      );
    };
    // ---- FIN SESION ---- // 

    // Scroll Infinito //
    ng.newsBusy = false;
    ng.newsAfter = '';
    ng.msjBusy = false;
    var limitNews = 0;
    ng.newsNextPage = function() {
        if (ng.newsBusy) return;
        ng.newsBusy = true;
        ng.msjBusy = false;
        $http.post(URL.base + URL.evento.detalle + '?cursor=' + ng.newsAfter, nid).
        success(function(data) {
            var data = data;
            $timeout(function(){
                if(data.status){
                    var items = data.response[0].incidencias;
                    if(items.length > 0){
                        for (var i = 0; i < items.length; i++) {
                            ng.evento.incidencias.push(items[i]);
                        }
                        ng.newsAfter = data.last_cursor;
                        ng.newsBusy = false;
                        ng.showLoadListNew = false;
                        msjBusy = false;
                    }else{
                        $msj.show(CMSDATA.MSJ.MSJ18,positionMSj);
                        ng.newsBusy = false;
                        ng.msjBusy = true;
                    }
                }else{
                    // noValidForm();
                    ng.msjBusy = false;
                }
            },TIMERESULT);
        }).error(function(data) {
            $timeout(function(){
                // noValidForm();
                ng.msjBusy = false;
            },TIMERESULT);
        });
    };
    // /Scroll Infinito //

    // grupo (0=si, 1=pt, 2=st, 1.5=et, 4=fi)
    var setearSucesoVacio=function(){
      ng.suceso={ 
        icono: '',
        tiempo: ng.partePartido,
        grupo:ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF,
        hora:'',
        mas_tiempo: '',
        texto: '',
        foto: '',
        embed: '',
        noticias_relacionadas:[],
        tipo:'cms',
        id:new Date().getTime().toString().substring(5),
        fecha_publicacion:Date.now()
      };
    };

    var inicializarObjetos=function(){

      ng.mostrarCargaIncidencias=false;
      ng.mostrarCargaAlineaciones=false;
      ng.mostrarCargaEncuentro=false;
      ng.mBuscarNoticiasRelacionadas=false;

      ng.enumEstadoPartidoCMS={
        SIN_INICIAR:{_idDF:0, valor:'Sin iniciar', alias:'SI', grupo:0},
        PRIMER_TIEMPO:{_idDF:1,valor:'Primer Tiempo', alias:'PT', grupo:1},
        ENTRETIEMPO:{_idDF:5,valor:'Entretiempo', alias:'ET', grupo:1.5},
        SEGUNDO_TIEMPO:{_idDF:6,valor:'Segundo Tiempo', alias:'ST', grupo:2},
        FINALIZADO:{_idDF:2,valor:'Finalizado', alias:'FI', grupo:4},
      };

      ng.enumEstadoPartidoDF={
        SIN_INICIAR:{_id:0,valor:'Sin iniciar'},
        PRIMER_TIEMPO:{_id:1,valor:'Primer Tiempo'},
        FINALIZADO:{_id:2,valor:'Finalizado'},
        SUSPENDIDO:{_id:3,valor:'Suspendido'},
        POSTERGADO:{_id:4,valor:'Postergado'},
        ENTRETIEMPO:{_id:5,valor:'Entretiempo'},
        SEGUNDO_TIEMPO:{_id:6,valor:'Segundo Tiempo'},
        FIN_TIEMPO_REGLAMENTARIO:{_id:7,valor:'Fin de Tiempo Reglamentario'},
        ALARGUE_1:{_id:82,valor:'Alargue 1'},
        FIN_ALARGUE_1:{_id:9,valor:'Fin alargue 1'},
        ALARGUE_2:{_id:10,valor:'Alargue 2'},
        FIN_ALARGUE_2:{_id:11,valor:'Fin alargue 2'},
        DEFINICION_PENALES:{_id:12,valor:'Definición por penales'}
      };

      setearSucesoVacio();

      ng.listaCampeonatos=[];
      ng.listaPartidos=[];

      ng.evento={
        //general
        id:'',
        titulo:'',
        lugar:'',
        tipo:null,
        // fechaInicio:new Date(),
        // horaInicio:new Date(),
        fechaFin:new Date(), 
        incidencias:[],
        noticias:[],
        terminado:false,
        twittear:true,
        // deportivo futbol
        // inicioPT:new Date(),
        // inicioST:new Date(),
        match:{
          _id:0,
          cobertura:false,
          estado:0,
          minuto_juego:0,
          tiempo_juego:0,
          local:{
            gol_jugadores:[],
            goles:0,
            id:'',
            nombre_equipo:''
          },
          visitante:{
            gol_jugadores:[],
            goles:0,
            id:'',
            nombre_equipo:''
          }
        },
        estadoPartido:ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF
      };

      ng.objDate_publish = new Date(); //Date publish
      ng.objTime_publish = new Date(); //Time publish

      ng.alineaciones={};

      ng.incidenciasDF=[];
      ng.matchDF={};

      ng.encuentroDF={};
      
      ng.enumCategoria={
        DEPORTE:{id:1,descripcion:'Deporte'},
        EVENTO:{id:2,descripcion:'Evento'}
      };

      ng.lblEstadoPartido=ng.enumEstadoPartidoDF.SIN_INICIAR.valor;

      ng.$on('timer-stopped', function (event, data){
        // console.log('Timer Stopped - data = ', data);
      });

      ng.$on('timer-tick', function (event, data) {
        // console.log(event, data);
        ng.suceso.hora=data.minutos;
      });

      ng.callbackTimer={};
      ng.callbackTimer.status='Running';
      ng.callbackTimer.callbackCount=0;
      asignarEstadoTimer(0);
      ng.callbackTimer.finished=function(){
        if(ng.evento.estadoPartido==ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF
          ||ng.evento.estadoPartido==ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF){
          ng.mostrarFalta=false;
          asignarEstadoTimer(1);
          ng.inicioTiempo=ng.evento.inicioPT;
        }
        $timeout(function(){
          ng.publicarEvento();
        },500);
      };
    };

    // ---- INICIO TIMER ---- //
    var asignarEstadoTimer=function(estado){
      switch(estado){
        case ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF: // sin iniciar
          ng.lblPlay='Iniciar primer tiempo';
          ng.iconAction='play_circle_outline';
          ng.partePartido=1;
          ng.lblTiempoPartido="Sin iniciar";
          ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF;
          break;
        case ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF: // primer tiempo
          ng.lblPlay='Acabar primer tiempo';
          ng.iconAction='stop';
          ng.partePartido=1;
          ng.lblTiempoPartido="Primer Tiempo";
          ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF;
          break;
        case ng.enumEstadoPartidoCMS.FINALIZADO._idDF: // finalizado
          ng.lblPlay='Finalizado';
          ng.iconAction='play_circle_outline';
          ng.partePartido=2;
          ng.lblTiempoPartido="Finalizado";
          ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.FINALIZADO._idDF;
          break;
        case ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF: // entretiempo
          ng.lblPlay='Iniciar segundo tiempo';
          ng.iconAction='play_circle_outline';
          ng.partePartido=2;
          ng.lblTiempoPartido="Entretiempo";
          ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF;
          break;
        case ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF: // segundo tiempo
          ng.lblPlay='Acabar segundo tiempo';
          ng.iconAction='stop';
          ng.partePartido=2;
          ng.lblTiempoPartido="Segundo Tiempo";
          ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF;
          break;
      }
    }

    var iniciarContador = function (evento){
      // ng.$broadcast('timer-resume');
      var ahorita=Date.now();
      var inicioPT=new Date(evento.inicioPT).getTime();
      var inicioST=new Date(evento.inicioST).getTime();
      try{
        if(ahorita-inicioPT>0){ // ya empezo 
          ng.mostrarFalta=false;
          if(evento.estadoPartido==ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF
            ||evento.estadoPartido==ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF){
            asignarEstadoTimer(ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF);
            ng.inicioTiempo=inicioPT;
            ng.$broadcast('timer-start');
          }else{
            if(evento.estadoPartido==ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF){
              asignarEstadoTimer(ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF);
              ng.suceso.tiempo=2;
              ng.inicioTiempo=ahorita;
              ng.$broadcast('timer-stop');
              ng.$broadcast('timer-clear');
            }else{
              if(evento.estadoPartido==ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF){
                asignarEstadoTimer(ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF);
                ng.suceso.tiempo=2;
                ng.inicioTiempo=inicioST;
                ng.$broadcast('timer-start');
              }else{
                if(evento.estadoPartido==ng.enumEstadoPartidoCMS.FINALIZADO._idDF){
                  asignarEstadoTimer(ng.enumEstadoPartidoCMS.FINALIZADO._idDF);  
                }
              }
            }
          }
        }else{ // aun no empieza
            ng.faltaEmpiece=evento.inicioPT;
            if(ahorita>ng.faltaEmpiece){
              ng.mostrarFalta=false;
            }else{
              ng.mostrarFalta=true;
            }
        }
        
      }catch(error){
        console.log(error);
      }
    };

    var cambiarContador=function(evento){
      // ng.$broadcast('timer-resume');
      var ahorita=Date.now();
      var inicioPT=new Date(evento.inicioPT).getTime();
      var inicioST=new Date(evento.inicioST).getTime();
      ng.faltaEmpiece=evento.inicioPT;
      if(ahorita>ng.faltaEmpiece){
        ng.mostrarFalta=false;
      }else{
        ng.mostrarFalta=true;
      }

      try{
        if(ahorita-inicioPT>0){ // ya empezo 
          // console.log('aaa');
          ng.mostrarFalta=false;
          if(evento.estadoPartido==ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF){
            asignarEstadoTimer(ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF);
            ng.inicioTiempo=inicioPT;
            ng.$broadcast('timer-start');
          }else{
            if(evento.estadoPartido==ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF){
              ng.stopTimer(1);
            }else{
              if(evento.estadoPartido==ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF){
                asignarEstadoTimer(ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF);
                ng.suceso.tiempo=2;
                ng.inicioTiempo=inicioST;
                ng.$broadcast('timer-start');
              }else{
                if(evento.estadoPartido==ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF){
                  ng.stopTimer(2);
                }
              }
            }
          }
        }else{ // aun no empieza
            // console.log('ccc');
            ng.faltaEmpiece=Math.floor(new Date(evento.inicioPT).getTime());
            // ng.selectedTab=0;
            $msj.show('Actualize la hora de inicio del primer tiempo',positionMSj);
        }
        
        if(ng.evento.estadoPartido!==ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF){
          ng.publicarEvento();
        }
      }catch(error){
        console.log(error);
      }
    };

    ng.startTimer = function (evento){
      cambiarContador(ng.evento);
    };

    ng.stopTimer = function (partePartido){
      var confirmDeleteNew = $mdDialog.confirm({
        title: 'Alerta',
        content: partePartido==1?'¿Está seguro que desea terminar el Primer Tiempo?':'¿Está seguro que desea terminar el Segundo Tiempo?',
        ok: 'Aceptar',
        cancel:'Cancelar'
      });
      $mdDialog.show(confirmDeleteNew).then(function() {
        if(partePartido==1){ // fin del primer tiempo 
          asignarEstadoTimer(ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF);
          // $msj.show('Actualize la hora de inicio del segundo tiempo',positionMSj);
        }
        if(partePartido==2){ // fin del segundo tiempo
          asignarEstadoTimer(ng.enumEstadoPartidoCMS.FINALIZADO._idDF);
        }
        ng.iniciotiempo=Date.now();
        ng.$broadcast('timer-stop');
        ng.$broadcast('timer-clear');
        ng.publicarEvento();
      }).finally(function() {
        confirmDeleteNew = undefined;
      });
    };
    // ---- FIN TIMER ---- //

    var verificarEvento=function(){
      if(nid){ // EDITAR EVENTO
        // console.log('editar');
        obtenerEvento(nid);
      }else{ // AGREGAR EVENTO
        // console.log('agregar');
        inicializarObjetos();
        verificarSesionTw();
        // listarCampeonatos();
      }

    };

    var obtenerEvento=function(nid){
      $preload.show();
      $login.get(URL.base + URL.evento.detalle+nid).then(
        function(response) {
          var data=response.response;
          if(response.status){
            if(data){ // evento existe
              inicializarObjetos();
              angular.copy(data, ng.evento);
              
              ng.objDate_publish = new Date(ng.evento.fechaInicio); //Date publish
              ng.objTime_publish = new Date(ng.evento.fechaInicio); //Time publish
              
              // ocultar imagenes al inicio
              angular.forEach(ng.evento.incidencias, function(value,key){
                ng.evento.incidencias[key].mostrarImagen=false;
              });

              if(ng.evento.tipo.id===ng.enumCategoria.DEPORTE.id){
                iniciarContador(ng.evento);  
              }
              
              $timeout(function(){
                if(ng.evento.tipo.id===ng.enumCategoria.DEPORTE.id){
                  if(ng.evento.idDataFactory!==0){
                    sincronizarDatafactory(ng.evento.idDataFactory);
                  }  
                }else{
                  // console.log('bbb');
                }
                  
              },1000);

              verificarSesionTw();
              
              $preload.hide();
            }else{
              $location.path('/eventos/');
            }
          }else{
                      
          }
        },
        function(msgError) {
          
        }
      );
    };

    var listarCampeonatos=function(){
      $preload.show();
      $login.get(URL.base + URL.dataFactory.listarCampeonatos).then(
        function(response) {
          if(response.status){
            var data=response.response
            angular.forEach(data, function(val,key){
              ng.listaCampeonatos.push(val);
            });
            $preload.hide();
          }else{
                      
          }
        },
        function(msgError) {
          
        }
      );
    };

    var listarAlineaciones=function(idDF){
      ng.mostrarCargaAlineaciones=true;
      $login.get(URL.base + URL.dataFactory.listarAlineaciones+idDF).then(
        function(response) {
          if(response.status){
            var data=response.response[0];
            angular.copy(data, ng.alineaciones);
            ng.mostrarCargaAlineaciones=false;
          }else{
                      
          }
        },
        function(msgError) {
          
        }
      );
    };

    var listarEncuentroDF=function(idDF){
      ng.mostrarCargaEncuentro=true;
      $login.get(URL.base + URL.dataFactory.listarEncuentro+idDF).then(
        function(response) {
          if(response.status){
            var data=response.response;
            angular.copy(data, ng.encuentroDF);
            ng.evento.lugar=ng.encuentroDF.lugar;
            ng.mostrarCargaEncuentro=false;
          }else{
                      
          }
        },
        function(msgError) {
          
        }
      );
    };

    var determinarEstadoPartido=function(_id){
      var estado;
      switch(_id){
        case ng.enumEstadoPartidoDF.SIN_INICIAR._id:
          estado=ng.enumEstadoPartidoDF.SIN_INICIAR.valor;
          break;
        case ng.enumEstadoPartidoDF.PRIMER_TIEMPO._id:
          estado=ng.enumEstadoPartidoDF.PRIMER_TIEMPO.valor;
          break;
        case ng.enumEstadoPartidoDF.FINALIZADO._id:
          estado=ng.enumEstadoPartidoDF.FINALIZADO.valor;
          break;
        case ng.enumEstadoPartidoDF.SUSPENDIDO._id:
          estado=ng.enumEstadoPartidoDF.SUSPENDIDO.valor;
          break;
        case ng.enumEstadoPartidoDF.POSTERGADO._id:
          estado=ng.enumEstadoPartidoDF.POSTERGADO.valor;
          break;
        case ng.enumEstadoPartidoDF.ENTRETIEMPO._id:
          estado=ng.enumEstadoPartidoDF.ENTRETIEMPO.valor;
          break;
        case ng.enumEstadoPartidoDF.SEGUNDO_TIEMPO._id:
          estado=ng.enumEstadoPartidoDF.SEGUNDO_TIEMPO.valor;
          break;
        case ng.enumEstadoPartidoDF.FIN_TIEMPO_REGLAMENTARIO._id:
          estado=ng.enumEstadoPartidoDF.FIN_TIEMPO_REGLAMENTARIO.valor;
          break;
        case ng.enumEstadoPartidoDF.ALARGUE_1._id:
          estado=ng.enumEstadoPartidoDF.ALARGUE_1.valor;
          break;
        case ng.enumEstadoPartidoDF.FIN_ALARGUE_1._id:
          estado=ng.enumEstadoPartidoDF.FIN_ALARGUE_1.valor;
          break;
        case ng.enumEstadoPartidoDF.FIN_ALARGUE_1._id:
          estado=ng.enumEstadoPartidoDF.FIN_ALARGUE_1.valor;
          break;
        case ng.enumEstadoPartidoDF.ALARGUE_2._id:
          estado=ng.enumEstadoPartidoDF.ALARGUE_2.valor;
          break;
        case ng.enumEstadoPartidoDF.FIN_ALARGUE_2._id:
          estado=ng.enumEstadoPartidoDF.FIN_ALARGUE_2.valor;
          break;
        case ng.enumEstadoPartidoDF.DEFINICION_PENALES._id:
          estado=ng.enumEstadoPartidoDF.DEFINICION_PENALES.valor;
          break;
        default:
          estado=ng.enumEstadoPartidoDF.SIN_INICIAR.valor;
          break;
      }
      return estado;
    };

    var listarIncidenciasDF=function(idDF){
      ng.mostrarCargaIncidencias=true;
      var cursor='/'+20;
      $login.get(URL.base + URL.dataFactory.listarIncidencias+idDF+cursor).then(
        function(response){
          if(response.status){
            var incidenciasDF=response.response;
            var matchDF=response.match;
            angular.copy(incidenciasDF, ng.incidenciasDF);
            ng.evento.match=matchDF;
            ng.suceso.hora=matchDF.minuto_juego;
            ng.lblEstadoPartido=determinarEstadoPartido(matchDF.estado);
            ng.mostrarCargaIncidencias=false;
          }else{
                
          }
        },
        function(msgError) {
          
        }
      );
    };

    var sincronizarDatafactory=function(idDataFactory){
      listarEncuentroDF(idDataFactory);
      listarAlineaciones(idDataFactory);
      listarIncidenciasDF(idDataFactory);
      var finalizado=false;
      if(ng.evento.match.cobertura){
        var interval= $interval(function(){
          listarIncidenciasDF(idDataFactory);
          //FINALIZADO, SUSUPENDIO, POSTERGADO no llamo al ajax
          if(ng.lblEstadoPartido===ng.enumEstadoPartidoDF.FINALIZADO.valor||
            ng.lblEstadoPartido===ng.enumEstadoPartidoDF.SUSPENDIDO.valor||
            ng.lblEstadoPartido===ng.enumEstadoPartidoDF.POSTERGADO.valor){

            finalizado=true;
            // console.log(finalizado);
            if(finalizado){
              // console.log('hhhhhh');
              $interval.cancel(interval);
            }

          }
        },reloadDF*1000);
      }
    };

    var by = function (attr, menor){
      return function (o, p){
          var a, b;

          if (typeof o === "object" && typeof p === "object" && o && p ){

            // a = parseInt(o[attr]);
            // b = parseInt(p[attr]);

            // if(o[attr]=='') o[attr]=0; 
            // if(p[attr]=='') p[attr]=0; 

            a = parseFloat(o[attr]);
            b = parseFloat(p[attr]);

            if (a === b ){
                return typeof menor === 'function' ? menor(o, p) : 0;
            }

            if (typeof a === typeof b){
                return a > b ? -1 : 1;
            }

            return typeof a > typeof b ? -1 : 1;

          }else{

            throw{
              name : "Error",
              message : "Esto no es un objeto, al menos no tiene la propiedad " + attr
          };
        }
      };
    };

    // ng.testOrden=function(incidencias){
    //   console.log(incidencias,'llllllll');
    // };

    // ng.ordenarET=function(){
    //   for (var i = 0; i <ng.evento.incidencias.length; i++) {
    //     if(ng.evento.incidencias[i].grupo==3){
    //       ng.evento.incidencias[i].grupo=1.5;
    //     }
    //   };
    // }

    ng.agregarIncidencia=function(obj){
      // console.log(obj,'ooo');
      obj.tipo="datafactory";
      obj.grupo=determinarGrupoSucesoPorPartePartido(obj.tiempo);
      var existe=false;
      for (var i = 0; i < ng.evento.incidencias.length; i++) {
        if(ng.evento.incidencias[i].id==obj.id){
          existe=true;
          var confirmDeleteNew = $mdDialog.confirm({
            title: 'Alerta',
            content: 'La incidencia ya ha sido agregada',
            ok: 'Aceptar'
          });
          $mdDialog.show(confirmDeleteNew).then(function() {
            
          }).finally(function() {
            confirmDeleteNew = undefined;
          });
          return false;
        }else{
          existe=false;
        }
      };
      if(!existe){
        ng.evento.incidencias.unshift(obj);
        ng.evento.incidencias.sort(by('grupo', by('hora')));
      }
      ng.publicarEvento();
      if(ng.evento.twittear) publicarTwit(obj);
    };

    var determinarGrupoSucesoPorEstadoPartido=function(estadoPartido){
      var grupo;
      switch(estadoPartido){
        case ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF:
          grupo=ng.enumEstadoPartidoCMS.SIN_INICIAR.grupo;
          break;
        case ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF:
          grupo=ng.enumEstadoPartidoCMS.PRIMER_TIEMPO.grupo;
          break;
        case ng.enumEstadoPartidoCMS.ENTRETIEMPO._idDF:
          grupo=ng.enumEstadoPartidoCMS.ENTRETIEMPO.grupo;
          break;
        case ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF:
          grupo=ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO.grupo;
          break;
        case ng.enumEstadoPartidoCMS.FINALIZADO._idDF:
          grupo=ng.enumEstadoPartidoCMS.FINALIZADO.grupo;
          break;
        default:
          grupo=ng.enumEstadoPartidoCMS.SIN_INICIAR.grupo;
          break;
      }
      return grupo;
    };

    var determinarGrupoSucesoPorPartePartido=function(partePartido){
      var grupo;
      switch(partePartido){
        case ng.enumEstadoPartidoCMS.PRIMER_TIEMPO.grupo:
          grupo=ng.enumEstadoPartidoCMS.PRIMER_TIEMPO.grupo;
          break;
        case ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO.grupo:
          grupo=ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO.grupo;
          break;
        default:
          grupo=ng.enumEstadoPartidoCMS.SIN_INICIAR.grupo;
          break;
      }
      return grupo;
    };

    var agregarIncidenciaCMS=function(suceso, reset, twittear){
      suceso.fecha_publicacion=Date.now();
      ng.evento.incidencias.splice(0,0,suceso);
      ng.publicarEvento();
      if(ng.evento.twittear&&twittear) publicarTwit(suceso);
      if(reset) setearSucesoVacio();
    };

  	ng.agregarSuceso = function(suceso, reset, twittear){
      if(ng.evento.id!==''){
        suceso.grupo=determinarGrupoSucesoPorEstadoPartido(ng.evento.estadoPartido);
        suceso.fecha_publicacion=Date.now();
        if(suceso.grupo==ng.enumEstadoPartidoCMS.SIN_INICIAR.grupo||suceso.grupo==ng.enumEstadoPartidoCMS.ENTRETIEMPO.grupo) 
          suceso.hora='';
        try{
          if(suceso.texto.length<1){
            if(suceso.foto===''&&suceso.embed==='')
              $msj.show('Agregue un texto, una imagen o un embeb',positionMSj);
            else
              agregarIncidenciaCMS(suceso, reset, twittear);
          }else
            agregarIncidenciaCMS(suceso, reset, twittear);
        }catch(error){
          // console.log(error);
        }  
      }else{
        $msj.show('Guarde el evento para poder publicar incidencias',positionMSj);  
      }
    };

    ng.eliminarSuceso = function(idx){ ng.evento.incidencias.splice(idx,1); };

    ng.agregarSucesoEnter = function($event, suceso){
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        ng.agregarSuceso(suceso,true,true);
      }
    };

    ng.obtenerIndexIconoEditar=function(idx){
      ng.indexIconoEditar=idx;
    };

    var deportivo={
      futbol:{
        duracionTiempo:45,
        partes:2
      }
    };

    var calcularTiempoReglamentarioPorParte=function(eventoDeportivo){
      var tiempos=[];
      for (var i = 1; i <= eventoDeportivo.partes; i++) {
        tiempos.push({parte:i,fin:i*eventoDeportivo.duracionTiempo});
      };
      return tiempos;
    };

    ng.calcularAdicional=function(parte,minuto,idx){
      var tiempos=calcularTiempoReglamentarioPorParte(deportivo.futbol);
      var tiempoExtra=minuto-tiempos[parte-1].fin;
      angular.forEach(ng.evento.incidencias, function(value,key){
        if(key==idx){
          tiempoExtra=(tiempoExtra>0)?'+'+tiempoExtra:'';
          ng.evento.incidencias[key].mas_tiempo=tiempoExtra;
          // if(tiempoExtra>0){
          //   ng.evento.incidencias[key].hora=45;
          // }
        }
      });
      return tiempoExtra;
    };

    // ---- INICIO CAMBIO ESTADO ---- //

    ng.mostrarModalCambiarEstado=function($event, nuevoEstado){
      var confirm = $mdDialog.confirm({
        title: 'Alerta',
        content: '¿Está seguro que desea cambiar de '+ determinarEstadoPartido(ng.evento.estadoPartido)+' a '+nuevoEstado.valor+'?',
        ok: 'Aceptar',
        cancel:'Cancelar'
      });
      $mdDialog.show(confirm).then(function() {
        ng.evento.estadoPartido=nuevoEstado._idDF;
        iniciarContador(ng.evento);
      }).finally(function() {
        confirm = undefined;
      });
    };

    // ---- FIN CAMBIO ESTADO ---- //

    // ---- INICIO MODAL HORA ---- //

    ng.mostrarModalHora = function($event){
      $mdDialog.show({
        targetEvent : $event,
        // scope: ng,
        preserveScope: true,
        templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/eventos/hora.html',
        controller : mostrarModalHoraCtrl,
        controllerAs:'mh',
        locals: {
            modal : {
              inicioPT:ng.evento.inicioPT,
              partePartido:ng.partePartido
            }
        }
      })
      .then(function() {
        var ahorita=Date.now();

        if(ng.evento.estadoPartido==ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF){
          if(ahorita>ng.evento.inicioPT){ // ya empezo pt
            ng.inicioTiempo=ng.evento.inicioPT;  
            ng.mostrarFalta=false;
            asignarEstadoTimer(1);
            ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF;
            // broadcast('time-start');
          }else{
            ng.faltaEmpiece=ng.evento.inicioPT;
            ng.mostrarFalta=true;
            asignarEstadoTimer(0);
            ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF;
            // console.log('ttttt');
          }
          ng.$broadcast('timer-start');
        }

        if(ng.evento.estadoPartido==ng.enumEstadoPartidoCMS.PRIMER_TIEMPO._idDF){
          // console.log('kkk');
          if(ahorita>ng.evento.inicioPT){ // ya empezo pt
            ng.inicioTiempo=ng.evento.inicioPT;  
            ng.mostrarFalta=false;
            // console.log('ppp');
          }else{
            ng.faltaEmpiece=ng.evento.inicioPT;
            ng.mostrarFalta=true;
            // console.log('oooo');
            ng.evento.estadoPartido=ng.enumEstadoPartidoCMS.SIN_INICIAR._idDF;
            asignarEstadoTimer(0);
          }
        }
        if(ng.evento.estadoPartido==ng.enumEstadoPartidoCMS.SEGUNDO_TIEMPO._idDF){
          if(ahorita>ng.evento.inicioST){ // ya empezo st
            ng.inicioTiempo=ng.evento.inicioST;  
            ng.mostrarFalta=false;
          }else{
            ng.faltaEmpiece=ng.evento.inicioPT;
            ng.mostrarFalta=true;
          }
        }
        
        $timeout(function(){
          ng.publicarEvento();
        },500);


      }, function() {
        $mdDialog.cancel();
      });
    };

    function mostrarModalHoraCtrl(scope, modal, $timeout){
      this.inicioPrimerTiempo=modal.inicioPT;
      this.inicioSegundoTiempo=modal.inicioST;
      this.partePartido=modal.partePartido;
      this.cancelarModalHora = function(){
        $mdDialog.cancel();
      };
      this.aceptarModalHora = function(){
        if(this.partePartido==1){
          ng.evento.inicioPT=Date.parse(this.inicioPrimerTiempo);
        }
        if(this.partePartido==2){
          ng.evento.inicioST=Date.parse(this.inicioSegundoTiempo);
        }
        $mdDialog.hide();
      };
    };

    // ---- FIN MODAL HORA ---- //

    // ---- INICIO EMBED ---- //
    ng.mostrarModalEmbed = function($event, type, $index){
      $event.preventDefault();
      var type = type, index = $index;
      $mdDialog.show({
        targetEvent : $event,
        scope: $scope,
        preserveScope: true,
        templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/eventos/embed.html',
        controller : mostrarModalEmbedCtrl,
        locals: {
            modal : {
                type: type,
                index: index
            }
        }
      })
      .then(function() {
        
      }, function() {
        $mdDialog.cancel();
      });
    };

    function mostrarModalEmbedCtrl(scope, modal, $timeout) {
      scope.modalType = modal.type;
      if(modal.type === 'edit'){ // editar embed
        scope.embed=ng.evento.incidencias[modal.index].embed;
        // if(scope.embed){
        //     if(scope.embed.indexOf('fb-root')){
        //         if (typeof (FB) != 'undefined') {
        //             $timeout(function () {
        //                 FB.XFBML.parse(document.getElementById('fb-embed'));
        //             }, 0);
        //         }
        //     }else if(scope.embed.indexOf('twitter')){
        //         if (typeof (twttr) != 'undefined') {
        //             twttr.widgets.load();
        //         }
        //     }
        // }
      }else{ // agregar embed
          scope.embed = ng.suceso.embed;
      }

      scope.cancelarModalEmbed = function(){
        $mdDialog.cancel();
      };
      scope.aceptarModalEmbed = function(){
        if(modal.type === 'edit'){ // editar embed
          ng.evento.incidencias[modal.index].embed=scope.embed;    
        }else{ // agregar embed
          ng.suceso.embed=scope.embed;
        }
        $mdDialog.hide();
      };
    };

    // ---- FIN EMBED ---- //

    // INICIO SELECCIONAR EQUIPO ---- //

    ng.mostrarModalSeleccionarEquipo=function($event, tipo, equipo){
      $event.preventDefault();
      $mdDialog.show({
        targetEvent : $event,
        scope: $scope,
        preserveScope: true,
        templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'eventos/seleccionar-equipo.html',
        controller : mostrarModalSeleccionarEquipoCtrl,
        locals: {
            modal : {
              tipo:tipo,
              equipo:equipo
            }
        }
      })
      .then(function() {
        
      }, function() {
        $mdDialog.cancel();
      });
    };

    function mostrarModalSeleccionarEquipoCtrl(scope, modal) {
      // console.log(modal,'mmmooo');
      scope.selectedIndex=modal.equipo;
      scope.listaEquipos=[];
      scope.inputBuscarEquipo='';
      var listarEquipos=function(){
        scope.searchLoadCT=true;
        $login.get(URL.base + URL.evento.buscarPartidos+scope.inputBuscarEquipo).then(
          function(response) {
            if(response.status){
              var data=response.response;
              scope.listaEquipos=data;
              scope.searchLoadCT=false;
            // }else{
            //   $preload.hide();             
            }
          },
          function(msgError) {
            scope.searchLoadCT=false; 
          }
        );
      };
      
      scope.clickLoadSearch=function($event){
        var event = $event;
        listarEquipos(); 
        event.preventDefault();
      }

      scope.enterLoadSearch=function($event){
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
          listarEquipos();
        } 
      }

      scope.seleccionarEquipo=function(equipo){
        scope.selectedIndex=equipo;
      };

      scope.cancel = function() {
        $mdDialog.cancel();
      };
      scope.guardarSeleccion=function(){
        if(modal.tipo==='local'){
          ng.evento.match.local.id=scope.selectedIndex.id;
          ng.evento.match.local.nombre_equipo=scope.selectedIndex.nombre_equipo;
        }else if(modal.tipo==='visitante'){
          ng.evento.match.visitante.id=scope.selectedIndex.id;  
          ng.evento.match.visitante.nombre_equipo=scope.selectedIndex.nombre_equipo;  
        }
        scope.inputBuscarEquipo='';
        $mdDialog.hide();
      };
    };

    // FIN SELECCIONAR EQUIPO ---- //

    // ---- INICIO RELACIONADOS ---- //
    ng.mostrarModalRelacionados = function($event, type, $index, incidencia){
      $event.preventDefault();
        var type = type, index = $index;
        $mdDialog.show({
          targetEvent : $event,
          scope: $scope,
          preserveScope: true,
          templateUrl : CMSDATA.GLOBAL.URLTEMPLATE + 'modal/eventos/openaddrelated.html',
          controller : mostrarModalRelacionadosCtrl,
          locals: {
              modal : {
                  type: type,
                  index: index,
                  incidencia: incidencia
              }
          }
        })
        .then(function() {
          
        }, function() {
          $mdDialog.cancel();
        });
    };

    function mostrarModalRelacionadosCtrl(scope, modal, $timeout) {
      //RELATED
      scope.searchRel = undefined;
      scope.readonlySearchCT = false;
      scope.listArrSocialNoResultCT = false;
      scope.searchLoadCT = false;
      scope.listArrRelated = [];
      scope.listArrSocialCT = [];
      var resetRelated = function(){
          scope.listArrRelated = [];
          scope.readonlySearchCT = false;
          scope.searchRel = undefined;
          scope.listArrSocialCT = [];
      };
      var loadRelatedEdit = function(obj){
          var obj = obj;
          scope.listArrRelated = obj;
      };
      scope.keySearchRelated = function($event){
          //ENTER
          if($event.which === 13) {
              scope.searchRelated();
          }
      };
      scope.searchRelated = function(){
          var type = 'web';
          scope.listArrSocialCT = [];
          scope.readonlySearchCT = true;
          scope.searchLoadCT = true;
          $http.get(CMSDATA.URLSEARCHSOCIAL + '/' + scope.searchRel + '/' + type).
          success(function(data){
              var data = data;
              if(data != null){
                  if(data.status){
                      var response = data.response;
                      scope.listArrSocialCT = (response)?response:[];
                      scope.searchLoadCT = false;
                      scope.readonlySearchCT = false;
                      $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                      if(response.length<=0){
                          scope.listArrSocialNoResultCT = true;
                      }else{
                          scope.listArrSocialNoResultCT = false;
                      }
                  }else{
                      scope.readonlySearchCT = false;
                      scope.searchLoadCT = false;
                      scope.listArrSocialNoResultCT = false;
                      $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                  }
              }else{
                  scope.searchLoadCT = false;
                  scope.readonlySearchCT = false;
                  scope.listArrSocialNoResultCT = false;
                  $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
              }
          }).error(function(data) {
              scope.searchLoadCT = false;
              scope.readonlySearchCT = false;
              scope.listArrSocialNoResultCT = false;
              $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
          });
      };
      scope.clickCheckCT = function(index, obj){
          var index = index, obj = obj;
          scope.listArrRelated.push(obj);
          scope.listArrSocialCT.splice(index, 1);
      };
      scope.clickRemoveCT = function(index){
          var index = index;
          scope.listArrRelated.splice(index, 1);
      };
      //TYPE
      if(modal.incidencia.noticias_relacionadas&&modal.incidencia.noticias_relacionadas.length>0){
        modal.type = 'edit';
        scope.modalType = 'edit';
      }else{
        modal.type = 'add';
        scope.modalType = 'add';
      }
      if(modal.type === 'edit'){
          scope.listArrRelated = modal.incidencia.noticias_relacionadas;
      }else{
          //CLEAR ADD
          scope.listArrRelated = [];
      }
      //CLOSE
      scope.closeOpenAddText = function(){
          $mdDialog.cancel();
      };
      scope.addOpenAddText = function(){
        if(modal.index!==-1)
          ng.evento.incidencias[modal.index].noticias_relacionadas=scope.listArrRelated;
        else
          ng.suceso.noticias_relacionadas=scope.listArrRelated;
        $mdDialog.hide();
      };
      // scope.removeOpenAddRelated = function(){
      //     //DELETE
      //     scope.relacionado.alineacion = CMSDATA.OBJNEW.relacionado.alineacion;
      //     scope.relacionado.items = CMSDATA.OBJNEW.relacionado.items;
      //     scope.listArrRelated = [];
      //     resetRelated();
      //     scope.addOpenAddText();
      //     $timeout(function(){
      //         $mdDialog.hide();
      //     }, 0);
      // };
    };

    // ---- FIN RELACIONADOS ---- //

    ng.fields = {
        titulo: '',
        tipo: ''
    };

    var clearRevisionErrorFiled = function(){
      ng.fields.titulo = '';
      ng.fields.tipo = '';  
    };

    var revisionErrorFiled = function(fields){
        var fields = fields;
        if(fields){
            ng.fields.titulo = fields.hasOwnProperty('titulo')?fields.titulo:'';
            ng.fields.tipo = fields.hasOwnProperty('tipo')?fields.tipo:'';
        }
    };

    //ALERT ERROR LIST
    var toastErrorList = function(errorList, errorMsj){
        var _err = '', errorList = errorList, errorMsj = errorMsj;
        angular.forEach(errorList, function(v, i){
            _err += '<li>' + v + '</li>';
        });
        var type = 'toast-error--list';
        $mdToast.show({
           template: '<md-toast class="md-toast ' + type +'">' +
           '<p class="p-info">' + errorMsj + ':</p>'+
           '<ul>'+
            _err +
           '</ul>'+
           '</md-toast>',
           hideDelay: 7000,
           position: positionMSj
       });
    };

    var toastError = function(errorMsj){
        var type = 'toast-error--list';
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type +'">' +
            '<p class="p-info">' + errorMsj + '.</p>'+
            '</md-toast>',
            hideDelay: 7000,
            position: positionMSj
       });
    };

    var validDateTime = function(date, time){
      var date = date, time = time, replaceStr = function(str, arrPos, arrValue){
          var arr = str.split('');
          for (var i = 0; i < arrPos.length; i++) {
              arr[arrPos[i]] = arrValue[i];
          }
          return arr.join('');
      };
      if(date != null){
          if(time != null){
              //Time Get Values HH, MM
              var arrTime = time.toString().split(' '),
              _arrTime = arrTime[4].split(':'),
              HH = _arrTime[0], MM = _arrTime[1];
              //Date Replace Format Wed May 13 2015 07:45:00 GMT-0500 (PET)
              var strDate = date.toString();
              date = replaceStr(strDate, [16,17,19,20], (HH + MM).split('')); //HH & MM
              return date;
          }else{
              return date;
          }

      }else{
          return null;
      }
    };

    ng.publicarEvento = function(tipo){
      ng.evento.fechaInicio = validDateTime(ng.objDate_publish, ng.objTime_publish);
      $preload.show();
      $http.post(URL.base + URL.evento.guardar, ng.evento).
        success(function(response) {
          $preload.hide();
          if(response.status){
            angular.copy(response.response, ng.evento);
            ng.evento.fechaInicio=new Date(ng.evento.fechaInicio);
            // ng.evento.horaInicio=new Date(ng.evento.horaInicio);
            $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
            clearRevisionErrorFiled();
            if(tipo=='agregar'){
              $location.path('/eventos/detalle/'+ng.evento._id);
            }
          }else{
            $preload.hide();
            toastErrorList(response.error.fields, response.error.message);
            //Revision de campos con errores
            revisionErrorFiled(response.error.fields);
          }
        }).error(function(response) {
            $preload.hide();
            $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
      });
    };

    ng.agregarImagen = function(idxIncidencia){
        var elm = angular.element('#add-img--cover');
        var thumbData = elm.parent().prev('.loadThumbData');
        elm.parent().prev('.loadThumbData').val('');
        $timeout(function() {
          thumbData.trigger('click');
          elm.parent().prev('.loadThumbData').off('change').on('change', function(evt){
            var file = evt.currentTarget.files[0];
            var size = file.size; // bytes
            var maxSize=1; // Mb
            var imgSize = ($bytesToSize.convert(size)).split(' ');
            var isVideoGood = parseFloat(imgSize[0]);
            var typeVideoLoad = imgSize[1];
            var formdata = new FormData();
            formdata.append('file', file);
            if(typeVideoLoad === 'Bytes' || typeVideoLoad === 'KB'){
                guardarImagen(formdata,idxIncidencia);
                return false;
            }else if(typeVideoLoad === 'MB'){
                if(isVideoGood > parseFloat(maxSize)){
                    $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
                }else{
                    guardarImagen(formdata,idxIncidencia);
                }
                return false;
            }else if(typeVideoLoad === 'GB' || typeVideoLoad === 'TB'){
              $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
            } 
          });
        }, 0);
    };

    var editarImagen = function(idxIncidencia){
        var elm = angular.element('#edit-img-'+idxIncidencia);
        var thumbData = elm.parent().prev('.loadThumbData');
        elm.parent().prev('.loadThumbData').val('');
        $timeout(function() {
          thumbData.trigger('click');
          elm.parent().prev('.loadThumbData').off('change').on('change', function(evt){
            var file = evt.currentTarget.files[0];
            var size = file.size; // bytes
            var maxSize=1; // Mb
            var imgSize = ($bytesToSize.convert(size)).split(' ');
            var isVideoGood = parseFloat(imgSize[0]);
            var typeVideoLoad = imgSize[1];
            var formdata = new FormData();
            formdata.append('file', file);
            if(typeVideoLoad === 'Bytes' || typeVideoLoad === 'KB'){
                guardarImagen(formdata,idxIncidencia);
                return false;
            }else if(typeVideoLoad === 'MB'){
                if(isVideoGood > parseFloat(maxSize)){
                    $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
                }else{
                    guardarImagen(formdata,idxIncidencia);
                }
                return false;
            }else if(typeVideoLoad === 'GB' || typeVideoLoad === 'TB'){
              $msj.show('Agregue una imagen con peso menor a 1Mb', positionMSj);
            }
          });
        }, 0);  
    };

    var guardarImagen = function(data,idxIncidencia){
      $preload.show();
      $http.post(URL.base + URL.upload, data, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined} /* multipart/form-data */
      }).
      success(function(data) {
          var data = data;
          if(data.status){
              var response = data.response[0];
              var url = response.url;
              ng.showThumbData = true;
              ng.isDeleteThumb = true;
              // ng.srcThumbData = url;
              $timeout(function () {
                $msj.show(CMSDATA.MSJ.MSJ56, positionMSj);
                $preload.hide();
                if(idxIncidencia===''){ // agregar imagen
                  ng.suceso.foto=url;
                }else{ // editar imagen
                  ng.evento.incidencias[idxIncidencia].foto=url;
                  ng.evento.incidencias[idxIncidencia].mostrarImagen=false;
                  ng.publicarEvento();
                }
              }, 1000);
          }else{
              $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
              $preload.hide();
          }
      }).error(function(data) {
          $msj.show(CMSDATA.MSJ.MSJ39, positionMSj);
          $preload.hide();
      });
        
    };

    ng.mostrarBloqueImagenIncidencia=function($event,$index){
      if(ng.evento.incidencias[$index].foto==''){
        editarImagen($index);
      }else{
        ng.evento.incidencias[$index].mostrarImagen=ng.evento.incidencias[$index].mostrarImagen?false:true;
      }
      $event.preventDefault();
    };

    ng.eliminarImagenIncidencia=function($event,$index){
      $event.preventDefault();
      ng.evento.incidencias[$index].foto='';
    };

    // ---- INICIO NOTICIAS ---- //

    ng.searchLoad = false;
    ng.searchLoadMore = false;
    ng.readonlySearch = false;
    ng.listArrSocialNoResult = false;
    ng.listArrSocial = [];
    ng.cursorMore = '';//CURSOR
    ng.filterFrom = CMSDATA.FILTER.desde; //-1 DAYs
    ng.filterTo = CMSDATA.FILTER.hasta;
    ng.checkBuscar = false;
    var fncLoadSearch = function(){
        ng.searchLoad = true;
        ng.readonlySearch = true;
        ng.listArrSocialNoResult = false;
        ng.cursorMore = '';//CURSOR
        getData();
    };
    // elem.bind('keydown keypress', function(event) {
    //     var event = event;
    //     if(event.which === 13) {
    //         fncLoadSearch();
    //         event.preventDefault();
    //     }
    // });

    ng.enterLoadSearch = function($event){
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        fncLoadSearch();
      }
    };

    ng.clickLoadSearch = function($event){
        var event = $event;
        fncLoadSearch();
        event.preventDefault();
    };

    ng.inputSeachSocial = undefined;
    var getData = function(more){
        var more = more;
        var DATA = {
            sitio: ng.$parent.sitio,
            portada: ng.$parent.seccion,
            alcance : ng.checkBuscar,
            desde : ng.filterFrom.getTime(),
            hasta: ng.filterTo.getTime()
        };
        /*
        var time = (new Date()).getTime();
        var date = new Date(time);
        alert(date.toString()); // Wed Jan 12 2011 12:42:46 GMT-0800 (PST)
        */
        if(more != 'more'){ng.listArrSocial = [];}
        //$http.get(CMSDATA.URLSDESTACADOS + '/' + encodeURIComponent(ng.inputSeachSocial) + '/' + type).
        
        $http.post(CMSDATA.GLOBAL.URLBASE + 'eventos/buscar_noticias' + '/' + encodeURIComponent(ng.inputSeachSocial) + '?cursor=' + ng.cursorMore, DATA).
        success(function(data){
            var data = data;
            if(data != null){
                if(data.status){
                    var response = data.response;
                    var cursor = response.cursor;
                    var items = response.items;
                    var arrPrev = [];
                    angular.forEach(items, function(v,i){
                        arrPrev.push(v);
                        arrPrev[i].drag = 'text';
                    });
                    if(more === 'more'){
                        //BUSQUEDA DE MAS
                        var letArrMore = (arrPrev)?arrPrev:[];
                        if(letArrMore.length>0){
                            angular.forEach(letArrMore, function(v,i){
                                ng.listArrSocial.push(v);
                            });
                        }else{
                            //NO Hay mas data
                            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                        }
                    }else{
                        //BUSQUEDA INICIAL
                        ng.listArrSocial = (arrPrev)?arrPrev:[];
                    }
                    ng.cursorMore = cursor;
                    ng.searchLoad = false;
                    ng.searchLoadMore = false;
                    ng.readonlySearch = false;
                    $msj.show(CMSDATA.MSJ.MSJ28, positionMSj);
                    if(items.length<=0){
                        ng.listArrSocialNoResult = true;
                    }else{
                        ng.listArrSocialNoResult = false;
                    }
                }else{
                    ng.readonlySearch = false;
                    ng.listArrSocialNoResult = false;
                    $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
                }
            }else{
                ng.searchLoad = false;
                ng.ng.searchLoadMore = false;
                ng.readonlySearch = false;
                ng.listArrSocialNoResult = false;
                $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
            }
        }).error(function(data) {
            ng.readonlySearch = false;
            ng.listArrSocialNoResult = false;
            ng.searchLoad = false;
            ng.searchLoadMore = false;
            $msj.show(CMSDATA.MSJ.MSJ29, positionMSj);
        });
    };
    ng.viewMore = function($event){
        ng.searchLoadMore = true;
        getData('more');
    };
   
    ng.mostrarBuscarNoticiasRelacionadas = function(){
      ng.mBuscarNoticiasRelacionadas=ng.mBuscarNoticiasRelacionadas?false:true;
    };

    ng.agregarNotificaRelacionada = function(index, obj, idEvento){
        var index = index, obj = obj;
        ng.evento.noticias.push(obj);
        ng.listArrSocial.splice(index, 1);
        asociarNoticia(idEvento, obj.nid);
    };

    ng.eliminarNotificaRelacionada = function(index, obj, idEvento){
        var index = index;
        ng.evento.noticias.splice(index, 1);
        desasociarNoticia(idEvento, obj.nid);
    };

    var asociarNoticia=function(idEvento, idNoticia){
      $preload.show();
      $login.get(URL.base + URL.evento.asociarNoticia+idEvento+'/'+idNoticia).then(
        function(data) {
            var data = data;
            if(data.status){
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
            }else{

            }
        },
        function(msgError) {

        }
      );
    };

    var desasociarNoticia=function(idEvento, idNoticia){
      $preload.show();
      $login.get(URL.base + URL.evento.desasociarNoticia+idEvento+'/'+idNoticia).then(
        function(data) {
            var data = data;
            if(data.status){
                $preload.hide();
                $msj.show(CMSDATA.MSJ.MSJ5,positionMSj);
            }else{

            }
        },
        function(msgError) {
        }
      );
    };

    // ---- FIN NOTICIAS ---- //

    // ---- INICIO TWITTER ---- //
    
    ng.userTw=null;

    var verificarSesionTw=function(){
      $preload.show();
      $login.get(URL.base+URL.social.tw.sesion).then(
        function(data) {
            var data = data;
            if(data.status){
              ng.userTw=data.response.response;
              ng.evento.twittear=true;
            }else{
              ng.evento.twittear=false;         
            }
            $preload.hide();
        },
        function(msgError) {
        
        }
      );  
    };

    var publicarTwit=function(incidencia){
      $preload.show();
      $http.post(URL.base + URL.social.tw.publicar, incidencia).
        success(function(response) {
          $preload.hide();
          if(response.status){
            // console.log('twitter enviado');
            // toastError('Twit publicado');
          }else{
            // console.log('twitter no enviado');
            $timeout(function(){
              toastError(response.error.message);
            },2500);
          }
        }).error(function(response) {
            $preload.hide();
            $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
      });  
    };

    var openDialog = function(uri, name, options, closeCallback) {
      var win = window.open(uri, name, options);
      var interval = window.setInterval(function() {
          try {
              if (win == null || win.closed) {
                  window.clearInterval(interval);
                  closeCallback(win);
              }
          }
          catch (e) {
          }
      }, 1000);
      return win;
    };

    ng.twittear=function(){
      if(ng.userTw!==null)
        ng.evento.twittear=!ng.evento.twittear;
      else
        $msj.show('Tiene que conectarse a Twitter',positionMSj);
    };

    ng.conectarTw=function(){
      var window_width = 626;
      var window_height = 466;
      var window_top = ($(window).height()-window_height)/2;
      var window_left = ($(window).width()-window_width)/2;
      openDialog(URL.base+URL.social.tw.conectar, 'Conectar Twitter', 'width='+window_width+',height='+window_height+', top='+window_top+', left='+window_left+'', verificarSesionTw);
    };

    ng.desconectarTw=function(){
      $preload.show();
      $http.get(URL.base + URL.social.tw.desconectar).
        success(function(response) {
          $preload.hide();
          if(response.status){
            ng.userTw=null;
            ng.evento.twittear=false;
            // console.log('desconecto');
          }else{
            // console.log('no desconecto');
          }
        }).error(function(response) {
            $preload.hide();
            $msj.show(CMSDATA.MSJ.MSJ6,positionMSj);
      });
    }

    // ---- FIN TWITTER ---- //

    // ---- INICIO SOCIAL ---- //
      ng.selectedIndex=0;
     $rootScope.$on('incidencia:social', function(event, data) {
        data.fecha_publicacion=Date.now();
        ng.agregarSuceso(data, false, false);
    });
    // ---- FIN SOCIAL ---- //

    //FORM
    ng.formOptionSearch = false;
    ng.layerSearch = false;
    $body = angular.element('body');
    ng.custom = true;
    ng.btnOpenFilter = function($event){
        var $elm = angular.element($event.target),
        $frm = angular.element('#contentSearch');
        ng.custom = ng.custom === false ? true: false;
        if(ng.custom){
            ng.formOptionSearch = false;
            $frm.removeClass('focus');
            ng.layerSearch = false;
            //$body.css('overflow', 'visible');
        }else{
            ng.formOptionSearch = true;
            $frm.addClass('focus');
            ng.layerSearch = true;
            //$body.css('overflow', 'hidden');
        }
    };
    ng.hideLayer = function($event){
        var $elm = angular.element($event.target);
        //RESET LAYER SEARCH
        ng.resetLayerSearch();
    };
    ng.searchFilterNews = function($event){
        //REFRESH rootScope DATASEARCH
        ng.refresRootDataSearch();

        //RESET LAYER SEARCH
        ng.resetLayerSearch();
        $rootScope.datasearchOutPage = $rootScope.datasearch;
        $location.path('/publicador');
        $event.preventDefault();
        //$body.css('overflow', 'visible');
    };
    ng.resetLayerSearch = function(){
        $frm = angular.element('#contentSearch');
        ng.formOptionSearch = false;
        $frm.removeClass('focus');
        ng.layerSearch = false;
        ng.custom = true;
    };


    ng.clicVolver = function(){ $location.path('/eventos/'); };

    //Close Session
    ng.disabledCloseSession = false;
    ng.closeSession = function() {
      $logout.get(URL.base + URL.logout);
    };

    var init=function(){
      verificarSesion();
    }();
	
}]);

});