function createTable(data) {
    const data_parsed = []
    data.forEach(function(row, i) {
        console.log(i) //show the index
        const hI = JSON.parse(row.holdingInstitution.replace(/"/g, `'`).replace(/u'/g, `"`).replace(/':/g, `":`).replace(/',/g, `",`).replace(/'}/g, `"}`))
        const NOP = JSON.parse(row.NumOfProv)
        const lN = JSON.parse(row.locationName.replace(/"/g, `'`).replace(/]/g, `"]`).replace(/, /g, `", "`).replace(`[`, `["`).replace(/NoInfo/g, null))
        const tS = JSON.parse(row.timeStart.replace(/NoInfo/g, null))
        const tE = JSON.parse(row.timeEnd.replace(/NoInfo/g, null))
        const tC = JSON.parse(row.timeCentury.replace(/"/g, 'OMG').replace(/'/g, '"').replace(/OMG/g, "'").replace(/NoInfo/g, '[]'))
        data_parsed.push({ Id: row.Id, hI: hI, NOP: NOP, lN: lN, tS: tS, tE: tE, tC: tC, Today: row.Today })
    });
    console.log(data_parsed)

    d3.select('#table-container tbody')
        .selectAll('tr')
        .data(data_parsed)
        .join('tr')
        .html(function(d) {
            let html = '<tr>';
            html += '<td style="width:10%">' + d.Id + '</td>';
            if (d.hI['country'] == undefined) {
                html += '<td style="width:20%">' + d.hI.short.toString() + '</td>';
            } else { html += '<td style="width:20%">' + d.hI.country.toString() + '<br/>' + d.hI.short.toString() + '</td>'; }

            html += '<td style="width:10%">' + d.NOP + '</td>';
            html += '<td style="width:10%">' + d.lN.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tS.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tE.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tC.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.Today + '</td>';
            html += '</tr>';
            return html;
        });
}




d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481.csv")
    .then(function(data) {

        //parse data
        //parseData(data);
        createTable(data);
    });


function searchId() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput-id");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            //console.log(td.textContent, td.innerText)
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function searchHI() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput-hi");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            //console.log(td.textContent, td.innerText)
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function searchLoc() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput-location");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            txtValue = td.textContent || td.innerText;
            //console.log(td.textContent, td.innerText)
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function searchBook() {
    var input1, input2, input3, input4, filter1, filter2, filter3, filter4, table, tr, td, td1, td2, td3, td4, i, txtValue1, txtValue2, txtValue3, txtValue4;
    var idvalue, location, movement, path
    input1 = document.getElementById("myInput-id");
    //input2 = document.getElementById("myInput-hi");
    //input3 = document.getElementById("myInput-location");
    //input4 = document.getElementById("myInput-century");
    filter1 = input1.value;
    //filter2 = input3.value;
    //filter3 = input3.value;
    //filter4 = input4.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    //movement = document.getElementsByClassName("movements");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        //td2 = tr[i].getElementsByTagName("td")[1];
        //td3 = tr[i].getElementsByTagName("td")[3];
        //td4 = tr[i].getElementsByTagName("td")[6];
        console.log(td)
        if (td) {
            txtValue1 = td.textContent /*||  td.innerText*/ ;
            //txtValue2 = td2.textContent || td2.innerText;
            //txtValue3 = td3.textContent || td3.innerText;
            //txtValue4 = td4.textContent || td4.innerText;
            //console.log(td.textContent, td.innerText)
            if (txtValue1.indexOf(filter1) > -1 /*&& txtValue2.indexOf(filter2) > -1 && txtValue3.indexOf(filter3) > -1 && txtValue4.indexOf(filter4) > -1*/ ) {
                tr[i].style.display = "";

                //id & movenments & locations
                //idvalue = txtValue1
                idvalue = document.getElementById(txtValue1)
                location = document.querySelectorAll("#map g.movements circle")
                console.log(idvalue)
                idvalue.style.opacity = "1"
                idvalue.style.stroke = "#69b3a2"



            } else {
                tr[i].style.display = "none";
                path = document.getElementById(txtValue1)
                console.log(path)
                path.style.opacity = "0"
            }
        }
    }

    //filter the paths
    //movement = document.getElementsByClassName("movements")
    //path = movement.getElementById()

}