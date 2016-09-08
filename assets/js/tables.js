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

   console.log('Level data: ');
   console.log(level);
   /* console.log('Percent change data: ');
   console.log(perc);
   console.log('Level values: ');
   console.log(levelValues);
   console.log('Percent Values: ');
   console.log(percValues);
   console.log('Observation dates: ');
   console.log(dates); */

   /* function drawTable(data, columns) {
      var table = d3.select('#table')
         .append('table');
      var thead = table.append('thead');
      var tbody = table.append('tbody');

      thead.append('tr')
         .selectAll('tr')
         .data(columns).enter()
         .append('th')
         .text(function(column) {
            return column;
         });

      var rows = tbody.selectAll('tr')
         .data(data)
         .enter()
         .append('tr')

      var cells = rows.selectAll('td')
         .data(function(row) {
            return columns.map(function(column) {
               return {column: column, value: row[column]};
            });
         })
         .enter()
         .append('td')
         .text(function(d) {
            return d.value;
         });

      return table;
   }

   drawTable(level, ['indicator', 'date', 'value', 'source']); */
});
