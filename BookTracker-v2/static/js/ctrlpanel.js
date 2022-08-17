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

    d3.select('#map g.locations').remove();
    d3.select('#map g.movements').remove();
    d3.select('#map svg').append('g').attr('class', 'movements')
    $.ajax({
        url: "/send_message",
        type: "POST",
        async: true,
        data: data,
        dataType: 'json',
        success: function(response) {
            console.log(response);
            //alert('success')
            response.forEach(function(row) {
                const bookId = row.Id
                var link = []
                var source = [+row.lon1, +row.lat1]
                var target = [+row.lon2, +row.lat2]
                var topush = { type: "LineString", coordinates: [source, target] }
                link.push(topush)
                console.log(link)
                drawMovements(link, bookId)
            })



        },
        error: function(error) {
            console.log(error);
        }
    })

    /*    
        $.ajax({
            url: "/send_message",
            type: "GET",
            async: false,
            data: data,
            dataType: 'json',
            success: function(response) {
                console.log(response);
                alert('success')
            },
            error: function(error) {
                console.log(error);
            }
        })



        
        $.getJSON("/send_message", function(data) {
                alert('load data')
                    //console.log(data)
                    //console.log("传到前端的数据的类型：" + typeof(data))S
                    // var filterId = data.Id
                    //console.log(filterId)

            })
            //console.log(data)*/
})

/*
$("#myInput-submit").click(function() {
    $.getJSON("/change_to_json", function(data) {
        //$("#recv_content").val(data.start) //将后端数据显示在前端
        console.log(data)
        console.log("传到前端的数据的类型：" + typeof(data))
            //$("#send_content").val("") //发送的输入框清空
    })
})
*/