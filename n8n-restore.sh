#!/bin/bash

# n8n Restore Script
# This script restores your n8n data from a backup

# Configuration
BACKUP_DIR="/root/n8n-backups"
CONTAINER_NAME="n8n"

echo "================================"
echo "n8n Restore Script"
echo "================================"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "ERROR: Backup directory does not exist: $BACKUP_DIR"
    exit 1
fi

# List available backups
echo "Available backups:"
echo ""
ls -lh "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | awk '{print NR". "$9" ("$5")"}'

# Count backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/n8n-backup-*.tar.gz 2>/dev/null | wc -l)

if [ "$BACKUP_COUNT" -eq 0 ]; then
    echo "ERROR: No backups found in $BACKUP_DIR"
    exit 1
fi

echo ""
echo "Enter the number of the backup to restore (or full path to backup file):"
read -r BACKUP_CHOICE

# If user entered a number, get the corresponding file
if [[ "$BACKUP_CHOICE" =~ ^[0-9]+$ ]]; then
    BACKUP_FILE=$(ls -1 "$BACKUP_DIR"/n8n-backup-*.tar.gz | sed -n "${BACKUP_CHOICE}p")
else
    BACKUP_FILE="$BACKUP_CHOICE"
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo ""
echo "Selected backup: $BACKUP_FILE"
echo ""
echo "⚠️  WARNING: This will REPLACE all current n8n data!"
echo "Current workflows and credentials will be overwritten."
echo ""
echo "Are you sure you want to continue? (yes/no)"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Stop n8n container
echo ""
echo "Stopping n8n container..."
docker stop "$CONTAINER_NAME"

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to stop container!"
    exit 1
fi

# Get the volume name
VOLUME_NAME=$(docker inspect "$CONTAINER_NAME" | grep -A 5 '"Mounts"' | grep '"Name"' | head -1 | awk -F'"' '{print $4}')

if [ -z "$VOLUME_NAME" ]; then
    echo "Trying alternative method to find volume..."
    VOLUME_NAME=$(docker inspect "$CONTAINER_NAME" | grep -oP '"Source":\s*"\K[^"]+' | head -1)
fi

echo "Volume: $VOLUME_NAME"
echo ""

# Restore backup
echo "Restoring backup..."
docker run --rm \
    -v "$VOLUME_NAME:/data" \
    -v "$(dirname $BACKUP_FILE):/backup" \
    alpine sh -c "cd /data && rm -rf * && tar xzf /backup/$(basename $BACKUP_FILE)"

if [ $? -eq 0 ]; then
    echo "✓ Restore completed successfully!"
else
    echo "✗ Restore failed!"
    docker start "$CONTAINER_NAME"
    exit 1
fi

# Start n8n container
echo ""
echo "Starting n8n container..."
docker start "$CONTAINER_NAME"

if [ $? -eq 0 ]; then
    echo "✓ n8n container started successfully!"
    echo ""
    echo "Restore finished at: $(date)"
    echo ""
    echo "Please wait a few seconds for n8n to fully start, then access it in your browser."
else
    echo "✗ Failed to start container!"
    exit 1
fi
