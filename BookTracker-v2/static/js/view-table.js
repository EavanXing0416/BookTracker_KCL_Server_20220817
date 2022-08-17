// Table related functions

function createTable(data, uncertainty) {
    var data_parsed = []
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
    console.log(data_parsed)

    function changeTodayValue(today) {
        if (today == "True") {
            return ("<span style=\"color:#76a653\">" + "Recorded" + "</span>")
        } else {
            return ("<span style=\"color:#433368\">" + "Missing" + "</span>")
        }

    }

    //Add Uncertainty columns to parsed dataset.
    if (uncertainty.length == 0) {
        data_parsed = [{ Id: '', NOP: '', lN: '', pN: '', tS: '', tE: '', tC: '', Today: '', MEIlink: '', locType: '', startType: '', endType: '' }]
        d3.select('#table-container tbody')
            .selectAll('tr')
            .data(data_parsed)
            .join('tr')
            .html(function(d, i) {
                //console.log(i)
                let html = '<tr>';
                html += '<td style="width:11%">' + 'NA' + '</td>';

                html += '<td style="width:11%">' + 'NA' + '</td>';
                //if (d.hI['country'] == undefined) {
                //    html += '<td style="width:20%">' + d.hI.short.toString() + '</td>';
                //} else { html += '<td style="width:20%">' + d.hI.country.toString() + '<br/>' + d.hI.short.toString() + '</td>'; }

                html += '<td style="width:11%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:8%">' + 'NA' + '</td>';
                html += '<td style="width:11%">' + 'NA' + '</td>';
                html += '</tr>';
                return html;
            });
    } else {
        var initialId = uncertainty[0].Id
        var locTypeEach = []
        var startTypeEach = []
        var endTypeEach = []
        console.log(initialId)
        var index = 0
        for (var i = 0; i < uncertainty.length; i++) {
            var currentId = uncertainty[i].Id

            if (currentId == initialId) {
                index = index
                locTypeEach.push(uncertainty[i].LocType)
                startTypeEach.push(uncertainty[i].StartType)
                endTypeEach.push(uncertainty[i].EndType)
            } else {
                data_parsed[index]['locType'] = locTypeEach
                data_parsed[index]['startType'] = startTypeEach
                data_parsed[index]['endType'] = endTypeEach

                locTypeEach = [uncertainty[i].LocType]
                startTypeEach = [uncertainty[i].StartType]
                endTypeEach = [uncertainty[i].EndType]

                index += 1
                initialId = currentId
            }
            console.log(index)
            console.log(locTypeEach)
        };
        data_parsed[index]['locType'] = locTypeEach
        data_parsed[index]['startType'] = startTypeEach
        data_parsed[index]['endType'] = endTypeEach

        /*
        for (var i = 0; i < 173; i++) {
            console.log(data_parsed[i].locType)
            console.log(i)
        }
        */
        console.log(data_parsed)

        d3.select('#table-container tbody')
            .selectAll('tr')
            .data(data_parsed)
            .join('tr')
            .html(function(d, i) {
                //console.log(i)
                let html = '<tr>';
                html += '<td style="width:11%">' + d.Id + '</td>';

                html += '<td style="width:11%">' + ' <a href="' + d.MEIlink + '">Link</a>' + '</td>';
                //if (d.hI['country'] == undefined) {
                //    html += '<td style="width:20%">' + d.hI.short.toString() + '</td>';
                //} else { html += '<td style="width:20%">' + d.hI.country.toString() + '<br/>' + d.hI.short.toString() + '</td>'; }

                html += '<td style="width:11%">' + (+d.NOP - 1) + '</td>';
                html += '<td style="width:8%">' + d.lN.toString().replace(/,/g, '<br/>') + '</td>';
                html += '<td style="width:8%">' + d.pN.toString().replace(/,/g, '<br/>') + '</td>';
                html += '<td style="width:8%">' + d.locType.toString().replace(/,/g, '<br/>').replace(/accurate/g, '<span style=\"color:#76a653\">Accurate</span>').replace(/approx/g, '<span style=\"color:#db8144\">Approximate</span>').replace(/NoInfo/g, '<span style=\"color:#a40e1a\">Uncertain</span>') + '</td>';
                html += '<td style="width:8%">' + d.tS.toString().replace(/,/g, '<br/>') + '</td>';
                html += '<td style="width:8%">' + d.startType.toString().replace(/,/g, '<br/>').replace(/accurate/g, '<span style=\"color:#76a653\">Accurate</span>').replace(/approx/g, '<span style=\"color:#db8144\">Approximate</span>').replace(/NoInfo/g, '<span style=\"color:#a40e1a\">Uncertain</span>') + '</td>';

                html += '<td style="width:8%">' + d.tE.toString().replace(/,/g, '<br/>') + '</td>';
                html += '<td style="width:8%">' + d.endType.toString().replace(/,/g, '<br/>').replace(/accurate/g, '<span style=\"color:#76a653\">Accurate</span>').replace(/approx/g, '<span style=\"color:#db8144\">Approximate</span>').replace(/NoInfo/g, '<span style=\"color:#a40e1a\">Uncertain</span>') + '</td>';

                html += '<td style="width:11%">' + changeTodayValue(d.Today) + '</td>';
                html += '</tr>';
                return html;
            });
    }
}

function searchBook() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput-id");
    filter = input.value;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        console.log(td)
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.indexOf(filter) > -1) {
                tr[i].style.display = "";

            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function highlightSinglePath() {
    var input, filter, singlepath, singledots, p, d;
    input = document.getElementById("myInput-id");
    filter = input.value;
    console.log(filter)
    singlepath = document.getElementsByClassName('path' + filter)
    singledots = document.getElementsByClassName('dots' + filter)

    // set all the dots and paths' opacity to 0.01 if they are not
    /*
    var allpath = document.getElementsByClassName('movements');
    var alldots = document.getElementsByClassName('locations');
    var i, j;
    for (i = 0; i < allpath.length; i++) {
        console.log(allpath[i].attr)
        if (allpath[i].style.opacity != 0.01) {
            allpath[i].style.opacity = 0.01;
        } else {
            allpath[i].style.opacity = 0.25;
        }
    }

    for (j = 0; j < alldots.length; j++) {
        if (alldots[j].style.opacity != 0.01) {
            alldots[j].style.opacity = 0.01;
        } else {
            alldots[j].style.opacity = 0.3;
        }
    }
    */

    //highlight the seletced paths and dots with high opacity and larger size
    for (p = 0; p < singlepath.length; p++) {
        singlepath[p].setAttribute("style", "fill: none; stroke-width: 4; stroke: #660000; opacity: 1; z-index: 1");
        /*
        singlepath[p].style.stroke.width = 4;
        singlepath[p].style.stroke = '#660000';
        singlepath[p].style.opacity = 1;
        singlepath[p].style.zIndex = '1000';*/
    }
    for (d = 0; d < singledots.length; d++) {
        singledots[d].setAttribute("style", "r: 6; fill: #660000; opacity: 1; z-index: 1");
    }
}