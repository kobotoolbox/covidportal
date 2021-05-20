//pulling .csv file from github repo and parsing
Papa.parse(url, 
{
        download: true,
        complete: function(result) {
            if (result.data && result.data.length > 0) 
            {
                htmlTableGenerator(result.data)
            }
        }
});

//generating html datatable
function htmlTableGenerator(content)
{
    let csv_preview = document.getElementById('data-table');
    let html = '<table id="example" class="table table-condensed table-hover table-striped" style="width:100%">';
    if (content.length == 0 || typeof(content[0]) === 'undefined') 
    {
        return null
    }
    else 
    {
        const header = content[0];
        const data = content.slice(1);
        html += '<thead>';
        html += '<tr>';
        header.forEach(function(colData) 
        {
            html += '<th>' + colData + '</th>';
        });
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        data.forEach(function(row) 
        {
            if (header.length === row.length)
            {
                html += '<tr>';
                row.forEach(function(colData) 
                {
                    html += '<td>' + colData + '</td>';
                });
                html += '</tr>';
            }
        });

        html += '</tbody>';
        html += '</table>';

        csv_preview.innerHTML = html;
    }
}
