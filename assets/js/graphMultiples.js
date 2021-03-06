// Load Categories, series, and observation data

//var seriesId = [3, 4]

function get_default_series(id) {
  //var catId = 3;
  queue()
    .defer(d3.json, 'http://localhost:8080/v1/category')
    .defer(d3.json, 'http://localhost:8080/v1/geo')
    .defer(d3.json, 'http://localhost:8080/v1/category/series?id=' + id)
    .defer(d3.json, 'http://localhost:8080/v1/series/observations?id=' + id)
    .await(seriesMultiples);
}

// Default landing page view, Load data from summary category
get_default_series(1);

/* for (i = 0; i < seriesId.length; i++) {
  get_series(seriesId[i]);
}*/

function drawSeriesContainer(catData, seriesData, geo) {

  // Create tabs for each top-level category
  var newTabs = d3.select('#landingTabs')
    .classed('tabs', true);

  newTabs.selectAll('li')
    .data(catData)
    .enter()
    .append('li')
    .append('a')
    /* .attr('href', function(d) {
      return '#' + d.id;
   }) */
    .attr('id', function(d) {
      return d.id;
   })
    .text(function(d) {
      return d.name;
    })
    .on('click', loadNewSeries);

  function loadNewSeries(d) {
     series_id = d3.select(this).attr('id');
     queue()
     .defer(d3.json, 'http://localhost:8080/v1/category')
     .defer(d3.json, 'http://localhost:8080/v1/geo')
     .defer(d3.json, 'http://localhost:8080/v1/category/series?id=' + series_id)
     .defer(d3.json, 'http://localhost:8080/v1/series/observations?id=' + series_id)
     .await(seriesMultiples);
  }

  // Create series chart constainers
  var newChart = d3.select('#graphsContainer')
    .selectAll('div')
    .data(seriesData)
    .enter()
    .append('div')
    .classed('col-lg-3', true)
    .attr('id', function(d) {
      return 'series_' + d.id;
    })
    .classed('col-lg-3', true);
}

function seriesMultiples(error, cats, geo, series, obs) {
  var categories = cats.categories;

  // Create nested json of categories & subcategories
  var dataMap = categories.reduce(function(map, value) {
    map[value.id] = value;
    return map;
  }, {});

  var categoryTree = [];
  categories.forEach(function(value) {
    var parent = dataMap[value.parent];
    if (parent) {
      (parent.children || (parent.children = []))
      .push(value);
    } else {
      categoryTree.push(value);
    }
  });

  // Available geographies
  var geoID = [];
  for (i = 0; i < geo.geographies.length; i++) {
    geoID.push(geo.geographies[i].name);
  }

  var series = series.series;
  var seriesA = []
  var seriesM = []

  // Select series with annual frequency
  var findAnnual = function(data) {
    for (i = 0; i < data.length; i++) {
      if (data[i].frequencyShort == 'A') {
        seriesA.push(data[i]);
      }
    }
  }
  findAnnual(series);

  // Select series with monthly frequency
  var findMonthly = function(data) {
    for (i = 0; i < data.length; i++) {
      if (data[i].frequencyShort == 'M') {
        seriesM.push(data[i]);
      }
    }
  }
  findMonthly(series);

  var level = obs.transformationResults[0].observations;
  var perc = obs.transformationResults[1].observations;
  var levelValues = [];
  var percValues = [];
  var dates = [];

  for (i = 0; i < level.length; i++) {
    levelValues.push(+level[i].value);
    dates.push(level[i].date);
    percValues.push(+perc[i].value);
  }
  console.log(seriesA);
  drawSeriesContainer(categoryTree, seriesA, geoID);

  // Reusable highcharts
  /*  var options = {
      chart: {
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
    };

    var seriesID = ['series_E_NF@HI.A', 'series_VIS@HON.A'];

    function createChart(dataSeries) {
      for (i = 0; i < seriesID.length; i++) {
        options.chart.renderTo = seriesID[i];
      }
      //options.chart.renderTo = 'graphsContainer'
      chart = new Highcharts.Chart(options);
      //chart.redraw();
    }
    createChart(seriesA)


  } */
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
