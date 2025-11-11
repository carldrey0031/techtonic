#!/bin/bash

# n8n Automated Backup Setup Script
# This script helps you set up automatic daily backups for n8n

echo "================================"
echo "n8n Auto-Backup Setup"
echo "================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (or use sudo)"
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "This script will set up automatic daily backups for your n8n instance."
echo ""
echo "Backup script location: $SCRIPT_DIR/n8n-backup.sh"
echo ""

# Check if backup script exists
if [ ! -f "$SCRIPT_DIR/n8n-backup.sh" ]; then
    echo "ERROR: n8n-backup.sh not found in $SCRIPT_DIR"
    exit 1
fi

# Make backup script executable
chmod +x "$SCRIPT_DIR/n8n-backup.sh"
echo "✓ Made backup script executable"

# Make restore script executable if it exists
if [ -f "$SCRIPT_DIR/n8n-restore.sh" ]; then
    chmod +x "$SCRIPT_DIR/n8n-restore.sh"
    echo "✓ Made restore script executable"
fi

echo ""
echo "Choose backup frequency:"
echo "1) Daily at 2:00 AM (recommended)"
echo "2) Every 12 hours (at 2 AM and 2 PM)"
echo "3) Every 6 hours"
echo "4) Custom schedule"
echo ""
read -p "Enter choice (1-4): " CHOICE

case $CHOICE in
    1)
        CRON_SCHEDULE="0 2 * * *"
        DESCRIPTION="Daily at 2:00 AM"
        ;;
    2)
        CRON_SCHEDULE="0 2,14 * * *"
        DESCRIPTION="Every 12 hours (2 AM and 2 PM)"
        ;;
    3)
        CRON_SCHEDULE="0 */6 * * *"
        DESCRIPTION="Every 6 hours"
        ;;
    4)
        echo ""
        echo "Enter cron schedule (e.g., '0 2 * * *' for daily at 2 AM):"
        read -p "Schedule: " CRON_SCHEDULE
        DESCRIPTION="Custom: $CRON_SCHEDULE"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Create log directory
mkdir -p /var/log/n8n
echo "✓ Created log directory: /var/log/n8n"

# Add to crontab
CRON_LINE="$CRON_SCHEDULE $SCRIPT_DIR/n8n-backup.sh >> /var/log/n8n/backup.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "n8n-backup.sh"; then
    echo ""
    echo "⚠️  A backup cron job already exists!"
    echo ""
    crontab -l | grep "n8n-backup.sh"
    echo ""
    read -p "Do you want to replace it? (yes/no): " REPLACE

    if [ "$REPLACE" != "yes" ]; then
        echo "Setup cancelled."
        exit 0
    fi

    # Remove existing cron job
    crontab -l | grep -v "n8n-backup.sh" | crontab -
    echo "✓ Removed old cron job"
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -

echo ""
echo "================================"
echo "✓ Setup Complete!"
echo "================================"
echo ""
echo "Backup schedule: $DESCRIPTION"
echo "Backup script: $SCRIPT_DIR/n8n-backup.sh"
echo "Backup location: /root/n8n-backups/"
echo "Log file: /var/log/n8n/backup.log"
echo ""
echo "To verify the cron job:"
echo "  crontab -l"
echo ""
echo "To view backup logs:"
echo "  tail -f /var/log/n8n/backup.log"
echo ""
echo "To create a backup now:"
echo "  $SCRIPT_DIR/n8n-backup.sh"
echo ""
echo "To restore from backup:"
echo "  $SCRIPT_DIR/n8n-restore.sh"
echo ""
