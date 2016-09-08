d3.json('http://localhost:8080/v1/series/observations?id=1', function(data) {
   var level = data.transformationResults[0].observations;
   var perc = data.transformationResults[1].observations;
   var levelData = [];
   var percData = [];
   var dates = [];

   /* for(i = 0; i < level.length; i++) {
      levelValues.push(+level[i].value);
      dates.push(Date.parse(level[i].date));
      percValues.push(+perc[i].value);
   } */

   // Use [date, value] pairs for Highstock charts
   for(i = 0; i < level.length; i++) {
      levelData.push([Date.parse(level[i].date), +level[i].value])
      percData.push([Date.parse(level[i].date), +perc[i].value])
   }

   /* console.log('Level data: ');
   console.log(level);
   console.log('Percent change data: ');
   console.log(perc);
   console.log('Level values: ');
   console.log(levelValues);
   console.log('Percent Values: ');
   console.log(percValues); */
   //console.log('Observation dates: ');
   console.log(levelData);

   new Highcharts.StockChart({
      chart: {
         renderTo: lineBar,
         zoomType: 'x'
      },
      rangeSelector: {
         selected: 1
      },
      title: {
         text: 'Total Visitor Arrivals'
      },
      yAxis: [{
         labels: {
            format: '{value}'
         },
         title: {
            text: 'Rate of Change (%)'
         },
         opposite: false
      }, {
         title: {
            text: 'Total Visitor Arrivals'
         },
         labels: {
            format: '{value}'
         }
      }],
      series: [{
         name: 'Rate of Change (%)',
         type: 'column',
         //data: [1.5, 2, null, 2.3]
         data: percData.reverse()
      }, {
         name: 'Total Visitor Arrivals',
         type: 'line',
         yAxis: 1,
         data: levelData.reverse()
         //data: [685.30, 705.10, 693.65, 713.45]
      }]
   });
});
