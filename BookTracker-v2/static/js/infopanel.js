//Test IDlist
//var IDlist = ['bikram', 'yoga', 'vegan', 'vegetarian', 'nutrition', 'exercise', 'pilates', 'calisthenics', 'ashtanga', 'vinyasa', 'utkatasana']

function getInfoPanelBtns(IDlist, queryType) {
    //clear info panel
    $(".info-btn-group").remove();
    $("#infoText").remove();
    //add now id btns
    for (var i = 0; i < IDlist.length; i++) {
        //var buttons = $('<button class="info-btn-group btn-outline-info btn-sm" style = {width: 10rem}>' + IDlist[i] + '</button>')
        var id = String(IDlist[i])
        var idStr
        if (id.length == 6) {
            idStr = '00' + id
        } else if (id.length == 7) {
            idStr = '0' + id
        } else {
            idStr = id
        }

        if (IDlist[0] != 'None') {
            var buttons = $('<button class="info-btn-group btn-outline-info btn-sm" style = {width: 10rem}> <a href="#book-' + (i + 1) + '-stat">' + idStr + '</a></button>')
            buttons.appendTo('#info-btns');
        }
    }

    /*
    if (IDlist[0] == 'None') {
        var infoText = $('<p id = "infoText">' + 'No book record is selected</p>')
        infoText.appendTo('#info')
    } else if (IDlist.length == 1) {
        var infoText = ('<p id = "infoText">' + (IDlist.length) + ' book record is selected</p>')
        infoText.appendTo('#info')
    } else {
        var infoText = $('<p id = "infoText">' + (IDlist.length) + ' book record(s) are selected</p>')
        infoText.appendTo('#info')
    }
    */
    var text
    if (IDlist[0] == 'None') {
        text = 'No book is '
    } else if (IDlist.length == 1) {
        text = 1 + ' book is '
    } else {
        text = IDlist.length + ' books are '
    }
    var infoText = $('<p id = "infoText">' + text + 'selected</p>')
    infoText.appendTo('#info')

}

function infoClear() {
    document.getElementById('selectedIdBox').value = '';
    $(".info-btn-group").remove();
}