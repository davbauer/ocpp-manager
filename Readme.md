# davbauer/ocpp-manager

<div style="text-align: center;">
  <img src="./assets/Logo.svg" alt="OCPP Manager Logo" height="80">
</div>

## Build Status

| Branch | Build Status                                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| main   | ![Build Status - main](https://github.com/davbauer/ocpp-manager/actions/workflows/push-image-main.yml/badge.svg?branch=main) |

## Preview

![Preview](./assets/preview.webp)

## Overview

> [!WARNING]  
> This project is newly created and in its early stages of development. It may undergo significant changes, and there may still be unresolved issues or incomplete features.
> Use at your own risk and feel free to contribute or report any issues you encounter!

OCPP Manager is an application built with [HonoJS](https://hono.dev/) for the backend and [SvelteKit](https://svelte.dev/) for the frontend.

### Features:

- **Charging Station Management**: Add and monitor charging stations and their associated connectors in real-time.
- **RFID Card Setup**: Manage RFID cards with friendly names and set up expiring or permanent authorizations.
- **Charge Authorization Control**: Fine-grained access control - assign specific chargers to RFID cards, with optional expiry dates.
- **Transaction Records**: Track all charging sessions with detailed energy consumption, duration, and cost estimates.
- **CSV Export**: Export transaction data to CSV format for accounting, billing, or analysis purposes.
- **Real-time Monitoring**: Live updates on charger status, connector availability, and ongoing transactions.
- **Administration Tools**: Configure system settings and manage application-wide preferences.
- **Comprehensive Logging**: Built-in logging system for troubleshooting and audit trails.

## Docker Compose Example

For a simpler setup, use the following `docker-compose.yml` configuration:

```yaml
services:
  ocpp-manager:
    container_name: ocpp-manager-server
    image: ghcr.io/davbauer/ocpp-manager:latest
    environment:
      DATABASE_URL: postgres://root:password@postgres:5432/app
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    volumes:
      - logs_data:/workspace/api/logs
    restart: unless-stopped
    networks:
      - ocpp_net

  postgres:
    container_name: ocpp-manager-postgres
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql
    restart: unless-stopped
    networks:
      - ocpp_net

volumes:
  postgres_data:
    name: ocpp-manager_postgres_data
  logs_data:
    name: ocpp-manager_logs_data

networks:
  ocpp_net:
    driver: bridge
```

This will pull the latest image of the OCPP Manager from GitHub Container Registry and set up the required PostgreSQL database.

1. **Accessing the Server:** Once the services are running, the OCPP Manager server will be available shortly at `http://HOSTED_IP:3000`. You can replace `3000:3000` in the `docker-compose.yml` file with your desired port to change the exposed port.
2. **Startup Delay:** The PostgreSQL database may require a few seconds to initialize. Allow the webserver an additional ~10 seconds for the webserver to come online to accomodate for the database startup.

## Connecting Chargers and Using Authorization

### Steps to Connect Chargers from Vendors (e.g., go-e or ABL)

Navigate to the monitoring page and click on the tutorial button.
The OCPP endpoint will be displayed. The tutorial will mention a `shortcode`.

**What is a Shortcode?**

A `shortcode` is a unique identifier that can be a charging station's serial number or a newly created name. Make sure to append this `shortcode` to the OCPP endpoint.

Once set up, the charging station will start sending heartbeat requests to the OCPP Manager. Within a few minutes, the charger should appear in the interface.

Click `"Edit"` on the charger to accept it. After some minutes, the current state of the connectors and the charger itself should appear.

_Your charger is now connected!_

### How to Use Authorization

The authorization system allows you to control which RFID cards can access which charging stations, with optional expiry dates for time-limited access.

**Managing RFID Tags:**
- Navigate to the "RFID Tags" page to view all registered cards
- Edit tags to update friendly names
- View when each tag was issued and last used

**Setting Up Charge Authorizations:**
- Go to the "Charge Authorizations" page
- Tags are grouped by card for easy management
- Add charger access for each RFID tag individually
- Set optional expiry dates for temporary access
- Edit or remove access at any time

#### Anonymous Charging

Start charging. It will fail the first time, and a virtual RFID tag will appear in the RFID tag tab.

Assign this virtual tag to a charge authorization.

Once the authorization is added, you should be allowed to charge.

#### RFID Charging

Hold the RFID tag near the charging station. It should appear shortly in the interface, just like the anonymous tag.

Assign the tag to a charge authorization, and you're ready to go!

#### Transactions

While transactions are running, they will be estimated in real-time based on meter values.

Once completed or aborted, the charger will update the transaction with the actual energy consumption and final details.

**Transaction Features:**
- View all transactions with filtering by charger, connector, RFID tag, and date range
- Export filtered transactions to CSV for billing or analysis
- Real-time energy consumption estimates for active charging sessions
- Detailed meter readings (start/stop values in Wh)
- Duration tracking and payment status
- Delete transactions with confirmation prompts

## Development Setup

1. Rename `.env.example` files in both the `app` and `api` directories to `.env`.

2. Install dependencies and build the frontend:

   ```bash
   cd app
   yarn
   yarn build
   cd ../
   ```

3. Start the local development PostgreSQL database:

   ```bash
   cd local
   docker compose up
   ```

4. In a new terminal, apply database migrations and start the API:

   ```bash
   cd api
   yarn
   yarn migrate:run
   yarn dev
   ```

Now you're ready to start developing!
