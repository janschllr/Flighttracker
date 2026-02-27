# ✈️ Flight Tracker

> **🇩🇪 Deutsch** | [🇬🇧 English](#-english)

## 🇩🇪 Deutsch

Ein moderner Echtzeit-Flugtracker mit einer eleganten Boarding-Pass-UI. Verfolge jeden Flug weltweit – einfach Flugnummer eingeben und Abflug, Ankunft, Gate-Infos und Flugstatus in Echtzeit erhalten.

### ✨ Features

- 🔍 **Flugsuche** – Flüge per IATA-Code suchen (z.B. LH123)
- 🎫 **Boarding-Pass UI** – Fluginformationen im Stil eines echten Boarding-Passes
- 📊 **Echtzeit-Fortschritt** – Fortschrittsbalken zeigt aktuelle Flugposition
- 🌐 **Zweisprachig** – Deutsch & Englisch wählbar
- 🌙 **Dark Mode** – Helles & dunkles Theme mit Toggle
- 🗺️ **Flugkarte** – Interaktive Leaflet-Karte mit Flugroute zwischen Abflug- und Zielflughafen
- 🕐 **Zeitzonen-Panel** – Live-Uhren für Abflug- und Zielort mit Zeitdifferenz
- ✈️ **Flugzeuginfo** – Detaillierte Flugzeugtyp-Erkennung und Fluginformationen
- 🕑 **Letzte Suchen** – Bis zu 5 zuletzt gesuchte Flüge als Schnellzugriff
- 💾 **Caching** – Client-seitiges Caching und URL-Parameter für direkten Flug-Link
- ✂️ **Abreiß-Animation** – Interaktiver Ticket-Stub mit Tear-Off-Effekt
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

A modern real-time flight tracker with an elegant boarding pass UI. Track any flight worldwide – just enter the flight number to get departure, arrival, gate info and flight status in real-time.

### ✨ Features

- 🔍 **Flight Search** – Search flights by IATA code (e.g. LH123)
- 🎫 **Boarding Pass UI** – Flight information styled like a real boarding pass
- 📊 **Real-time Progress** – Progress bar shows current flight position
- 🌐 **Bilingual** – German & English selectable
- 🌙 **Dark Mode** – Light & dark theme with toggle
- 🗺️ **Flight Map** – Interactive Leaflet map showing the flight route between departure and arrival airports
- 🕐 **Timezone Panel** – Live clocks for departure and destination with time difference
- ✈️ **Aircraft Info** – Detailed aircraft type recognition and flight information
- 🕑 **Recent Searches** – Up to 5 recently searched flights as quick access
- 💾 **Caching** – Client-side caching and URL parameters for direct flight links
- ✂️ **Tear-off Animation** – Interactive ticket stub with tear-off effect
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
