/*****************************************************************************
 * Nye kommandoer:
 *   !!     : Tømmer linjen
 *   #!     : Flytter pekeren til kommandolinja (linje 3)
 *****************************************************************************/
$.bibduck.plugins.push({

    name: 'Linjetømmer',

    keypress: function(bibsys) {

        var trace = bibsys.getTrace();
        //$.bibduck.log(trace);

        if (trace.length >= 2 && trace.substr(trace.length - 2, trace.length) === "!!") {
            bibsys.clearInput();
        }

        if (trace.length >= 2 && trace.substr(trace.length - 2, trace.length) === "#!") {
            bibsys.clearInput();
            bibsys.resetPointer();
        }
    }

});


/*****************************************************************************
 * Tillegg som aksepterer dokid i forfatter-feltet på BIB-skjermen, 
 * slik at man slipper å tabbe ned til dokid-feltet. 
 *****************************************************************************/
$.bibduck.plugins.push({
    name: 'Dokid i forfatter-feltet på BIB-skjermen',

    update: function (bibsys) {
        var dokid,
            cursorpos;

        // Er vi på BIB-skjermen?
        if (bibsys.get(2, 1, 17) === 'Bibliografisk søk') {

            // Finnes det noe som ligner på et dokid på linje 5?
            dokid = bibsys.get(5, 17, 26).trim();
            if (dokid.length === 9 && /^\d+$/.test(dokid.substr(0, 2))) {

                // Sjekk hvilken linje vi er på. Hvis dokid er limt inn, 
                // kan det komme med en tab eller enter, slik at vi har hoppet
                // til neste linje før denne rutinen får kjørt
                cursorpos = bibsys.getCursorPos();
                if (cursorpos.row === 5) {
                    bibsys.send('\t\t\t\t' + dokid + '\n');
                } else if (cursorpos.row === 6) {
                    bibsys.send('\t\t\t' + dokid + '\n');
                }

            }
        }
    }
});
