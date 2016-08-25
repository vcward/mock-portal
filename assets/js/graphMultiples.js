// Load Categories, series, and observation data

var seriesId = [3, 4]

function get_series(id) {
   var catId = 3;
   queue()
      .defer(d3.json, 'http://localhost:8080/v1/category')
      .defer(d3.json, 'http://localhost:8080/v1/category/series?id=' + id)
      .defer(d3.json, 'http://localhost:8080/v1/series/observations?id=' + id)
      .await(seriesMultiples);
}

for(i = 0; i < seriesId.length; i++) {
   get_series(seriesId[i]);
}

function drawSeriesContainers(catData, seriesData) {

   // Create new row for each category
   var newRow = d3.select('.container-fluid')
      .selectAll('div')
      .data(catData)
      .enter()
      .append('div')
      .classed('row', true);

   // Add heading for categories
   newRow.append('h2')
      .text(function(d) {
         return d.name;
      });

   // Add heading for subcategories
   var subcat = newRow.selectAll('h3')
      .data(function(d) {
         return d.children;
      })
      .enter().append('h3')
      .append('a')
      .text(function(d) {
         return d.name;
      })
      .attr('id', function(d) {
         return 'subcat_' + d.id;
      })
      .attr('name', function(d) {
         return d.id;
      });

   var chartsContainer = d3.selectAll('.row > h3')
      .each(function(d) {
         // Add container div for series charts based on category
         var chartDiv = document.createElement('div');
         this.parentNode.insertBefore(chartDiv, this.nextSibling);
         d3.select(chartDiv)
            .classed('col-lg-12', true)
            .classed('chartContainer', true)
            .attr('id', 'subcat_' + d.id);
      });

   var seriesChart = d3.selectAll('.chartContainer')
      .selectAll('div')
      .data(seriesData)
      .enter()
      .append('div')
      .attr('id', function(d) {
         return 'series_' + d.id;
      })
      .classed('col-lg-3', true);
}

function seriesMultiples(error, cats, series, obs) {
   var categories = cats.categories;

   // Create nested json of categories & subcategories
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

   var series = series.series;
   var seriesA =[]

   // Select series with annual frequency
   var findAnnual = function(data) {
      for(i = 0; i < data.length; i++) {
         if(data[i].frequencyShort == 'A') {
            seriesA.push(data[i]);
         }
      }
   }
   findAnnual(series);

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

   drawSeriesContainers(categoryTree, seriesA);

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
         data: percValues.reverse()
      }, {
         name: 'Total Visitor Arrivals',
         type: 'line',
         yAxis: 1,
         data: levelValues.reverse()
      }]
   });

   new Highcharts.chart({
      chart: {
         renderTo: 'series_VIS@HON.A',
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
         categories: dates,
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
         data: percValues
      }, {
         name: 'Total Visitor Arrivals',
         type: 'line',
         yAxis: 1,
         data: levelValues
      }]
   });

}
