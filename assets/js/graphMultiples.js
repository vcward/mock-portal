// Load Categories, series, and observation data

queue()
   .defer(d3.json, 'http://localhost:8080/v1/category')
   .defer(d3.json, 'http://localhost:8080/v1/category/series?id=1&freq=A&geo=15000')
   .defer(d3.json, 'http://localhost:8080/v1/series/observations?id=1')
   .await(seriesMultiples);

function seriesMultiples(error, cats, series, obs) {
   var categories = cats.categories;

   var dataMap = categories.reduce(function(map, value) {
      map[value.id] = value;
      return map;
   }, {});

   var categoryTree = [];
   categories.forEach(function(value) {
      var parent = dataMap[value.parent];
      if(parent) {
         (parent.children || (parent.children = []))
            .push(value);
      } else {
         categoryTree.push(value);
      }
   });

   console.log(categoryTree);

   var series = series.series;

   // Annual Series
   var seriesA = function(data) {
      for(i = 0; i < data.length; i++) {
         if(data[i].frequencyShort == 'A') {
            return data[i];
         } else {
            return;
         }
      }
   }

   var level = obs.transformationResults[0].observations;
   var perc = obs.transformationResults[1].observations;
   var levelValues = [];
   var percValues = [];
   var dates = [];

   for(i = 0; i < level.length; i++) {
      levelValues.push(+level[i].value);
      dates.push(level[i].date);
      percValues.push(+perc[i].value);
   }

   function seriesMultiples(data) {
      var newRow = d3.select('.container-fluid')
         .selectAll('div')
         .data(data)
         .enter()
         .append('div')
         .classed('row', true);

      newRow.append('h2')
         .html(function(d) {
            return d.name;
         });

      var subcat = newRow.selectAll('h3')
         .data(function(d) {
            return d.children;
         })
         .enter().append('h3')
         .text(function(d) {
            return d.name;
         });

      var seriesContainer = newRow.selectAll('div')
         .data([seriesA(series)])
         .enter()
         .append('div')
         .attr('id', function(d) {
            return 'series_' + d.id;
         })
         .classed('col-lg-3', true);
   }

   seriesMultiples(categoryTree);
   console.log(seriesA(series))
   console.log(obs)

   new Highcharts.chart({
      chart: {
         renderTo: 'series_E_NF@HI.A',
         height: 250
      },
      title: {
         text: ''
         //text: 'Total Visitor Arrivals'
      },
      legend: {
         enabled: false
      },
      credits: {
         enabled: false
      },
      tooltip: {
         enabled: false
      },
      xAxis: [{
         categories: dates.reverse(),
         labels: {
            enabled: false
         },
         lineWidth: 0,
         tickLength: 0,
      }],
      yAxis: [{
         labels: {
            enabled: false
            //format: '{value}'
         },
         title: {
            text: ''
            //text: 'Rate of Change (%)'
         },
         gridLineColor: 'transparent'
      }, {
         title: {
            text: ''
            //text: 'Total Visitor Arrivals'
         },
         labels: {
            enabled: false
            //format: '{value}'
         },
         gridLineColor: 'transparent',
         opposite: true
      }],
      series: [{
         name: 'Rate of Change (%)',
         type: 'column',
         data: [1.5, 2, null, 2.3]
         //data: percValues.reverse()
      }, {
         name: 'Total Visitor Arrivals',
         type: 'line',
         yAxis: 1,
         data: [685.30, 705.10, 693.65, 713.45]
      }]
   });
}

/* d3.json('http://localhost:8080/v1/category', function(data) {
   var categories = data.categories;

   var dataMap = categories.reduce(function(map, value) {
      map[value.id] = value;
      return map;
   }, {});

   var categoryTree = [];
   categories.forEach(function(value) {
      var parent = dataMap[value.parent];
      if(parent) {
         (parent.children || (parent.children = []))
            .push(value);
      } else {
         categoryTree.push(value);
      }
   });

   console.log(categoryTree);

   function seriesMultiples(data) {
      var newRow = d3.select('.container-fluid')
         .selectAll('div')
         .data(data)
         .enter()
         .append('div')
         .classed('row', true);

      newRow.append('h2')
         .html(function(d) {
            return d.name;
         });

      var subcat = newRow.selectAll('h3')
         .data(function(d) {
            return d.children;
         })
         .enter().append('h3')
         .text(function(d) {
            return d.name;
         });
   }

   seriesMultiples(categoryTree);
}); */
