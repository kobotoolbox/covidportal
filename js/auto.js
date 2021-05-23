//function autoDraw takes in a dataset (.csv) and an aggregation level ('Total','Aggregated') and dynamically produces a chart for each unique (Group,Question) pair present in the dataset
function autoDraw(csv,agg) 
{
   //parsing .csv with Papa Parse
   var results = Papa.parse(csv,
   {
      download: true,
      complete: function(results) 
      {
         //extracting all groups + questions from dataset
         var array = results.data.slice(1,-1)
         var groups = array.map(function(value,index) { return value[0]; });
         var questions = array.map(function(value,index) { return value[1]; });
         pairs = [], i = 0;
         
         //extracting all unique (Group,Question) pairs
         while ( groups[++i] ) 
         {
            pairs.push( [ groups[i], questions[i] ] );}
         var d = {};
         var output = [];
         for( var i = 0; i < pairs.length; i++ ) 
         {
            var item = pairs[i];
            var rep = item.toString();
            if (!d[rep]) 
            {
               d[rep] = true;
               output.push(item);
            }};
         
         //mapping all unique (Group,Question) pairs to sets
         var groups_set = output.map(function(value,index) { return value[0]; });
         var questions_set = output.map(function(value,index) { return value[1]; });
         
         //passing all unique (Group,Question) pairs to drawGraphic()
         groups_set.forEach((group, index) => 
         {
            const question = questions_set[index];
            drawGraphic(group,question,agg)});
      }});
}
