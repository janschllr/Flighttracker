export const aircraftData = {
    // Airbus
    'A318': 'Airbus A318',
    'A319': 'Airbus A319',
    'A320': 'Airbus A320',
    'A321': 'Airbus A321',
    'A20N': 'Airbus A320neo',
    'A21N': 'Airbus A321neo',
    'A332': 'Airbus A330-200',
    'A333': 'Airbus A330-300',
    'A338': 'Airbus A330-800neo',
    'A339': 'Airbus A330-900neo',
    'A342': 'Airbus A340-200',
    'A343': 'Airbus A340-300',
    'A345': 'Airbus A340-500',
    'A346': 'Airbus A340-600',
    'A359': 'Airbus A350-900',
    'A35K': 'Airbus A350-1000',
    'A388': 'Airbus A380-800',
    'BCS1': 'Airbus A220-100',
    'BCS3': 'Airbus A220-300',

    // Boeing
    'B712': 'Boeing 717',
    'B733': 'Boeing 737-300',
    'B734': 'Boeing 737-400',
    'B735': 'Boeing 737-500',
    'B736': 'Boeing 737-600',
    'B737': 'Boeing 737-700',
    'B738': 'Boeing 737-800',
    'B739': 'Boeing 737-900',
    'B38M': 'Boeing 737 MAX 8',
    'B39M': 'Boeing 737 MAX 9',
    'B744': 'Boeing 747-400',
    'B748': 'Boeing 747-8',
    'B752': 'Boeing 757-200',
    'B753': 'Boeing 757-300',
    'B762': 'Boeing 767-200',
    'B763': 'Boeing 767-300',
    'B764': 'Boeing 767-400',
    'B772': 'Boeing 777-200',
    'B77W': 'Boeing 777-300ER',
    'B77L': 'Boeing 777-200LR',
    'B788': 'Boeing 787-8',
    'B789': 'Boeing 787-9',
    'B78X': 'Boeing 787-10',

    // Embraer
    'E170': 'Embraer E170',
    'E175': 'Embraer E175',
    'E190': 'Embraer E190',
    'E195': 'Embraer E195',
    'E290': 'Embraer E190-E2',
    'E295': 'Embraer E195-E2',
    'ERJ3': 'Embraer ERJ-135',
    'ERJ4': 'Embraer ERJ-140',
    'ERJ': 'Embraer ERJ-145',

    // Bombardier / Mitsubishi (CRJ Series)
    'CRJ1': 'Bombardier CRJ-100',
    'CRJ2': 'Bombardier CRJ-200',
    'CRJ7': 'Bombardier CRJ-700',
    'CRJ9': 'Bombardier CRJ-900',
    'CRJX': 'Bombardier CRJ-1000',

    // De Havilland Canada
    'DH8A': 'De Havilland Dash 8-100',
    'DH8B': 'De Havilland Dash 8-200',
    'DH8C': 'De Havilland Dash 8-300',
    'DH8D': 'De Havilland Dash 8-Q400',

    // ATR
    'AT43': 'ATR 42-300',
    'AT45': 'ATR 42-500',
    'AT46': 'ATR 42-600',
    'AT72': 'ATR 72-200',
    'AT75': 'ATR 72-500',
    'AT76': 'ATR 72-600',
};

export const getAircraftName = (iataCode) => {
    if (!iataCode) return null;
    // When Aviationstack returns empty data, they pass down the 6-character ICAO24 hex string
    // e.g., '888060' or 'A4E214', not an IATA string. We should just return null in those cases
    // to prevent falling back to a mis-mapped string.
    if (iataCode.length === 6 && /^[0-9A-Fa-f]{6}$/.test(iataCode)) {
        return null;
    }

    return aircraftData[iataCode] || iataCode;
};
