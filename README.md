# ✈️ Flight Tracker

> **🇩🇪 Deutsch** | [🇬🇧 English](#-english)

## 🇩🇪 Deutsch

Ein moderner Echtzeit-Flugtracker mit einer eleganten Boarding-Pass-UI. Verfolge jeden Flug weltweit – einfach Flugnummer eingeben und Abflug, Ankunft, Gate-Infos und Flugstatus in Echtzeit erhalten. Das Interface passt sich dynamisch an die Marke der jeweiligen Airline an.

### ✨ Features

- 🔍 **Flugsuche** – Flüge per IATA-Code suchen (z.B. LH123)
- 🎫 **Boarding-Pass UI** – Fluginformationen im Stil eines echten Boarding-Passes
- 📊 **Echtzeit-Fortschritt** – Fortschrittsbalken zeigt aktuelle Flugposition
- 🎨 **Dynamic Airline UI** – Das Ticket, das Suchfeld und Elemente der Seite passen sich automatisch der dominierenden Farbe des Airline-Logos an
- 🌐 **Zweisprachig** – Deutsch & Englisch wählbar
- 🌙 **Dark Mode** – Helles & dunkles Theme mit Toggle
- 🗺️ **Flugkarte** – Interaktive Leaflet-Karte mit Flugroute zwischen Abflug- und Zielflughafen
- 🕐 **Zeitzonen-Panel** – Live-Uhren für Abflug- und Zielort mit Zeitdifferenz
- ✈️ **Flugzeuginfo** – Detaillierte Flugzeugtyp-Erkennung und intelligente Fluginformationen mit Fehlerkorrektur
- 💺 **Sitzplatz-Simulation** – Generiert konsistent für jeden Flug eine zufällige, passende Buchungsklasse und Sitzplatznummer
- 🕑 **Letzte Suchen** – Bis zu 5 zuletzt gesuchte Flüge als Schnellzugriff
- 💾 **Caching** – Client-seitiges Caching und URL-Parameter für direkten Flug-Link
- ✂️ **Abreiß-Animation** – Interaktiver Ticket-Stub mit Tear-Off-Effekt, dynamischem Schatten und Stanzlöchern
- 🎮 **Easter Egg** – Flappy Plane Minispiel im Barcode versteckt
- 🐳 **Docker Support** – Containerisierte Deployment-Option

### 🛠️ Tech Stack

| Technologie | Zweck |
|---|---|
| React 19 | Frontend Framework |
| Vite 7 | Build Tool & Dev Server |
| Tailwind CSS 3 | Styling |
| Leaflet + React-Leaflet | Interaktive Flugkarte |
| AviationStack API | Flugdaten |
| fast-average-color | Dynamische Farb-Extraktion aus Airline Logos |
| lucide-react | UI Icons |
| Docker + Nginx | Deployment |

### 🚀 Setup

```bash
# Repository klonen
git clone https://github.com/janschllr/Flighttracker.git
cd Flighttracker

# Abhängigkeiten installieren
npm install

# API-Key konfigurieren
echo "VITE_AVIATION_STACK_KEY=dein_api_key" > .env

# Entwicklungsserver starten
npm run dev
```

> 💡 Einen kostenlosen API-Key gibt es bei [aviationstack.com](https://aviationstack.com/)

### 🐳 Docker

```bash
docker build -t flight-tracker .
docker run -p 8080:80 --env-file .env flight-tracker
```

---

## 🇬🇧 English

A modern real-time flight tracker with an elegant boarding pass UI. Track any flight worldwide – just enter the flight number to get departure, arrival, gate info and flight status in real-time. The interface dynamically adapts to the brand color of the specific airline.

### ✨ Features

- 🔍 **Flight Search** – Search flights by IATA code (e.g. LH123)
- 🎫 **Boarding Pass UI** – Flight information styled like a real boarding pass
- 📊 **Real-time Progress** – Progress bar shows current flight position
- 🎨 **Dynamic Airline UI** – The ticket, search bar and page elements automatically adapt to the dominant color of the airline's logo
- 🌐 **Bilingual** – German & English selectable
- 🌙 **Dark Mode** – Light & dark theme with toggle
- 🗺️ **Flight Map** – Interactive Leaflet map showing the flight route between departure and arrival airports
- 🕐 **Timezone Panel** – Live clocks for departure and destination with time difference
- ✈️ **Aircraft Info** – Detailed aircraft type recognition and intelligent flight information with error correction
- 💺 **Seat Simulation** – Consistently generates a random, appropriate booking class and seat number for each flight
- 🕑 **Recent Searches** – Up to 5 recently searched flights as quick access
- 💾 **Caching** – Client-side caching and URL parameters for direct flight links
- ✂️ **Tear-off Animation** – Interactive ticket stub with tear-off effect, dynamic shadow, and perforation holes
- 🎮 **Easter Egg** – Flappy Plane mini-game hidden in the barcode
- 🐳 **Docker Support** – Containerized deployment option

### 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend Framework |
| Vite 7 | Build Tool & Dev Server |
| Tailwind CSS 3 | Styling |
| Leaflet + React-Leaflet | Interactive Flight Map |
| AviationStack API | Flight Data |
| fast-average-color | Dynamic color extraction from airline logos |
| lucide-react | UI Icons |
| Docker + Nginx | Deployment |

### 🚀 Setup

```bash
# Clone the repository
git clone https://github.com/janschllr/Flighttracker.git
cd Flighttracker

# Install dependencies
npm install

# Configure API key
echo "VITE_AVIATION_STACK_KEY=your_api_key" > .env

# Start development server
npm run dev
```

> 💡 Get a free API key at [aviationstack.com](https://aviationstack.com/)

### 🐳 Docker

```bash
docker build -t flight-tracker .
docker run -p 8080:80 --env-file .env flight-tracker
```

---

## 📝 Lizenz / License

MIT
