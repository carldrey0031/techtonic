#!/bin/bash

# Ubuntu 24.10 (Oracular) to 24.04 LTS (Noble) Upgrade Script
# This script fixes repository issues and upgrades to Ubuntu 24.04 LTS

set -e

echo "=========================================="
echo "Ubuntu Upgrade Script"
echo "From: Ubuntu 24.10 (Oracular)"
echo "To:   Ubuntu 24.04 LTS (Noble)"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: This script must be run with sudo"
    exit 1
fi

echo "[1/6] Backing up current sources..."
cp /etc/apt/sources.list /etc/apt/sources.list.backup.$(date +%Y%m%d) 2>/dev/null || true
if [ -d /etc/apt/sources.list.d/ ]; then
    cp -r /etc/apt/sources.list.d /etc/apt/sources.list.d.backup.$(date +%Y%m%d) 2>/dev/null || true
fi
echo "✓ Backup complete"
echo ""

echo "[2/6] Fixing repository sources (pointing to old-releases)..."
# Fix security repository
if [ -f /etc/apt/sources.list.d/ubuntu-security.sources ]; then
    sed -i 's/security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list.d/ubuntu-security.sources
fi
# Also check traditional sources.list
if [ -f /etc/apt/sources.list ]; then
    sed -i 's/security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list
fi
echo "✓ Repository sources fixed"
echo ""

echo "[3/6] Updating package lists..."
apt update
echo "✓ Package lists updated"
echo ""

echo "[4/6] Installing/updating essential packages..."
apt install -y update-manager-core
echo "✓ Essential packages ready"
echo ""

echo "[5/6] Preparing for upgrade..."
# Ensure proper configuration
sed -i 's/Prompt=.*/Prompt=lts/' /etc/update-manager/release-upgrades 2>/dev/null || true
echo "✓ Configuration ready"
echo ""

echo "[6/6] Starting upgrade to Ubuntu 24.04 LTS..."
echo ""
echo "=========================================="
echo "IMPORTANT NOTES:"
echo "1. The upgrade process will ask for confirmation"
echo "2. You may need to restart services during upgrade"
echo "3. A system reboot will be required after upgrade"
echo "4. The upgrade may take 30-60 minutes"
echo "=========================================="
echo ""
echo "Starting do-release-upgrade in 5 seconds..."
sleep 5

do-release-upgrade

echo ""
echo "=========================================="
echo "Upgrade process completed!"
echo "Please reboot your system when ready:"
echo "  sudo reboot"
echo "=========================================="
