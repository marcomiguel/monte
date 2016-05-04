var width = 714,
    height = 440,
    space = 100,
    radius = (height/2)+space,
    dataCamara,
    hemiciclo,
    bancas,
    bancas_renuevan,
    hemiciclo_nuevas,
    bancas_nuevas,
    bancas_renuevan_nueva;
    circleradio = 7,
    info = {
        "senadores": "",
        "diputados": "",
        "mesas": "",
        "votos": ""
    },
    mapClass = {
        "FPV y aliados":"FPV",
        "CAMBIEMOS":"CAMB",
        "UNA":"UNA",
        "PROGRESISTAS":"PROG",
        "IZQUIERDA":"FIT",
        "PJ.DISIDENTES":"PJD",
        "OTROS":"OTROS"
    };

var path = location.pathname.split('_');
path = path[path.length-1].split('.html')[0];

if(path == "diputados"){
    var filas = 32,
        cols = 8,
        espaciado = 26,
        cicleVariation = 0.5,
        arcGradient = 180,
        truncate = {
            "PROGRESISTAS":"PROGRESIST.",
        },
        totalBancas=256;
}
if(path == "senadores"){
    var filas = 18,
        cols = 4,
        espaciado = 45,
        cicleVariation = 0.2,
        arcGradient = 186,
        truncate = {},
        totalBancas=71;
}

// Camara Actual
var svg = d3.select("svg#camaras")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width/2)-17) + "," + (height-20) + ")");

// Camara Nueva
var svg2 = d3.select("svg#camara_nueva")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + ((width/2)-17) + "," + (height-20) + ")");


var arc = d3.svg.arc().innerRadius(radius-3).outerRadius(radius).padAngle(.01)
var arcNum = d3.svg.arc().innerRadius(radius).outerRadius(radius+10);

var hashformat = d3.time.format("%Y%m%d%H%M");
var hashes = 5 * Math.round( hashformat( new Date() ) / 5 );
d3.json('data/camaras/info.json?time='+hashes)
    .get(function(err, data) {
        info.senadores = data[0].jsonSen;
        info.diputados = data[0].jsonDip;
        info.mesas = data[0].mesas;
        info.votos = data[0].votos;
        action();
    });

function action(){
    d3.json('data/camaras/'+info[path], function (data){
        total_ambitos = d3.nest().key(function(d){return d.ambito}).sortKeys(d3.ascending).map(data, d3.map);
        totales = total_ambitos.get('ARG');
        dataCamara = d3.nest().key(function(d){return d.fuerza}).sortKeys(d3.ascending).map(data, d3.map);
        
        canShowNew = verifyData(totales);
        if(!canShowNew){
            d3.select('#rad2').property('disabled', true);
            d3.select('label[for=rad2]').classed('off_new',true)
        }

        otros = totales[totales.length-1];
        if(location.hash.substr(1).split('_')[3] != "1"){
            orderAct = totales.slice(0,-1);
            orderAct.sort(function(a,b){return b.actual-a.actual});
            orderAct.push(otros);
            showActual(orderAct);
        } else {
            orderNue = totales.slice(0,-1);
            orderNue.sort(function(a,b){return b.total-a.total});
            orderNue.push(otros);
            showNueva(orderNue);
        }
    });

    d3.select('#votos').text(info['votos']);
    d3.select('#mesas').text(info['mesas']);
}

function verifyData(arr){
    ren=0;obt=0;
    for(i in arr){
        ren+=arr[i].renuevan;
        obt+=arr[i].obtuvieron;
    }
    return (ren == obt) ? true : false;
}

function changeCam(str){
    if(str == "nueva"){
        if(typeof orderNue == "undefined"){
            orderNue = totales.slice(0,-1);
            orderNue.sort(function(a,b){return b.total-a.total});
            orderNue.push(otros);
        }
        showNueva(orderNue);
    } else {
        if(typeof orderAct == "undefined"){
            orderAct = totales.slice(0,-1);
            orderAct.sort(function(a,b){return b.actual-a.actual});
            orderAct.push(otros);
        }
        showActual(orderAct);
    }
}

