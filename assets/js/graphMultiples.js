d3.json('http://localhost:8080/v1/category', function(data) {
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
         .append('div')
         .classed('row', true);
      var category = newRow.selectAll('h2')
         .data(categoryTree)
         .enter()
         .append('h2')
         .text(function(d) {
            return d.name
         });

      var subcategory = newRow.selectAll('h3')
         .data(categoryTree)
         .enter()
         .append('h3');


   }

   seriesMultiples(categoryTree);
});
