function autoDraw(csv) {

//parsing csv
   var results = Papa.parse(csv,
   {download: true,
   complete: function(results) {

    //extracting groups + questions from .csv
    var array = results.data.slice(1,-1)
    var groups = array.map(function(value,index) { return value[0]; });
    var questions = array.map(function(value,index) { return value[1]; });
    pairs = [], i = 0;

    //extracting all unique group;question pairs
    while ( groups[++i] ) {
      pairs.push( [ groups[i], questions[i] ] );}
    var d = {};
    var output = [];
    for( var i = 0; i < pairs.length; i++ ) {
      var item = pairs[i];
      var rep = item.toString();
      if (!d[rep]) {
        d[rep] = true;
      output.push(item);
  }};

    //formatting output
    var groups_set = output.map(function(value,index) { return value[0]; });
    var questions_set = output.map(function(value,index) { return value[1]; });
    console.log(groups_set, questions_set)

    //passing all unique group;question pairs to charting func
    groups_set.forEach((group, index) => {
    const question = questions_set[index];
    drawGraphic(group,question,'Total')});
    }});
}
