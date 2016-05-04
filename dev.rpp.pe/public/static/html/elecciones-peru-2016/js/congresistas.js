var color = {
    keiko: {a:'#ff6f00', m:'#ff8f39', b:'#ffa764'}, //keiko
    ppk: {a:'#35bcff', m:'#5fcbff', b:'#8dd9fe'}, //ppk
    barnechea: {a:'#f0ca4a', m:'#ffde71', b:'#ffe89b'}, //barnechea
    alan: {a:'#c95c5c', m:'#f29595', b:'#ffc4c4'}, //alan
    toledo: {a:'#64a664', m:'#92c592', b:'#c0dec0'}, //toledo
    mendoza: {a:'#9787b7', m:'#c0b6d6', b:'#e5e0ee'} //mendoza
};


var chart = $("#chart"),
    aspect = chart.width() / chart.height(),
    container = chart.parent();

/*$(window).on("resize", function() {
    var targetWidth = container.width();
    console.log(targetWidth, Math.round(targetWidth / aspect), 'width');
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize");*/


var div = d3.select("body").append("div")   
    .style("position", "absolute")
    .style("width", "115px")
    .style("height", "18px")
    .style("background", "lightsteelblue")
    .style("border-radius","4px")
    .style("opacity", 0);
    
var w = 700,                        //width
    h = 600,                            //height
    r = 350,                     //radius
    ir = 20,
    pi = Math.PI;
    //color = d3.scale.category20c();

    data = [{"slug": "keiko", "partido":"Fuerza Popular", "votos":36}, 
            {"slug": "ppk", "partido":"Peruanos por el cambio", "votos":28}, 
            {"slug": "barnechea", "partido":"Frente amplio", "votos":16}, 
            {"slug": "alan", "partido":"Perú posible", "votos":9.23}, 
            {"slug": "toledo", "partido":"Partido acción popular", "votos":6.92},
            {"slug": "mendoza", "partido":"Alianza popular", "votos":3.07}];
    
    var vis = d3.select("svg") 
        .data([data])          
            /*.attr("width", w)  
            .attr("height", h)*/
            .append("svg:g")       
            .attr("transform", "translate(" + r + "," + r + ")");

    d3.select(window).on("resize", function() {
        var targetWidth = container.width();
        console.log(targetWidth, targetWidth / aspect);
        chart.attr("width", targetWidth);
        chart.attr("height", targetWidth / aspect);
        chart.attr("transform", "translate(" + targetWidth/2 + "," + targetWidth/2 + ")");

        if(arc){
            console.log(targetWidth/2);
            d3.svg.arc()
                .outerRadius(targetWidth/2)
                .innerRadius(ir);
        }

      });
            
    var arc = d3.svg.arc()              
        .outerRadius(r)
		.innerRadius(ir);	
 
    var pie = d3.layout.pie()           
        .value(function(d) { return d.votos; })
        .startAngle(-90 * (pi/180))
        .endAngle(90 * (pi/180));
 
    var arcs = vis.selectAll("g.slice")     
        .data(pie)                          
        .enter()                            
            .append("svg:g")                
                .attr("class", "slice");    
 
        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color[d.data.slug]['m']; } ) 
                .attr("d", arc)
        
        .on("mousemove", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html("Votos (%): " + d.value)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 38) + "px");
            })                
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
        
        
 
        arcs.append("svg:text")                                     
                .attr("transform", function(d) {                    
                
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        
            })
            .attr("text-anchor", "middle")                          
            .text(function(d, i) { return data[i].partido; });        
    

