$("#myInput-submit").click(function() {
    var start = $("#myInput-start").val()
    var end = $('#myInput-end').val()
    var areafrom = $('#myInput-AreaFrom').val()
    var areato = $('#myInput-AreaTo').val()
    var data = {
        "start": start,
        "end": end,
        "areafrom": areafrom,
        "areato": areato,
    }
    console.log(data)

    $.ajax({
        url: "/send_message",
        type: "POST",
        async: true,
        data: data,
        dataType: 'json',
        success: function(response) {
            console.log(response);
            //alert('success')
            var idArr = []
            response.forEach(function(row) {
                const bookId = row.Id
                if (idArr.includes(bookId) == false) { idArr.push(bookId.toString()); }

            })
            console.log(idArr)
            d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_cleaned.csv")
                .then(function(data) {
                    var filtered_data = filterById(data, idArr);
                    console.log(filtered_data)
                        //parse data
                        //parseData(data);
                    createTable(filtered_data);
                });

        },
        error: function(error) {
            console.log(error);
        }
    })
})




function filterById(bookdata, idArr) {
    let selectedItem = bookdata.filter(item => !idArr.some(i => i == item.Id))
    return selectedItem;
}



/*function filterById(bookdata, idArr) {
    let v = idArr.filter(item => { if (bookdata.indexOf(item.Id) > -1) { return item } })
    console.log(v)
    return v;
}
*/
/*
function filterById(bookdata, idArr) {
    var result = []
    console.log(idArr)
    for (let i = 0; i < bookdata.length; i++) {
        //console.log(bookdata.length)
        //console.log(bookdata[i])
        console.log(bookdata[i].Id)
            //console.log(idArr.includes(bookdata[i].Id))
        if (idArr.includes(bookdata[i].Id) == true) {
            result=result.push(bookdata[i])
                //console.log(bookdata[i])
        };
    };
    return result;
}
*/




function createTable(data) {
    const data_parsed = []
    data.forEach(function(row, i) {
        //console.log(i) //show the index
        //const hI = JSON.parse(row.holdingInstitution.replace(/"/g, `'`).replace(/u'/g, `"`).replace(/':/g, `":`).replace(/',/g, `",`).replace(/'}/g, `"}`))
        const NOP = JSON.parse(row.NumOfProv)
        const pN = JSON.parse(row.placeName.replace(/"/g, `'`).replace(/]/g, `"]`).replace(/, /g, `", "`).replace(`[`, `["`).replace(/NoInfo/g, 'Not Known'))
            //console.log(row.placeName)
        const lN = JSON.parse(row.locationName.replace(/"/g, `'`).replace(/]/g, `"]`).replace(/, /g, `", "`).replace(`[`, `["`).replace(/NoInfo/g, 'Not Known'))
        const tS = JSON.parse(row.timeStartFilled.replace(/NoInfo/g, null))
        const tE = JSON.parse(row.timeEndFilled.replace(/NoInfo/g, null))
        const tC = JSON.parse(row.timeCentury.replace(/"/g, 'OMG').replace(/'/g, '"').replace(/OMG/g, "'").replace(/NoInfo/g, '[]'))
        data_parsed.push({ Id: row.Id, NOP: NOP, lN: lN, pN: pN, tS: tS, tE: tE, tC: tC, Today: row.Today, MEIlink: row.MEIlink })
    });
    /*console.log(data_parsed)*/

    d3.select('#table-container tbody')
        .selectAll('tr')
        .data(data_parsed)
        .join('tr')
        .html(function(d) {
            let html = '<tr>';
            html += '<td style="width:10%">' + d.Id + '</td>';

            html += '<td style="width:10%">' + ' <a href="' + d.MEIlink + '">Link</a>' + '</td>';
            //if (d.hI['country'] == undefined) {
            //    html += '<td style="width:20%">' + d.hI.short.toString() + '</td>';
            //} else { html += '<td style="width:20%">' + d.hI.country.toString() + '<br/>' + d.hI.short.toString() + '</td>'; }

            html += '<td style="width:10%">' + d.NOP + '</td>';
            html += '<td style="width:10%">' + d.lN.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.pN.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tS.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.tE.toString().replace(/,/g, '<br/>') + '</td>';
            // html += '<td style="width:10%">' + d.tC.toString().replace(/,/g, '<br/>') + '</td>';
            html += '<td style="width:10%">' + d.Today + '</td>';
            html += '</tr>';
            return html;
        });
}



function searchBook() {
    var input, filter, table, tr, td, i, txtValue;
    var idvalue, path
    input = document.getElementById("myInput-id");
    //input2 = document.getElementById("myInput-hi");
    //input3 = document.getElementById("myInput-location");
    //input4 = document.getElementById("myInput-century");
    filter = input.value;
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
            txtValue = td.textContent /*||  td.innerText*/ ;
            //txtValue2 = td2.textContent || td2.innerText;
            //txtValue3 = td3.textContent || td3.innerText;
            //txtValue4 = td4.textContent || td4.innerText;
            //console.log(td.textContent, td.innerText)
            if (txtValue.indexOf(filter) > -1 /*&& txtValue2.indexOf(filter2) > -1 && txtValue3.indexOf(filter3) > -1 && txtValue4.indexOf(filter4) > -1*/ ) {
                tr[i].style.display = "";

                //id & movenments & locations
                //idvalue = txtValue1
                idvalue = document.getElementById(txtValue)
                location = document.querySelectorAll("#map g.movements circle")
                console.log(idvalue)
                idvalue.style.opacity = "1"
                idvalue.style.stroke = "#69b3a2"



            } else {
                tr[i].style.display = "none";
                path = document.getElementById(txtValue)
                console.log(path)
                path.style.opacity = "0"
            }
        }
    }

    //filter the paths
    //movement = document.getElementsByClassName("movements")
    //path = movement.getElementById()

}