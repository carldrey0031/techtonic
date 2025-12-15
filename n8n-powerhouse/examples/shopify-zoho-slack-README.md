# Shopify → Zoho CRM + Slack Integration

**Pattern:** Webhook Processing with Idempotency
**Complexity:** Intermediate
**Services:** Shopify, Zoho CRM, Slack

## Use Case

When a customer places an order in your Shopify store:
1. Automatically sync the customer to Zoho CRM (create or update)
2. Send a notification to your team on Slack with order details

## Workflow Features

✅ **Duplicate Prevention** - Checks if customer exists before creating
✅ **Error Handling** - Graceful handling of missing data
✅ **OAuth Management** - n8n handles all authentication
✅ **Real-time Sync** - Instant trigger when order is placed

## Architecture

```
Shopify Order → Extract Data → Check Zoho → Create/Update → Slack Notify
```

### Node Breakdown

1. **Shopify Order Created** (Trigger)
   - Listens for `orders/create` webhook
   - Fires whenever a new order is placed

2. **Extract Customer Data** (Set Node)
   - Maps Shopify order data to normalized format
   - Extracts: email, name, phone, order details

3. **Check Customer Exists** (Zoho CRM)
   - Searches for contact by email
   - Returns existing contact if found

4. **Customer Exists?** (IF Node)
   - Checks if search returned results
   - Routes to create (new) or update (existing)

5. **Create New Contact** (Zoho CRM)
   - Creates contact with customer info
   - Adds order reference in description

6. **Update Existing Contact** (Zoho CRM)
   - Updates phone and adds order note
   - Maintains contact history

7. **Format Slack Message** (Set Node)
   - Creates formatted message with:
     - Customer name and email
     - Order number and total
     - Confirmation of Zoho sync

8. **Send Slack Notification** (Slack)
   - Posts to #sales channel
   - Uses "Shopify Bot" username

## Setup Instructions

### 1. Import Workflow

1. Download `shopify-zoho-slack-workflow.json`
2. In n8n, go to **Workflows** → **Import from File**
3. Select the JSON file

### 2. Configure Credentials

#### Shopify (OAuth 2.0)
1. In n8n: **Credentials** → **New** → **Shopify**
2. Follow OAuth flow to connect your store
3. Assign to "Shopify Order Created" node

#### Zoho CRM (OAuth 2.0)
1. In n8n: **Credentials** → **New** → **Zoho CRM**
2. Follow OAuth flow to connect your account
3. Assign to Zoho CRM nodes (Check, Create, Update)

#### Slack (OAuth 2.0)
1. In n8n: **Credentials** → **New** → **Slack**
2. Follow OAuth flow to connect workspace
3. Ensure bot has permission to post in #sales channel
4. Assign to "Send Slack Notification" node

### 3. Customize Settings

#### Change Slack Channel
Edit "Send Slack Notification" node:
```javascript
channel: "#your-channel-name"
```

#### Customize Contact Fields
Edit "Create New Contact" node to add more fields:
```javascript
additionalFields: {
  "email": "={{ $node['Extract Customer Data'].json.email }}",
  "phone": "={{ $node['Extract Customer Data'].json.phone }}",
  "mailingStreet": "={{ $json.shipping_address.address1 }}",
  "mailingCity": "={{ $json.shipping_address.city }}",
  "mailingState": "={{ $json.shipping_address.province }}",
  "mailingZip": "={{ $json.shipping_address.zip }}"
}
```

#### Customize Slack Message
Edit "Format Slack Message" node to change message format:
```javascript
slackMessage: "🛒 *New Order Alert*\n\n*Name:* {{ ... }}\n*Email:* {{ ... }}"
```

### 4. Activate Workflow

1. Click **Active** toggle in top-right
2. Test by placing a test order in Shopify
3. Verify customer appears in Zoho CRM
4. Check Slack notification appears in #sales

## Testing

### Test Order
1. Place a test order in Shopify (use Shopify's test mode)
2. Use a unique email address
3. Verify workflow execution in n8n
4. Check Zoho CRM for new contact
5. Check Slack for notification

### Test Duplicate Prevention
1. Place another order with same email
2. Verify workflow updates (not creates) contact
3. Check Zoho CRM - should be 1 contact, not 2
4. Verify Slack notification still sent

## Idempotency Strategy

**Problem:** Same customer ordering multiple times creates duplicates

**Solution:**
- Search Zoho CRM by email before creating
- If exists → Update contact
- If not exists → Create contact
- Both paths lead to Slack notification

**Key Node:** "Customer Exists?" IF node
- Checks if search returned results (`length > 0`)
- True path → Update
- False path → Create

## Error Handling

### Missing Customer Data
- Shopify provides minimal customer info for guest checkouts
- Workflow handles missing phone gracefully (Zoho accepts null)

### Zoho API Limits
- Zoho CRM: 5,000 API calls/day (free tier)
- This workflow uses 1-2 calls per order
- Safe for 2,500+ orders/day

### Slack Rate Limits
- Slack: 1 message/second
- n8n queues automatically if exceeded

## Production Considerations

### Add Error Notifications
1. Add **Error Trigger** workflow
2. Send error notifications to #dev-alerts
3. Log errors for debugging

### Monitor Execution
1. Set up n8n execution monitoring
2. Alert on failed executions
3. Review execution logs weekly

### Scale Considerations
- Workflow handles 1,000+ orders/day
- Zoho API limit is main constraint
- Consider batching if > 2,500 orders/day

## Customization Ideas

### Add Deal Creation
After contact sync, create Deal in Zoho:
```
Add node after "Create/Update Contact":
→ Zoho CRM: Create Deal
  - Deal Name: "Order #{{ orderNumber }}"
  - Amount: {{ totalPrice }}
  - Stage: "Closed Won"
  - Contact: {{ contactId }}
```

### Add Email Confirmation
Send customer confirmation email:
```
Add node after Slack notification:
→ Gmail: Send Email
  - To: {{ email }}
  - Subject: "Order Confirmation #{{ orderNumber }}"
  - Body: "Thank you for your order..."
```

### Add Analytics
Track orders in database:
```
Add node parallel to Slack:
→ Postgres: Insert
  - Table: order_analytics
  - Columns: order_id, customer_email, total, timestamp
```

## Troubleshooting

### Workflow not triggering
- Check Shopify webhook is active (Shopify Settings → Notifications)
- Verify n8n webhook URL is registered
- Check workflow is Active in n8n

### Customer not appearing in Zoho
- Check Zoho credentials are valid
- Verify email field is populated (required)
- Check Zoho CRM execution log for errors

### Slack notification not sent
- Verify bot has permission to post in channel
- Check channel name starts with `#`
- Ensure Slack credentials are valid

### Duplicate contacts created
- Check email comparison is case-insensitive
- Verify search criteria in "Check Customer Exists"
- Test with exact email from Shopify

## Related Workflows

- **Shopify Order → Email Receipt** - Send custom order confirmations
- **Shopify → Google Sheets** - Track orders in spreadsheet
- **Zoho CRM → Slack Daily Summary** - Daily sales report

## Support

For issues or questions:
- n8n Community: https://community.n8n.io
- n8n Docs: https://docs.n8n.io
- This repo issues: [Link to issues]

## License

MIT - Free to use and modify
