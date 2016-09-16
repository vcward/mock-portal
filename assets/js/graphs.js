d3.json('http://localhost:8080/v1/series/observations?id=1', function(data) {
  var level = data.transformationResults[0].observations;
  var perc = data.transformationResults[1].observations;
  var levelData = [];
  var percData = [];
  var dates = [];
  var tableData = []

  /* for(i = 0; i < level.length; i++) {
     levelValues.push(+level[i].value);
     dates.push(Date.parse(level[i].date));
     percValues.push(+perc[i].value);
  } */

  // Use [date, value] pairs for Highstock charts
  for (i = 0; i < level.length; i++) {
    levelData.push([Date.parse(level[i].date), +level[i].value])
    percData.push([Date.parse(level[i].date), +perc[i].value])
    tableData.push({
      date: level[i].date,
      level: +level[i].value,
      perc: +perc[i].value
    });
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
  console.log(tableData);

  new Highcharts.StockChart({
    chart: {
      renderTo: lineBar,
      zoomType: 'x',
    },
    rangeSelector: {
      selected: 1,
      inputDateFormat: '%Y-01-01',
      inputEditDateFormat: '%Y-01-01'
    },
    title: {
      text: 'Total Visitor Arrivals'
    },
    xAxis: {
      events: {
        setExtremes: updateTable
      }
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

  function drawTable(data, columns) {
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
      .data(function(d) {
        return d3.values(d);
      })
      .enter()
      .append('td')
      .text(function(d) {
        return d;
      });

    return table;
  }

  drawTable(tableData, ['Date', 'Level', '%']);

  function updateTable(e) {
    if (e.trigger != undefined) {
      var minDate, maxDate, tableStart, tableEnd;

      // Get date range from chart selection
      minDate = Highcharts.dateFormat('%Y-01-01', e.min);
      maxDate = Highcharts.dateFormat('%Y-01-01', e.max);

      // Find selected dates in available data
      for (i = 0; i < tableData.length; i++) {
        for (var date in tableData[i]) {
          if (tableData[i].date === minDate) {
            tableStart = i;
          }
          if (tableData[i].date === maxDate) {
            tableEnd = i;
          }
        }
      };

      // Store new range of values, remove previous table, draw new table with new range of values
      newTableData = tableData.slice(tableEnd, tableStart + 1);
      d3.selectAll('table').remove();
      drawTable(newTableData, ['Date', 'Level', '%']);
    } else {
      return;
    }
  }
});
