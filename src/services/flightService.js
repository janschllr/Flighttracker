import { format, addHours } from 'date-fns';

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

        // 3. Transform Data (Take the most recent/relevant flight)
        // The API returns multiple flights (past/future). We want the one closest to "now".
        const flight = data.data[0]; // Simplification: Take the first one for now, usually the most relevant active one

        return {
            flightNumber: flight.flight.iata,
            airline: flight.airline.name,
            origin: {
                code: flight.departure.iata,
                city: flight.departure.airport, // API often puts city in airport field or vice versa, need to be careful
                name: flight.departure.airport
            },
            destination: {
                code: flight.arrival.iata,
                city: flight.arrival.airport,
                name: flight.arrival.airport
            },
            departure: {
                scheduled: flight.departure.scheduled,
                gate: flight.departure.gate || 'TBD',
                terminal: flight.departure.terminal || 'TBD'
            },
            arrival: {
                scheduled: flight.arrival.scheduled,
                estimated: flight.arrival.estimated,
                gate: flight.arrival.gate || 'TBD',
                terminal: flight.arrival.terminal || 'TBD'
            },
            status: mapStatus(flight.flight_status),
            aircraft: flight.aircraft?.iata || 'Boeing 737' // Fallback if missing
        };

    } catch (error) {
        console.error('Search Flight Error:', error);
        throw error;
    }
};

function mapStatus(apiStatus) {
    // Map AviationStack status to our UI status
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
