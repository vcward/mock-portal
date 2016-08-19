d3.json('http://localhost:8080/v1/series/observations?id=1', function(data) {
   var level = data.transformationResults[0].observations;
   var perc = data.transformationResults[1].observations;
   var levelValues = [];
   var percValues = [];
   var dates = [];

   for(i = 0; i < level.length; i++) {
      levelValues.push(+level[i].value);
      dates.push(level[i].date);
      percValues.push(+perc[i].value);
   }

   /* console.log('Level data: ');
   console.log(level);
   console.log('Percent change data: ');
   console.log(perc);
   console.log('Level values: ');
   console.log(levelValues);
   console.log('Percent Values: ');
   console.log(percValues);
   console.log('Observation dates: ');
   console.log(dates); */

   new Highcharts.chart({
      chart: {
         renderTo: lineBar
      },
      title: {
         text: 'Total Visitor Arrivals'
      },
      xAxis: {
         categories: dates.reverse()
      },
      yAxis: [{
         Labels: {
            format: '{value}'
         },
         title: {
            text: 'Rate of Change (%)'
         }
      }, {
         title: {
            text: 'Total Visitor Arrivals'
         },
         labels: {
            format: '{value}'
         },
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
});
