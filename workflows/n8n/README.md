# N8N Workflows

This directory contains n8n workflow definitions for automating various tasks.

## Bolt Fleet Daily/Weekly Summary

**File:** `bolt-fleet-summary.json`

### Overview

This workflow automatically collects and aggregates Bolt Fleet data to provide daily and weekly summaries of fleet operations.

### Features

- **Automated Scheduling:** Runs every 5 minutes to collect fresh data
- **OAuth Authentication:** Securely authenticates with Bolt Fleet API using OAuth 2.0 client credentials flow
- **Parallel Data Collection:** Fetches multiple data points simultaneously:
  - Driver list
  - Daily payouts
  - Today's trip data
  - 7-day trip history
- **Data Aggregation:** Combines and summarizes data into actionable metrics

### Workflow Nodes

1. **Schedule** - Cron trigger that runs every 5 minutes
2. **Get Token** - Obtains OAuth access token from Bolt OIDC endpoint
3. **Drivers** - Fetches current driver list
4. **Daily Payouts** - Retrieves daily payout information
5. **Trips Today** - Gets aggregated trip data for today
6. **Trips 7d** - Gets aggregated trip data for the last 7 days
7. **Summary** - Processes and combines all data into a summary object

### Output Format

The workflow produces a summary object with the following structure:

```json
{
  "driver_count": 10,
  "today": {
    "trips": 45,
    "km": 523.5,
    "cash": 150.00,
    "in_app": 350.00,
    "payouts": { ... }
  },
  "week": {
    "trips": 312,
    "km": 3650.2,
    "cash": 1050.00,
    "in_app": 2450.00
  }
}
```

### Environment Variables Required

Before importing this workflow into n8n, ensure you have the following environment variables configured:

- `BOLT_CLIENT_ID` - Your Bolt Fleet API client ID
- `BOLT_CLIENT_SECRET` - Your Bolt Fleet API client secret

### API Endpoints Used

- **Token:** `https://oidc.bolt.eu/token`
- **Drivers:** `https://api.bolt.eu/fleet/drivers`
- **Payouts:** `https://api.bolt.eu/fleet/payouts/daily`
- **Trips (Daily):** `https://api.bolt.eu/fleet/trips/daily?aggregate=true`
- **Trips (7-day):** `https://api.bolt.eu/fleet/trips?days=7&aggregate=true`

### Import Instructions

1. Open your n8n instance
2. Click "Workflows" in the main menu
3. Click "Import from File" or "Import from URL"
4. Select the `bolt-fleet-summary.json` file
5. Configure the required environment variables
6. Activate the workflow

### Next Steps

After the workflow is running, you can:
- Add additional nodes to send summaries via email, Slack, or other channels
- Store the summary data in a database for historical tracking
- Create visualization dashboards
- Set up alerts based on specific thresholds

### Notes

- The workflow uses OAuth 2.0 with client credentials grant type
- API responses may vary based on your Bolt Fleet account permissions
- Adjust the cron schedule as needed for your use case
- The summary function can be customized to calculate additional metrics