function getCamaraActual(order){
    dataBancas = [];
    for(i in order) {
        arr = dataCamara.get(order[i].fuerza);
        for(i in arr) {
            if(arr[i].ambito != "ARG"){
                for(var j = 0; arr[i].actual>j; j++ ) {
                    dataBancas.push(arr[i]);
                }
            }
        }
    }

    bancas = svg.selectAll("g").data(dataBancas).sort(d3.ascending).enter().append("circle")
            .attr("class", function(d,i) {
                arrClass = ["banca", "b"+i, "col" + (i%cols), "fp_" + mapClass[d.fuerza], "amb_" + d.ambito];
                return arrClass.join(' ');
            })
            .attr("cx", function(d,i) {
                var col = i%cols;
                if(i == 256){col = cols-1;}
                return (-(width/2-60)+(col*espaciado));
            })
            .attr("cy", 0)
            .attr("r", function(d,i) {
                var col = i%cols;
                if(i == 256){col = cols-1;}
                return circleradio - (cicleVariation * col) ;
            })
            .attr("transform",
            function (d,i) {
                return "rotate(" + (Math.floor(i/cols)+cicleVariation) * (arcGradient/filas) +")";
            });

    bancas_renuevan = svg.selectAll("g").data(dataBancas).sort(d3.ascending).enter().append("circle")
        .attr("class", function(d,i) {
            arrClass = ["renueva", "r"+i, "col" + (i%cols), "fp_" + mapClass[d.fuerza], "amb_" + d.ambito];
            return arrClass.join(' ');
        })
        .attr("cx", function(d,i) {
            var col = i%cols;
            if(i == 256){col = cols-1;}
            return (-(width/2-60)+(col*espaciado));
        })
        .attr("cy", 0)
        .attr("r", function(d,i) {
            var col = i%cols;
            if(i == 256){col = cols-1;}
            return circleradio - (cicleVariation * col) + 2 ;
        })
        .attr("transform",
        function (d,i) {
            return "rotate(" + (Math.floor(i/cols)+cicleVariation) * (arcGradient/filas) +")";
        });

    getBancasRenovadas("ARG",bancas_renuevan);

    printHemiciclo(order,"camaras");
}

function showActual(order){
    d3.select('#rad1').property('checked', true);
    if(d3.selectAll('#camaras circle')[0].length == 0){
        getCamaraActual(order);
    }
    d3.select('#camara_nueva').classed('active',false);
    d3.select('#camaras').classed('active',true);
    if(!d3.selectAll('.fuerzas.actual')[0].length){
        d3.select('#camara-data').append('div').attr('class','fuerzas actual active')
        for(i in order){
            dataForce = d3.select('.fuerzas.actual').append('div').attr('class','tot_fuerza')
            dataForce.append('div').attr('class','fuerza').html(truncateNameForce(order[i].fuerza)).append('div').attr('class','bar fp_'+mapClass[order[i].fuerza]);

            var act = dataForce.append('div').attr('class','data')
            act.append('div').attr('class','text').html("Bancas Actuales")
            act.append('div').attr('class','num').html(order[i].actual)

            var ren = dataForce.append('div').attr('class','ren_dif color_'+mapClass[order[i].fuerza])
            ren.append('div').attr('class','text').html("Renuevan")
            ren.append('div').attr('class','num').html(order[i].renuevan)
        }
        if(typeof mymap.fuerzaTooltip != "undefined"){mymap.fuerzaTooltip();}
    }
    d3.select('.fuerzas.nueva').classed('active',false);
    d3.select('.fuerzas.actual').classed('active',true);
    d3.selectAll('.quo.bancas-totales').classed('none',false);
}

function getCamaraNueva(order){
    dataBancas = [];
    for(i in order) {
        arr = dataCamara.get(order[i].fuerza);
        for(i in arr) {
            if(arr[i].ambito != "ARG"){
                for(var j = 0; arr[i].total>j; j++ ) {
                    dataBancas.push(arr[i]);
                }
            }
        }
    }

    bancas_nuevas = svg2.selectAll("g").data(dataBancas).sort(d3.ascending).enter().append("circle")
        .attr("class", function(d,i) {
            arrClass = ["banca", "b"+i, "col" + (i%cols), "fp_" + mapClass[d.fuerza], "amb_" + d.ambito];
            return arrClass.join(' ');
        })
        .attr("cx", function(d,i) {
            var col = i%cols;
            if(i == 256){col = cols-1;}
            return (-(width/2-60)+(col*espaciado));
        })
        .attr("cy", 0)
        .attr("r", function(d,i) {
            var col = i%cols;
            if(i == 256){col = cols-1;}
            return circleradio - (cicleVariation * col);
        })
        .attr("transform",
        function (d,i) {
            return "rotate(" + (Math.floor(i/cols)+cicleVariation) * (arcGradient/filas) +")";
        });

    printHemiciclo(order,"camara_nueva");
}

