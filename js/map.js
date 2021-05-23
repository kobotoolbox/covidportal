//defining datamap
var map = new Datamap(
  {
    element: document.getElementById("map"),
    projection: 'mercator',
    responsive: true,
    fills:
    {
      //defining fill colors
      defaultFill: '#C8DCE7',
      EXTRA_HIGH: '#2B5487',
      HIGH: '#008DC9',
      MEDIUM: '#5CC6F2',
      LOW: '#90DEFF',
    },
    data: 
    {
      COD:
      {
        fillKey: 'HIGH',
        num_surveys: 1
      },
      USA:
      {
        fillKey: 'MEDIUM',
        num_surveys: 1
      },
      FRA: 
      {
        fillKey: 'LOW',
        num_surveys: 1
      },
      LSO: 
      {
        fillKey: 'EXTRA_HIGH',
        num_surveys: 1
      },
      GTM: 
      {
        fillKey: 'EXTRA_HIGH',
        num_surveys: 1
      },
      UGA: 
      {
        fillKey: 'EXTRA_HIGH',
        num_surveys: 1
      }
    },
    geographyConfig: 
    {
      //defining popup
      popupTemplate: function(geography, data) 
      {
        return ['<div class = "hoverinfo"><strong>',
                'Survey Results from ' + geography.properties.name,
                ': ' + data.num_surveys,
                '</strong></div>'].join('')
      }
    },
    done: function(datamap) 
    {
      //defining on-click behaviour
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) 
      {
        window.open(geography.properties.name + "_landing_page.html");
      });
      
      //defining zoom functionality
      datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
      function redraw() 
      {
        datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
    }
  });

//adding listener for page resize
window.addEventListener("resize", function() 
{
  map.resize();
});
