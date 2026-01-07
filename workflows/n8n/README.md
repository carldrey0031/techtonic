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

1. **Schedule** - Schedule Trigger that runs every 5 minutes
2. **Get Token** - HTTP Request node that obtains OAuth access token from Bolt OIDC endpoint
3. **Drivers** - HTTP Request node that fetches current driver list
4. **Daily Payouts** - HTTP Request node that retrieves daily payout information
5. **Trips Today** - HTTP Request node that gets aggregated trip data for today
6. **Trips 7d** - HTTP Request node that gets aggregated trip data for the last 7 days
7. **Merge Data** - Merge node that combines all API responses using "Merge By Position" mode
8. **Summary** - Code node that processes and combines all data into a summary object

### Workflow Structure

The workflow uses parallel execution with proper data merging:
- After obtaining the OAuth token, four HTTP requests execute in parallel
- The **Merge Data** node combines all four responses by position
- The **Summary** node receives the merged data and intelligently identifies each data source
- Data is matched by properties (e.g., `drivers` array, `trips` array) for reliability

### Output Format

The workflow produces a summary object with the following structure:

```json
{
  "driver_count": 10,
  "today": {
    "trips": 45,
    "km": "523.50",
    "cash": "150.00",
    "in_app": "350.00",
    "total": "500.00",
    "payouts": { ... }
  },
  "week": {
    "trips": 312,
    "km": "3650.20",
    "cash": "1050.00",
    "in_app": "2450.00",
    "total": "3500.00"
  },
  "timestamp": "2024-12-11T12:34:56.789Z"
}
```

**Note:** All numeric values (km, cash, in_app, total) are formatted to 2 decimal places as strings.

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

### Technical Notes

- **Node Versions**: Uses latest n8n node versions (HTTP Request v4.1, Schedule Trigger v1.1, Code v2)
- **Authentication**: OAuth 2.0 with client credentials grant type
- **Execution**: Parallel execution for API calls to minimize total execution time
- **Code Node**: Uses modern `$input.all()` syntax instead of legacy `items` array
- API responses may vary based on your Bolt Fleet account permissions
- Adjust the schedule interval as needed for your use case (default: 5 minutes)
- The summary code can be customized to calculate additional metrics or change output format

### Troubleshooting

**Import Errors:**
- Ensure you're using n8n version 1.0 or later (tested on v2.0.3)
- Check that all required node types are available in your n8n instance
- Verify the JSON file is not corrupted
- Try importing via "Workflows > Import from File" rather than copy-paste

**JavaScript Syntax Errors:**
- The workflow uses a Merge node to properly combine parallel API responses
- If you modify the Code node, be careful with arrow functions and template strings
- The Code node uses intelligent property-based matching to identify data sources

**Execution Errors:**
- Verify environment variables (`BOLT_CLIENT_ID` and `BOLT_CLIENT_SECRET`) are set correctly
- Check that your Bolt Fleet API credentials have the necessary permissions
- Test each node individually to isolate any API endpoint issues
- Review the Bolt API documentation if responses don't match expected structure