function showNueva(order){

    if(!canShowNew){
        changeCam('actual');
        return false;
    }

    d3.select('#rad2').property('checked', true);
    if(d3.selectAll('#camara_nueva circle')[0].length == 0){
        getCamaraNueva(order);
    }
    d3.select('#camaras').classed('active',false);
    d3.select('#camara_nueva').classed('active',true);
    if(!d3.selectAll('.fuerzas.nueva')[0].length){
        d3.select('#camara-data').append('div').attr('class','fuerzas nueva')
        for(i in order){
            var lines = {
                "TenÃ­an": order[i].actual,
                "Renovaban": order[i].renuevan,
                "Obtuvieron": order[i].obtuvieron,
                "Diferencia": getFormatDiff(order[i].obtuvieron-order[i].renuevan)
            };
            var data = d3.select('.fuerzas.nueva').append('div').attr('class','tot_fuerza')
            data.append('div').attr('class','fuerza').html(truncateNameForce(order[i].fuerza)).append('div').attr('class','bar fp_'+mapClass[order[i].fuerza])

            for(j in lines){
                if(j == "Diferencia"){
                    var act = data.append('div')
                    .attr('class','data color_'+mapClass[order[i].fuerza]);
                } else {
                    var act = data.append('div')
                        .attr('class','data')
                }
                act.append('div')
                    .attr('class','text')
                    .html(j)
                act.append('div')
                    .attr('class','num')
                    .html(lines[j])
            }
        }
        if(typeof mymap.fuerzaTooltip != "undefined"){mymap.fuerzaTooltip();}
    }
    d3.select('.fuerzas.actual').classed('active',false);
    d3.select('.fuerzas.nueva').classed('active',true);
    d3.selectAll('.quo.bancas-totales').classed('none',true);
}

function printHemiciclo(order,targetId){
    hemiciclo = d3.select("svg#"+targetId)
        .append("g")
        .attr("class","hemiciclo")
        .attr("transform", "translate("+((width/2)-17)+","+(height-20)+")");

    toGrad = Math.PI/180;
    gradientCorrection = -90;
    start=gradientCorrection*toGrad;
    limit=90*toGrad;

    for(i in order){
        chairs = d3.selectAll('circle.banca.fp_'+mapClass[order[i].fuerza])[0];
        lastChair = chairs[chairs.length-1].className.baseVal;
        idBanca = lastChair.match(/b\d+/i)[0].split("b")[1];
        bancaPos = lastChair.match(/col\d/i)[0].split("col")[1];
        mainChair = idBanca-bancaPos;
        chairIdGrads = (parseInt(d3.select('circle.banca.b'+mainChair).attr('transform').match(/\d+.\d+/i)[0])+gradientCorrection);

        if(bancaPos != cols-1){
            if(idBanca != totalBancas){
                f="";cf=0;
                for (j=0;j<cols;j++) {
                    df = d3.select('circle.banca.b'+(mainChair+j)).attr('class').split('fp_')[1].split(" ")[0];
                    if(df != f){f= df; cf++;}
                };
                gradient = (chairIdGrads)*toGrad;
            } else{
                gradient = (chairIdGrads>90) ? 90*toGrad : chairIdGrads*toGrad;
            }
        } else {
            if(mainChair+cols<=totalBancas){
                nextChairIdGrads = (parseInt(d3.select('circle.banca.b'+(mainChair+cols)).attr('transform').match(/\d+.\d+/i)[0])+gradientCorrection);
                gradient = (chairIdGrads+((nextChairIdGrads-chairIdGrads)/2))*toGrad;
            } else {
                gradient = (chairIdGrads>90) ? 90*toGrad : chairIdGrads*toGrad;
            }
        }

        if(start == gradient){
            gradient = (chairIdGrads+3)*toGrad;
        }

        hemiciclo.append('g')
            .attr('class','porciones '+mapClass[order[i].fuerza])
            .append('path')
            .datum({startAngle: start,endAngle: gradient})
            .attr("d", arc)
            .attr("class", function(d){
                return "fp_"+mapClass[order[i].fuerza];
            })

        hemiG = hemiciclo.select('g.porciones.'+mapClass[order[i].fuerza]);
        hemiG.append('path')
            .datum({startAngle: start,endAngle: gradient})
            .attr("id" , "path"+i)
            .attr("opacity", 0)
            .attr("d", arcNum);

        datos=[{"data": {"fuerza" : order[i].fuerza}}];

        if(targetId != "camara_nueva"){
            hemiG.append("text").style({'font-size': 20,'font-weight': "bold"})
                .attr("text-anchor", "end")
                .attr("class", "f_"+mapClass[order[i].fuerza]) //agrego id a los textos para obtener su posicion
                .data(datos)
                .append("textPath")
                .attr("xlink:href","#path"+i)
                .attr("startOffset", "27.5%")
                .append("tspan")
                .text(order[i].actual);
        } else {
            hemiG.append("text").style({'font-size': 20,'font-weight': "bold"})
                .attr("text-anchor", "end")
                .attr("class", "f_"+mapClass[order[i].fuerza]) //agrego id a los textos para obtener su posicion
                .data(datos)
                .append("textPath")
                .attr("xlink:href","#path"+i)
                .attr("startOffset", "27.5%")
                .append("tspan")
                .text(order[i].actual-order[i].renuevan+order[i].obtuvieron);
        }
        start = gradient;
    }
}

