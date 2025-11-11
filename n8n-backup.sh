#!/bin/bash

# n8n Backup Script
# This script backs up your n8n data including workflows, credentials, and settings

# Configuration
BACKUP_DIR="/root/n8n-backups"
CONTAINER_NAME="n8n"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="n8n-backup-${DATE}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "================================"
echo "n8n Backup Script"
echo "================================"
echo "Backup started at: $(date)"
echo "Container: $CONTAINER_NAME"
echo "Backup directory: $BACKUP_DIR"
echo ""

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "ERROR: n8n container is not running!"
    exit 1
fi

# Get the volume name
VOLUME_NAME=$(docker inspect "$CONTAINER_NAME" | grep -A 5 '"Mounts"' | grep '"Name"' | head -1 | awk -F'"' '{print $4}')

if [ -z "$VOLUME_NAME" ]; then
    echo "ERROR: Could not find n8n volume!"
    echo "Trying alternative method..."
    VOLUME_NAME=$(docker inspect "$CONTAINER_NAME" | grep -oP '"Source":\s*"\K[^"]+' | head -1)
fi

echo "Volume: $VOLUME_NAME"
echo ""

# Create backup using docker run
echo "Creating backup..."
docker run --rm \
    -v "$VOLUME_NAME:/data" \
    -v "$BACKUP_DIR:/backup" \
    alpine tar czf "/backup/$BACKUP_FILE" -C /data .

# Check if backup was successful
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo ""
    echo "✓ Backup completed successfully!"
    echo "  File: $BACKUP_DIR/$BACKUP_FILE"
    echo "  Size: $BACKUP_SIZE"
    echo ""

    # List recent backups
    echo "Recent backups:"
    ls -lh "$BACKUP_DIR" | tail -n 5
    echo ""

    # Cleanup old backups (keep last 7 days)
    echo "Cleaning up old backups (keeping last 7)..."
    cd "$BACKUP_DIR" && ls -t n8n-backup-*.tar.gz | tail -n +8 | xargs -r rm
    echo "✓ Cleanup completed"
    echo ""

    echo "Backup finished at: $(date)"
else
    echo "✗ Backup failed!"
    exit 1
fi
