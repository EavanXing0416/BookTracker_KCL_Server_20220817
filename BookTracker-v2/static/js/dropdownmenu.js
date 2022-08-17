var startArr = [{
    machineName: 'Italy',
    newMahinceId: '009'
}]

var endArr = [{
        machineName: 'Austria',
        newMahinceId: '001'
    },
    {
        machineName: 'Belarus',
        newMahinceId: '002'
    },
    {
        machineName: 'Belgium',
        newMahinceId: '003'
    },
    {
        machineName: 'Brazil',
        newMahinceId: '004'
    },
    {
        machineName: 'Denmark',
        newMahinceId: '005'
    },
    {
        machineName: 'France',
        newMahinceId: '006'
    },
    {
        machineName: 'Germany',
        newMahinceId: '007'
    },
    {
        machineName: 'Greece',
        newMahinceId: '008'
    },
    {
        machineName: 'Italy',
        newMahinceId: '009'
    },
    {
        machineName: 'Japan',
        newMahinceId: '010'
    },
    {
        machineName: 'Latvia',
        newMahinceId: '011'
    },
    {
        machineName: 'Netherlands',
        newMahinceId: '012'
    },
    {
        machineName: 'Poland',
        newMahinceId: '013'
    },
    {
        machineName: 'Russia',
        newMahinceId: '014'
    },
    {
        machineName: 'Spain',
        newMahinceId: '016'
    },
    {
        machineName: 'Sweden',
        newMahinceId: '017'
    },
    {
        machineName: 'Switzerland',
        newMahinceId: '018'
    },
    {
        machineName: 'United Kingdom',
        newMahinceId: '020'
    },
    {
        machineName: 'United States',
        newMahinceId: '021'
    },
    {
        machineName: 'Vatican City',
        newMahinceId: '022'
    },
    {
        machineName: 'NoInfo',
        newMahinceId: '023'
    }
];

var individualArr = [{
        machineName: 'Austria',
        newMahinceId: '001'
    },
    {
        machineName: 'Belarus',
        newMahinceId: '002'
    },
    {
        machineName: 'Belgium',
        newMahinceId: '003'
    },
    {
        machineName: 'Brazil',
        newMahinceId: '004'
    },
    {
        machineName: 'Denmark',
        newMahinceId: '005'
    },
    {
        machineName: 'France',
        newMahinceId: '006'
    },
    {
        machineName: 'Germany',
        newMahinceId: '007'
    },
    {
        machineName: 'Greece',
        newMahinceId: '008'
    },
    {
        machineName: 'Italy',
        newMahinceId: '009'
    },
    {
        machineName: 'Japan',
        newMahinceId: '010'
    },
    {
        machineName: 'Latvia',
        newMahinceId: '011'
    },
    {
        machineName: 'Netherlands',
        newMahinceId: '012'
    },
    {
        machineName: 'Poland',
        newMahinceId: '013'
    },
    {
        machineName: 'Russia',
        newMahinceId: '014'
    },
    {
        machineName: 'Slovenia',
        newMahinceId: '015'
    },
    {
        machineName: 'Spain',
        newMahinceId: '016'
    },
    {
        machineName: 'Sweden',
        newMahinceId: '017'
    },
    {
        machineName: 'Switzerland',
        newMahinceId: '018'
    },
    {
        machineName: 'Ukraine',
        newMahinceId: '019'
    },
    {
        machineName: 'United Kingdom',
        newMahinceId: '020'
    },
    {
        machineName: 'United States',
        newMahinceId: '021'
    },
    {
        machineName: 'Vatican City',
        newMahinceId: '022'
    },
    {
        machineName: 'NoInfo',
        newMahinceId: '023'
    }
];
tempArr = individualArr
searchInputStart(startArr);
searchInputEnd(endArr);

function newOptionsStart(tempArr) {
    var listArr = [];
    for (var i = 0; i < tempArr.length; i++) {
        if (tempArr[i].machineName.indexOf($('#select_input_start').val()) > -1) {
            listArr.push(tempArr[i]);
        }
    }
    var options = '';
    for (var i = 0; i < listArr.length; i++) {
        opt = '<li class="li-select" data-newMachineId="' + listArr[i].newMahinceId + '">' + listArr[i].machineName + '</li>';
        options += opt;
    }
    if (options == '') {
        $('#search_select_start').hide();
    } else {
        $('#search_select_start').show();
        $('#select_ul_start').html('').append(options);
    }
}

