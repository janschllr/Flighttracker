import { getAirportData } from '../data/airports';
import { getAircraftName } from '../data/aircrafts';

const API_KEY = import.meta.env.VITE_AVIATION_STACK_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1/flights';

export const searchFlight = async (flightNumber) => {
    // 1. Check for API Key
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('MISSING_API_KEY');
    }

    try {
        // 2. Fetch Data
        const response = await fetch(`${BASE_URL}?access_key=${API_KEY}&flight_iata=${flightNumber}`);
        const data = await response.json();

        if (data.error) {
            console.error('API Error Details:', JSON.stringify(data.error, null, 2));
            throw new Error(data.error.message || 'API_ERROR');
        }

        if (!data.data || data.data.length === 0) {
            return null;
        }

        // 3. Transform Data
        const flight = data.data[0];

        const depAirport = getAirportData(flight.departure.iata);
        const arrAirport = getAirportData(flight.arrival.iata);

        return {
            flightNumber: flight.flight.iata,
            airline: flight.airline.name,
            airlineIata: flight.airline.iata,
            origin: {
                code: flight.departure.iata,
                city: flight.departure.airport,
                name: flight.departure.airport,
                lat: depAirport?.lat ?? null,
                lng: depAirport?.lng ?? null,
                timezone: depAirport?.tz ?? null,
            },
            destination: {
                code: flight.arrival.iata,
                city: flight.arrival.airport,
                name: flight.arrival.airport,
                lat: arrAirport?.lat ?? null,
                lng: arrAirport?.lng ?? null,
                timezone: arrAirport?.tz ?? null,
            },
            departure: {
                scheduled: flight.departure.scheduled,
                estimated: flight.departure.estimated,
                actual: flight.departure.actual,
                gate: flight.departure.gate || 'TBD',
                terminal: flight.departure.terminal || 'TBD'
            },
            arrival: {
                scheduled: flight.arrival.scheduled,
                estimated: flight.arrival.estimated,
                actual: flight.arrival.actual,
                gate: flight.arrival.gate || 'TBD',
                terminal: flight.arrival.terminal || 'TBD'
            },
            status: mapStatus(flight.flight_status),
            aircraft: getAircraftName(flight.aircraft?.iata || flight.aircraft?.icao) || null,
            live: flight.live ?? null,
        };

    } catch (error) {
        console.error('Search Flight Error:', error);
        throw error;
    }
};

function mapStatus(apiStatus) {
    const statusMap = {
        'scheduled': 'On Time',
        'active': 'In Air',
        'landed': 'Arrived',
        'cancelled': 'Cancelled',
        'incident': 'Delayed',
        'diverted': 'Diverted'
    };
    return statusMap[apiStatus] || 'Unknown';
}
