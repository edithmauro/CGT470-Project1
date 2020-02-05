

var tip = d3.tip().attr('class','d3-tip').html(function(d) {
  return "<strong>Name: </strong> <span class = 'details'> " 
    +d.properties.NAME+ "<br></span>"
    +"<strong>Data: </strong> <span class = 'details'> "
    +d.total+"%"; });
  
  var data = d3.map();
  var data2 = d3.map();
  var data3 = d3.map();
    
  
  var colorScheme = d3.schemeBlues[6];
  colorScheme.unshift("#eee")
  var colorScale = d3.scaleThreshold()
      .domain([40, 50, 60, 70, 80, 90])
      .range(colorScheme);

  var colorScheme2 = d3.schemePurples[6];
  colorScheme2.unshift("#eee")
  var colorScale2 = d3.scaleThreshold()
      .domain([0, 10, 20, 30, 40, 50])
      .range(colorScheme2);
  
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 900 - margin.left - margin.right,
              height = 1000 - margin.top - margin.bottom;
  
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
    
  svg.call(tip);
  
  d3.queue()
    .defer(d3.json,"indycounty.json")
    .defer(d3.csv,"CGT470Dataset.csv",function(d) { 
      data.set(d.County, +d.PercentHSDiplomasEarned)
      data2.set(d.County, +d.PercentCollegeDiplomasEarned)
      ; }) //row.description, d means role in this part cam
    .await(ready);
  
    function ready(error,countyMap){
      if (error) throw error;
  //console.log(countyMap);
      // NOTICE: Here we transfer topojson to geojson
      var indyState = topojson.feature(countyMap, {
            type: "GeometryCollection",
            geometries: countyMap.objects.indycounty.geometries
        });
  
  
      var projection = d3.geoMercator()
          .fitExtent([[250, 500], [650, 900]],indyState);
  
      var geoPath = d3.geoPath()
                      .projection(projection);
        console.log(indyState);
    
// BUTTON 1//
document.getElementById("button1").onclick = function() {
  svg.append("g")
 .attr("class", "countries")
 .selectAll("path")
 .data(indyState.features) 
 .enter().append("path")
 .attr("d", geoPath)
 .attr("stroke","black") 
 .attr("fill", function (d){
    d.total = data.get(d.properties.NAME) || 0;	//if button1 is clicked, use dataset1
  
    return colorScale(d.total);

   })
 .on('mouseover',function(d){
   originalColor = d3.select(this).style("fill")
   tip.show(d)
   d3.select(this)
    .style("fill","yellow")
  })
  
.on('mouseout',function(d){
   tip.hide(d)
   d3.select(this)
    .style("fill",originalColor)
});	  
}

//BUTTON 2//
document.getElementById("button2").onclick = function() {
  svg.append("g")
 .attr("class", "countries")
 .selectAll("path")
 .data(indyState.features) 
 .enter().append("path")
 .attr("d", geoPath)
 .attr("stroke","black") 
 .attr("fill", function (d){
    d.total = data2.get(d.properties.NAME) || 0;	//if button2 is clicked, use dataset2
  
    return colorScale2(d.total);

   })
 .on('mouseover',function(d){
   originalColor = d3.select(this).style("fill")
   tip.show(d)
   d3.select(this)
    .style("fill","yellow")
  })

  
.on('mouseout',function(d){
   tip.hide(d)
   d3.select(this)
    .style("fill",originalColor)
});
}

var originalColor;
    
   svg.append("g")
       .attr("class", "countries")
       .selectAll("path")
       .data(indyState.features)
       .enter().append("path")
   .attr("d", geoPath)
       .attr("stroke","black")
       .attr("fill", function (d){
  
               d.total = data.get(d.properties.NAME) || 0;
  
               return colorScale(d.total);
  
           })
     .on('mouseover', function(d){
    tip.show(d)
      
    originalColor = d3.select(this).style("fill")
      
    d3.select(this)
       .style("fill","yellow")
    })
     .on('mouseout', function(d){
     tip.hide(d)
     d3.select(this)
       .style("fill",originalColor)
    })
    ;};
/*Scatterplot*/
