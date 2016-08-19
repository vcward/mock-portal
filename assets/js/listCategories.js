d3.json('http://localhost:8080/v1/category', function(data) {
   var categories = data.categories;

   var dataMap = categories.reduce(function(map, value) {
      map[value.id] = value;
      return map;
   }, {});

   console.log(categories);

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

   var list = d3.select('#sidebar-list');
   list.selectAll('li')
      .data(categoryTree)
      .enter()
      .append('li')
      .text(function(d) { return d.name; })
      .on('click', expand);

   function expand(d) {
      d3.select(this)
         .on('click', collapse)
         .append('ul')
         .selectAll('li')
         .data(d.children)
         .enter().append('li')
         .text(function(d) { return d.name; });
   };

   function collapse(d) {
      d3.select(this)
         .on('click', expand)
         .selectAll('li')
         .remove()
   };
});
