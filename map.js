var map = new Datamap({
  element: document.getElementById("container"),
  projection: 'mercator',
  responsive: true,
  fills:
  {
    defaultFill: '#479FF6',
    HIGH: '#6BCAD6',
    MEDIUM: '#F86678',
    LOW: '#4B4E5E'
  },
  data: {
    COD: {
      fillKey: 'HIGH',
      num_surveys: 3
    },
    USA: {
      fillKey: 'MEDIUM',
      num_surveys: 2
    },
    BRA: {
      fillKey: 'LOW',
      num_surveys: 1
    }
  },
  geographyConfig: {
    popupTemplate: function(geography, data) {
      return ['<div class = "hoverinfo"><strong>',
        'Surveys from ' + geography.properties.name,
        ': ' + data.num_surveys,
        '</strong></div>'].join('')
    }
  },
  done: function(datamap) {
  
    //on-click function
    datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
      window.open("https://en.wikipedia.org/wiki/" +geography.properties.name, "_blank");});

    //zoom function
    datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
    function redraw() {
      datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
    }
});
window.addEventListener("resize", function() {
  map.resize();
});