function newOptionsEnd(tempArr) {
    var listArr = [];
    for (var i = 0; i < tempArr.length; i++) {
        if (tempArr[i].machineName.indexOf($('#select_input_end').val()) > -1) {
            listArr.push(tempArr[i]);
        }
    }
    var options = '';
    for (var i = 0; i < listArr.length; i++) {
        opt = '<li class="li-select" data-newMachineId="' + listArr[i].newMahinceId + '">' + listArr[i].machineName + '</li>';
        options += opt;
    }
    if (options == '') {
        $('#search_select_end').hide();
    } else {
        $('#search_select_end').show();
        $('#select_ul_end').html('').append(options);
    }
}

function searchInputStart(tempArr) {
    $('select-content .sanjiao').on('click', function() {
        $('#select_input_start').focus();
    });
    $('#select_input_start').on('keyup', function() {
        newOptionsStart(tempArr);
    });
    $('#select_input_start').on('focus', function() {
        $('#search_select_start').show();
        newOptionsStart(tempArr);
    });
    $('#select_ul_start .li-disabled').on('click', function() {
        $('#search_select_start').show();
    });
    $('#search_select_start').on('mouseover', function() {
        $(this).addClass('ul-hover');
    });
    $('#search_select_start').on('mouseout', function() {
        $(this).removeClass('ul-hover');
    });
    $('#select_input_start').on('blur', function() {
        if ($('#search_select_start').hasClass('ul-hover')) {
            $('#search_select_start').show();
        } else {
            $('#search_select_start').hide();
        }
    });
    $('#select_ul_start').delegate('.li-select', 'click', function() {
        $('#select_ul_start .li-select').removeClass('li-hover');
        var selectText = $(this).html();
        var newMachineIdVal = $($(this)[0]).attr("data-newMachineId");
        $('#select_input_start').val(selectText);
        $('#search_select_start').hide();
        $("input[name='newMachineId']").val(newMachineIdVal);
        //          console.log($("input[name='newMachineId']").val())
    });
    $('#select_ul_start').delegate('.li-select', 'mouseover', function() {
        $('#select_ul_start .li-select').removeClass('li-hover');
        $(this).addClass('li-hover');
    });
}

function searchInputEnd(tempArr) {
    $('select-content .sanjiao').on('click', function() {
        $('#select_input_end').focus();
    });
    $('#select_input_end').on('keyup', function() {
        newOptionsEnd(tempArr);
    });
    $('#select_input_end').on('focus', function() {
        $('#search_select_end').show();
        newOptionsEnd(tempArr);
    });
    $('#select_ul_end .li-disabled').on('click', function() {
        $('#search_select_end').show();
    });
    $('#search_select_end').on('mouseover', function() {
        $(this).addClass('ul-hover');
    });
    $('#search_select_end').on('mouseout', function() {
        $(this).removeClass('ul-hover');
    });
    $('#select_input_end').on('blur', function() {
        if ($('#search_select_end').hasClass('ul-hover')) {
            $('#search_select_end').show();
        } else {
            $('#search_select_end').hide();
        }
    });
    $('#select_ul_end').delegate('.li-select', 'click', function() {
        $('#select_ul_end .li-select').removeClass('li-hover');
        var selectText = $(this).html();
        var newMachineIdVal = $($(this)[0]).attr("data-newMachineId");
        $('#select_input_end').val(selectText);
        $('#search_select_end').hide();
        $("input[name='newMachineId']").val(newMachineIdVal);
        //          console.log($("input[name='newMachineId']").val())
    });
    $('#select_ul_end').delegate('.li-select', 'mouseover', function() {
        $('#select_ul_end .li-select').removeClass('li-hover');
        $(this).addClass('li-hover');
    });
}

function searchBookByLocation() {
    var startLoc = document.getElementById("select_input_start").value;
    var endLoc = document.getElementById("select_input_end").value;
    alert(startLoc + ';' + endLoc)
    d3.csv("https://raw.githubusercontent.com/EavanXing0416/Dante1481BookTrade/main/BookTradeWebApp/static/data/Dante1481_pathstartend.csv").then(function(data) {
        console.log(data)
        var selectedId = []
        console.log(startLoc + ' ' + endLoc)
        for (i = 0; i < data.length; i++) {
            startAreaName = data[i].start_area_name
            endAreaName = data[i].end_area_name.substring(1)
            console.log(startAreaName + ' ' + endAreaName)
            if (startAreaName == startLoc && endAreaName == endLoc) {
                selectedId.push(data[i].Id)
            } else {
                console.log(i)
            }
        }
        console.log(selectedId)
        document.getElementById('selectedIdBox').value = selectedId

        getInfoPanelBtns(selectedId)
        updateSTB(selectedId)
    })
}