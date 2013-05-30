/*****************************************************************************
 * Tillegg for å logge LTID og DOKID fra utlån og retur, 
 * samt LTID fra LTST- og LTSØK-besøk.
 *
 * Funksjonaliteten er ment å hjelpe i situasjoner der man
 * "mister" en bruker eller et dokument mens man holder på
 * å jobbe, ikke for å drive systematisk logging. Loggen tømmes
 * når man avslutter BIBDUCK, eller manuelt ved å trykke på 
 * knappen "Tøm logg".
 *
 * Nye kommandoer:
 *   ltid!     : Setter inn siste LTID
 *   dokid!    : Setter inn siste DOKID
 *****************************************************************************/
$.bibduck.plugins.push({
    siste_ltid: '',
    siste_dokid: '',
    aktiv_ltid: '',
    siste_retur: '',
    utlaansskjerm: false,
    name: 'Logger',

    keypress: function (bibsys) {
        if (bibsys.getTrace() === 'ltid!') {
            bibsys.clearInput();
            bibsys.send(this.siste_ltid);
        } else if (bibsys.getTrace() === 'dokid!') {
            bibsys.clearInput();
            bibsys.send(this.siste_dokid);
        }
    },

    update: function (bibsys) {
        var ltid,
            dokid,
            logger = $.bibduck.log;

        // Er vi på LTST-skjermen?
        if (bibsys.get(2, 1, 34) === 'Oversikt over lån og reserveringer') {

            // Finnes det noe som ligner på et LTID på linje 4,
            // (som vi ikke allerede har sett)?
            ltid = bibsys.get(4, 15, 24).trim();
            if (ltid.length === 10 && ltid !== this.aktiv_ltid) {
                this.aktiv_ltid = ltid;
                this.siste_ltid = ltid;
                logger('LTST for: ' + ltid, 'info');
            }

        // Er vi på LTSØK-skjermen?
        } else if (bibsys.get(2, 1, 34) === 'Opplysninger om låntaker (LTSØk)') {

            // Finnes det noe som ligner på et LTID på linje 4,
            // (som vi ikke allerede har sett)?
            ltid = bibsys.get(18, 18, 27).trim();
            if (ltid.length === 10 && ltid !== this.aktiv_ltid) {
                this.aktiv_ltid = ltid;
                this.siste_ltid = ltid;
                logger('LTSØK for: ' + ltid, 'info');
            }
        } else {
            this.aktiv_ltid = '';
        }

        // Er vi på en retur-skjerm?
        if (bibsys.get(2, 1, 15) === 'Returnere utlån') {
            dokid = bibsys.get(6, 31, 39).trim();
            if (dokid.length === 9 && dokid !== this.siste_retur) {
                ltid = bibsys.get(15, 16, 25);
                this.siste_retur = dokid;
                this.siste_dokid = dokid;
                this.siste_ltid = ltid;
                logger('Retur registrert: ' + dokid + ' fra ' + ltid, 'info');
            }
        } else {
            this.siste_retur = '';
        }

        // Er vi på en utlånsskjerm?
        if (this.utlaansskjerm === false && bibsys.get(1, 1, 14) === 'Lån registrert') {
            ltid = bibsys.get(1, 20, 29);
            dokid = bibsys.get(10, 7, 15);
            logger('Utlån registrert: ' + dokid + ' til ' + ltid, 'info');
            this.utlaansskjerm = true;
            this.siste_ltid = ltid;
            this.siste_dokid = dokid;
            /*if (confirm("Stikkseddel?") === true) {
                bibsys.bringToFront();
                bibsys.typetext('stikk!');
            }*/
        } else if (this.utlaansskjerm === true && bibsys.get(1, 1, 14) !== 'Lån registrert') {
            this.utlaansskjerm = false;
        }
		
		// Er vi på en dokstatskjerm?
        if (bibsys.get(2, 1, 38) === 'Utlånsstatus for et dokument (DOkstat)') {		
            dokid = bibsys.get(5, 9, 17);
			if (dokid.length === 9 && parseInt(dokid.substring(0,2), 10) > 0 && dokid !== this.siste_dokid) {
				this.siste_dokid = dokid;
                logger('Dokstat for: ' + dokid, 'info');
			}
        }

    }
});