function getBancasRenovadas(ambito, bn_ren){
    if(ambito == "undefined"){
        ambito = "ARG";
    }
    arr = total_ambitos.get(ambito);
    for(i in arr) {
        if(ambito == "ARG"){
            bancasARenovar = bn_ren.filter('.fp_'+mapClass[arr[i].fuerza])[0];
        } else {
            bancasARenovar = bn_ren.filter('.amb_'+ambito+'.fp_'+mapClass[arr[i].fuerza])[0];
        }
        for (var j = 0; j < arr[i].renuevan; j++) {
            bancasARenovar[j].className.baseVal += " rb"
        }
    }
}

function getFormatDiff(theNumber){
    if(theNumber >= 0){
        return "+"+("0" + theNumber).slice(-2);
    }else{
        return "-"+("0" + Math.abs(theNumber)).slice(-2);
    }
}

function change(ambito,forces) {
    if(d3.select('#rad1').property('checked')){
        bancas.attr('opacity','0.1');
        bancas_renuevan.classed('rb', false);
        bancas.filter('.amb_'+ambito).attr('opacity','1');
        getBancasRenovadas(ambito, bancas_renuevan);
        for (i in forces) {
            countBancas = bancas.filter('.amb_'+ambito+'.fp_'+mapClass[forces[i].fuerza])[0].length;
            d3.select('text.f_'+mapClass[forces[i].fuerza]+' textpath')
                .text(countBancas);
        }
    } else {
        bancas_nuevas.attr('opacity','0.1');
        bancas_nuevas.filter('.amb_'+ambito).attr('opacity','1');
        for (i in forces) {
            countBancas = bancas_nuevas.filter('.amb_'+ambito+'.fp_'+mapClass[forces[i].fuerza])[0].length;
            d3.select('#camara_nueva text.f_'+mapClass[forces[i].fuerza]+' textpath')
                .text(countBancas);
        }
    }
}

function camReset(forces){
    if(d3.select('#rad1').property('checked')){
        bancas.attr('opacity','1');
        bancas_renuevan.classed('rb', false);
        getBancasRenovadas("ARG", bancas_renuevan);
        for (i in forces) {
            d3.select('text.f_'+mapClass[forces[i].fuerza]+' textpath')
                .text(forces[i].actual);
        }
    } else {
        bancas_nuevas.attr('opacity','1');
        for (i in forces) {
            d3.select('#camara_nueva text.f_'+mapClass[forces[i].fuerza]+' textpath')
                .text(forces[i].actual-forces[i].renuevan+forces[i].obtuvieron);
        }
    }
}

function truncateNameForce(str){
    if(typeof truncate[str] == 'undefined'){return str;}
    return truncate[str];
}