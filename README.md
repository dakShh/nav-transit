# GTFS Transit Data Integration - Implementation Summary

## Overview

This project integrates Toronto TTC GTFS (General Transit Feed Specification) data into a Next.js application with PostgreSQL and PostGIS for building an AI-powered trip planner.

## Tech Stack

-   **Frontend:** Next.js 16 with TypeScript
-   **Database:** PostgreSQL 17 with PostGIS 3.5
-   **Map:** Google Maps via `@vis.gl/react-google-maps`
-   **AI:** Langchain with Google Gemini / OpenAI
-   **Import:** Node.js with `pg-copy-streams` for fast bulk imports

---

## Database Setup

### 1. Install PostgreSQL with PostGIS

-   Download PostgreSQL 17 from [postgresql.org](https://www.postgresql.org/download/)
-   Install PostGIS extension during setup

### 2. Create Database

```sql
CREATE DATABASE ttc_gtfs;
\c ttc_gtfs
CREATE EXTENSION postgis;
```

### 3. Run Schema

Execute `schema.sql` in pgAdmin Query Tool to create all tables with proper indexes and PostGIS geography columns.

### 4. Add Missing Columns

```sql
-- Agencies
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS agency_fare_url TEXT, ADD COLUMN IF NOT EXISTS cemv_support TEXT;

-- Routes
ALTER TABLE routes ADD COLUMN IF NOT EXISTS route_desc TEXT;

-- Trips
ALTER TABLE trips ADD COLUMN IF NOT EXISTS trip_short_name TEXT, ADD COLUMN IF NOT EXISTS wheelchair_accessible INTEGER;
ALTER TABLE trips ALTER COLUMN trip_short_name TYPE TEXT;

-- Stops
ALTER TABLE stops ADD COLUMN IF NOT EXISTS stop_desc TEXT, ADD COLUMN IF NOT EXISTS zone_id TEXT,
  ADD COLUMN IF NOT EXISTS stop_url TEXT, ADD COLUMN IF NOT EXISTS stop_timezone TEXT,
  ADD COLUMN IF NOT EXISTS wheelchair_boarding INTEGER;

-- Stop Times
ALTER TABLE stop_times ADD COLUMN IF NOT EXISTS stop_headsign TEXT,
  ADD COLUMN IF NOT EXISTS shape_dist_traveled DOUBLE PRECISION, ADD COLUMN IF NOT EXISTS timepoint INTEGER;
```

---

## GTFS Data Import

### 1. Download TTC GTFS Data

Source: [Toronto Open Data Portal](https://open.toronto.ca/dataset/merged-gtfs-ttc-routes-and-schedules/)

### 2. Extract Files

Place extracted `.txt` files in `public/gtfs/`:

-   agency.txt
-   routes.txt
-   calendar.txt
-   stops.txt
-   trips.txt
-   stop_times.txt
-   shapes.txt

### 3. Configure Environment

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ttc_gtfs
```

### 4. Install Dependencies

```bash
npm install pg pg-copy-streams
npm install -D @types/pg @types/pg-copy-streams tsx
```

### 5. Run Import Script

```bash
npm run import:gtfs:local
```

**Import Time:** ~2-5 minutes for full TTC dataset (~600K rows)

---

## Key Features Implemented

### Database

✅ PostGIS-enabled PostgreSQL with spatial indexes  
✅ Optimized schema with proper foreign keys and indexes  
✅ Geography columns for fast proximity queries  
✅ UPSERT support for re-runnable imports

### Import Script

✅ Uses PostgreSQL COPY for 10-100x faster imports  
✅ Handles empty values and type conversions  
✅ Deduplicates data automatically  
✅ Progress tracking for large files  
✅ Idempotent (can be re-run safely)

### Query Functions (`lib/db-aiven.ts`)

-   `getNearbyStops(lat, lon, radius)` - Find stops within radius using PostGIS
-   `getStopById(stopId)` - Get stop details
-   `getStopSchedule(stopId, date)` - Get departures for a stop
-   `getUpcomingDepartures(stopId)` - Get next N departures
-   `getRoutesForStop(stopId)` - Get all routes serving a stop
-   `searchStops(query)` - Search stops by name or code

---

## Database Schema Summary

| Table      | Description                   | Primary Key                   | Rows (approx) |
| ---------- | ----------------------------- | ----------------------------- | ------------- |
| agencies   | Transit agencies              | agency_id                     | 1             |
| routes     | Bus/subway routes             | route_id                      | ~220          |
| calendar   | Service schedules             | service_id                    | ~8            |
| stops      | Stop locations with geography | stop_id                       | ~12,500       |
| trips      | Individual trips              | trip_id                       | ~45,000       |
| stop_times | Arrival/departure times       | id (serial)                   | ~450,000      |
| shapes     | Route path geometry           | (shape_id, shape_pt_sequence) | ~85,000       |

---

## GTFS Data Structure

```
agencies → routes → trips → stop_times → stops
                      ↓
                  calendar
```

-   **Routes** define transit lines (e.g., "10 Van Horne")
-   **Trips** are individual instances of routes (e.g., "10 Van Horne westbound at 9:15am")
-   **Stop_times** connect trips to stops with arrival/departure times
-   **Calendar** defines which days trips operate

---

## Next Steps

### MVP Features to Build

1. **Map View** - Display nearby stops on Google Maps
2. **Stop Details Page** - Show schedules for selected stop
3. **AI Trip Planner** - Natural language route planning
4. **Search** - Find stops by name/code

### API Routes to Create

-   `GET /api/stops/nearby?lat={lat}&lon={lon}&radius={meters}`
-   `GET /api/stops/[stopId]`
-   `GET /api/stops/[stopId]/schedule`
-   `GET /api/search?q={query}`

### Components Needed

-   `<MapView>` - Google Maps with stop markers
-   `<StopMarker>` - Clickable stop pins
-   `<StopDetails>` - Stop info and schedule
-   `<ScheduleList>` - Departure times display
-   `<SearchBar>` - Stop search interface

---

## Troubleshooting

**Import fails with "extra data" error:**  
→ Check CSV headers match table columns, add missing columns with ALTER TABLE

**Import fails with "invalid input syntax for integer":**  
→ Empty strings in CSV, script now handles with FORCE_NULL option

**Duplicate key errors:**  
→ Script now uses UPSERT, safe to re-run

**PostGIS functions not found:**  
→ Run `CREATE EXTENSION postgis;` in your database

**Connection refused:**  
→ Check DATABASE_URL in .env.local and PostgreSQL is running

---

## Performance Notes

-   PostGIS spatial queries are **very fast** with GIST indexes
-   Nearby stops query: ~5-20ms for 500m radius
-   Schedule queries: ~10-50ms depending on date range
-   Database size: ~500-700 MB for full TTC dataset

---

## Data Refresh

GTFS data should be updated monthly:

```bash
# Download new GTFS data
# Replace files in public/gtfs/
# Re-run import (will update existing data)
npm run import:gtfs:local
```

---

## Resources

-   [GTFS Specification](https://gtfs.org/reference/static/)
-   [PostGIS Documentation](https://postgis.net/documentation/)
-   [Toronto Open Data](https://open.toronto.ca/)
-   [Google Maps API](https://developers.google.com/maps)

---

**Status:** ✅ Database ready with full TTC GTFS data  
**Next:** Build API routes and map interface
