export const translations = {
    en: {
        // App
        appTitle: 'Flight Tracker',
        appSubtitle: 'Track any flight in real-time. Enter your flight number below to get started.',
        flightNotFound: (num) => `Flight ${num} not found. Please check the flight number and try again.`,
        missingApiKey: 'Missing API Key. Please create a',
        missingApiKeyFile: '.env',
        missingApiKeyWith: 'file with',
        errorPrefix: 'Error:',
        errorSuffix: 'Please check console for details.',

        // Steps
        step1Title: 'Enter Flight Number',
        step1Desc: 'Type your flight code (e.g. LH123)',
        step2Title: 'Get Real-time Status',
        step2Desc: 'See departure, arrival and gate info',
        step3Title: 'Track Journey',
        step3Desc: 'Visualize the flight path and duration',

        // SearchBar
        searchPlaceholder: 'Enter flight number (e.g., LH123)',

        // FlightTicket
        boardingPass: 'Boarding Pass',
        class: 'Class',
        economy: 'Economy',
        flight: 'Flight',
        date: 'Date',
        time: 'Time',
        gate: 'Gate',
        seat: 'Seat',
        boarding: 'Boarding',
        eta: 'ETA',
        passengerTicket: 'Passenger Ticket',
        origin: 'Origin',
        dest: 'Dest',
        tearHere: 'TEAR HERE',

        // Flight Status
        statusOnTime: 'On Time',
        statusInAir: 'In Air',
        statusArrived: 'Arrived',
        statusCancelled: 'Cancelled',
        statusDelayed: 'Delayed',
        statusDiverted: 'Diverted',
        statusUnknown: 'Unknown',

        // FlappyPlane
        clickToFly: 'CLICK TO FLY',
        gameOver: 'GAME OVER',
        score: 'Score',
        restartHint: 'Click or Space to Restart',
    },

    de: {
        // App
        appTitle: 'Flug Tracker',
        appSubtitle: 'Verfolge jeden Flug in Echtzeit. Gib deine Flugnummer ein, um zu starten.',
        flightNotFound: (num) => `Flug ${num} nicht gefunden. Bitte überprüfe die Flugnummer und versuche es erneut.`,
        missingApiKey: 'API-Key fehlt. Bitte erstelle eine',
        missingApiKeyFile: '.env',
        missingApiKeyWith: 'Datei mit',
        errorPrefix: 'Fehler:',
        errorSuffix: 'Bitte überprüfe die Konsole für Details.',

        // Steps
        step1Title: 'Flugnummer eingeben',
        step1Desc: 'Gib deinen Flugcode ein (z.B. LH123)',
        step2Title: 'Echtzeit-Status abrufen',
        step2Desc: 'Abflug, Ankunft und Gate-Infos',
        step3Title: 'Flug verfolgen',
        step3Desc: 'Flugroute und Dauer visualisieren',

        // SearchBar
        searchPlaceholder: 'Flugnummer eingeben (z.B. LH123)',

        // FlightTicket
        boardingPass: 'Bordkarte',
        class: 'Klasse',
        economy: 'Economy',
        flight: 'Flug',
        date: 'Datum',
        time: 'Zeit',
        gate: 'Gate',
        seat: 'Sitz',
        boarding: 'Boarding',
        eta: 'Ank.',
        passengerTicket: 'Passagier-Ticket',
        origin: 'Abflug',
        dest: 'Ziel',
        tearHere: 'HIER ABREISSEN',

        // Flight Status
        statusOnTime: 'Pünktlich',
        statusInAir: 'In der Luft',
        statusArrived: 'Gelandet',
        statusCancelled: 'Gestrichen',
        statusDelayed: 'Verspätet',
        statusDiverted: 'Umgeleitet',
        statusUnknown: 'Unbekannt',

        // FlappyPlane
        clickToFly: 'KLICK ZUM FLIEGEN',
        gameOver: 'SPIEL VORBEI',
        score: 'Punkte',
        restartHint: 'Klick oder Leertaste zum Neustarten',
    }
};
