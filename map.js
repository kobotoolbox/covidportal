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
        'Survey Results from ' + geography.properties.name,
        ': ' + data.num_surveys,
        '</strong></div>'].join('')
    }
  },
  done: function(datamap) {
  datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
      window.open("https://en.wikipedia.org/wiki/" +geography.properties.name, "_blank");
  });
  window.addEventListener("resize", function() {
    map.resize();
  })
}
});
