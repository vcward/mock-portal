d3.json('http://localhost:8080/v1/series/observations?id=1', function(data) {
  var level = data.transformationResults[0].observations;
  var perc = data.transformationResults[1].observations;
  var levelValues = [];
  var percValues = [];
  var levelData = [];
  var percData = [];
  var dates = [];

  for (i = 0; i < level.length; i++) {
    levelValues.push(+level[i].value);
    dates.push(level[i].date);
    percValues.push(+perc[i].value);
  }

  // Use [date, value] pairs for Highstock charts
  for (i = 0; i < level.length; i++) {
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

  /**
   * Create the data table
   */
  Highcharts.drawTable = function() {

    // user options
    var tableTop = 40,
      colWidth = 150,
      tableLeft = 20,
      rowHeight = 20,
      cellPadding = 2.5,
      valueDecimals = 3;

    // internal variables
    var chart = this,
      series = chart.series,
      renderer = chart.renderer,
      cellLeft = tableLeft;

    // draw category labels
    /* $.each(chart.xAxis[0].categories, function(i, name) {
      renderer.text(
          name,
          cellLeft + cellPadding,
          tableTop + (i + 2) * rowHeight - cellPadding
        )
        .css({
          fontWeight: 'bold'
        })
        .add();
    }); */

    $.each(series, function(i, serie) {
      //console.log(serie);
      renderer.text(
          serie.name,
          cellLeft + cellPadding,
          tableTop + (i + 2) * rowHeight - cellPadding
        )
        .css({
          fontWeight: 'bold'
        })
        .add();

      $.each(chart.series[0].points, function(row, value) {
        console.log(value.y);
        renderer.text(
            value.y,
            cellLeft - cellPadding + (row + 2) * colWidth,
            tableTop + (i + 2) * rowHeight - cellPadding
          )
          .attr({
            align: 'right'
          })
          .add();
      });
    });


    $.each(chart.series[0].points, function(i, point) {
      cellLeft += colWidth;
      //console.log(chart.series[0].points);
      renderer.text(
          Highcharts.dateFormat('%Y-%m-%d', point.x),
          cellLeft - cellPadding + colWidth,
          tableTop + rowHeight - cellPadding
        )
        .css({
          fontWeight: 'bold'
        })
        .attr({
          align: 'right'
        })
        .add();

      /* $.each(point, function(row, value) {
        console.log(point.y);
        renderer.text(
            point.y,
            cellLeft + colWidth - cellPadding,
            tableTop + (i + 2) * rowHeight - cellPadding
          )
          .attr({
            align: 'right'
          })
          .add();
      }); */
    });

    /* $.each(series, function(i, serie) {
      cellLeft += colWidth;
      console.log(serie.data.x);

      // Apply the cell text
      renderer.text(
          dates[i],
          cellLeft - cellPadding + colWidth,
          tableTop + rowHeight - cellPadding
        )
        .attr({
          align: 'right'
        })
        .css({
          fontWeight: 'bold'
        })
        .add();

      $.each(serie.data, function(row, point) {

        // Apply the cell text
        renderer.text(
            Highcharts.numberFormat(point.y, valueDecimals),
            cellLeft + colWidth - cellPadding,
            tableTop + (row + 2) * rowHeight - cellPadding
          )
          .attr({
            align: 'right'
          })
          .add();

        // horizontal lines
        if (row == 0) {
          Highcharts.tableLine( // top
            renderer,
            tableLeft,
            tableTop + cellPadding,
            cellLeft + colWidth,
            tableTop + cellPadding
          );
          Highcharts.tableLine( // bottom
            renderer,
            tableLeft,
            tableTop + (serie.data.length + 1) * rowHeight + cellPadding,
            cellLeft + colWidth,
            tableTop + (serie.data.length + 1) * rowHeight + cellPadding
          );
        }
        // horizontal line
        Highcharts.tableLine(
          renderer,
          tableLeft,
          tableTop + row * rowHeight + rowHeight + cellPadding,
          cellLeft + colWidth,
          tableTop + row * rowHeight + rowHeight + cellPadding
        );

      });

      // vertical lines
      if (i == 0) { // left table border
        Highcharts.tableLine(
          renderer,
          tableLeft,
          tableTop + cellPadding,
          tableLeft,
          tableTop + (serie.data.length + 1) * rowHeight + cellPadding
        );
      }

      Highcharts.tableLine(
        renderer,
        cellLeft,
        tableTop + cellPadding,
        cellLeft,
        tableTop + (serie.data.length + 1) * rowHeight + cellPadding
      );

      if (i == series.length - 1) { // right table border

        Highcharts.tableLine(
          renderer,
          cellLeft + colWidth,
          tableTop + cellPadding,
          cellLeft + colWidth,
          tableTop + (serie.data.length + 1) * rowHeight + cellPadding
        );
      }

   }); */


  };

  /**
   * Draw a single line in the table
   */
  Highcharts.tableLine = function(renderer, x1, y1, x2, y2) {
    renderer.path(['M', x1, y1, 'L', x2, y2])
      .attr({
        'stroke': 'silver',
        'stroke-width': 1
      })
      .add();
  }

  /**
   * Create the chart
   */
  new Highcharts.StockChart({

    chart: {
      renderTo: 'table',
      events: {
        load: Highcharts.drawTable
      },
      zoomType: 'x',
      borderWidth: 1
    },
    rangeSelector: {
      selected: 1
    },
    title: {
      text: ''
    },

    xAxis: {
      visible: false,
      events: {
        afterSetExtremes: function(e) {
          console.log(Highcharts.dateFormat(null, e.min));
        }
      }
      //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
      visible: false
    },

    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        visible: false
      }
    },

    series: [{
      name: 'Income Summary',
      data: levelData.reverse()
    }]
  });
});



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
          return {
            column: column,
            value: row[column]
          };
        });
      })
      .enter()
      .append('td')
      .text(function(d) {
        return d.value;
      });

    return table;
  }

  drawTable(level, ['Series', 'Source', dates, 'Add to Download']);
}); */
