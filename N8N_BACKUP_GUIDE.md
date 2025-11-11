# n8n Backup & Restore Guide

Complete guide for backing up and restoring your n8n workflows and data.

## Quick Start

### 1. Upload Scripts to Your VPS

Upload these files to your VPS:
- `n8n-backup.sh` - Backup script
- `n8n-restore.sh` - Restore script

```bash
# Make scripts executable
chmod +x n8n-backup.sh n8n-restore.sh
```

### 2. Create Your First Backup

```bash
./n8n-backup.sh
```

### 3. Restore from Backup (if needed)

```bash
./n8n-restore.sh
```

---

## What Gets Backed Up?

The backup includes:
- ✅ All workflows
- ✅ All credentials (encrypted)
- ✅ User accounts
- ✅ Executions history
- ✅ Settings and configurations
- ✅ SQLite database

---

## Detailed Instructions

### Manual Backup

#### Option 1: Using the Backup Script (Recommended)

```bash
# Run the backup script
./n8n-backup.sh
```

The script will:
- Create a timestamped backup file
- Store it in `/root/n8n-backups/`
- Automatically clean up old backups (keeps last 7)
- Show backup size and location

#### Option 2: Manual Backup Command

```bash
# Create backup directory
mkdir -p /root/n8n-backups

# Create backup
docker run --rm \
  -v n8n_data:/data \
  -v /root/n8n-backups:/backup \
  alpine tar czf /backup/n8n-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

**Replace `n8n_data` with your actual volume name if different.**

To find your volume name:
```bash
docker inspect n8n | grep -A 5 '"Mounts"'
```

### Restore from Backup

#### Option 1: Using the Restore Script (Recommended)

```bash
# Run the restore script
./n8n-restore.sh
```

The script will:
- Show you all available backups
- Let you choose which one to restore
- Ask for confirmation before proceeding
- Stop n8n, restore data, and restart it

#### Option 2: Manual Restore Command

```bash
# Stop n8n
docker stop n8n

# Restore the backup (replace YYYYMMDD-HHMMSS with your backup date)
docker run --rm \
  -v n8n_data:/data \
  -v /root/n8n-backups:/backup \
  alpine sh -c "cd /data && rm -rf * && tar xzf /backup/n8n-backup-YYYYMMDD-HHMMSS.tar.gz"

# Start n8n
docker start n8n
```

---

## Automated Backups

### Set Up Daily Automatic Backups

#### Method 1: Using Cron (Recommended)

```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /root/n8n-backup.sh >> /var/log/n8n-backup.log 2>&1

# Or for backups every 6 hours
0 */6 * * * /root/n8n-backup.sh >> /var/log/n8n-backup.log 2>&1

# Save and exit
```

Verify cron is set up:
```bash
crontab -l
```

View backup logs:
```bash
tail -f /var/log/n8n-backup.log
```

#### Method 2: Using Systemd Timer

Create a systemd service:
```bash
nano /etc/systemd/system/n8n-backup.service
```

Add this content:
```ini
[Unit]
Description=n8n Backup Service

[Service]
Type=oneshot
ExecStart=/root/n8n-backup.sh
```

Create a timer:
```bash
nano /etc/systemd/system/n8n-backup.timer
```

Add this content:
```ini
[Unit]
Description=n8n Backup Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start:
```bash
systemctl enable n8n-backup.timer
systemctl start n8n-backup.timer
systemctl status n8n-backup.timer
```

---

## Backup Storage Options

### Local Storage (Default)

Backups are stored in `/root/n8n-backups/` by default.

**Pros:**
- Fast and simple
- No external dependencies

**Cons:**
- If VPS fails, backups are lost
- Limited by disk space

### Remote Storage (Recommended for Production)

#### Option A: Copy to Another Server (SCP)

```bash
# Add to end of n8n-backup.sh or run separately
scp /root/n8n-backups/n8n-backup-*.tar.gz user@remote-server:/backups/
```

#### Option B: Upload to Cloud Storage

**Using AWS S3:**
```bash
# Install AWS CLI
apt-get install awscli

# Configure
aws configure

# Add to backup script
aws s3 cp /root/n8n-backups/n8n-backup-$(date +%Y%m%d).tar.gz s3://your-bucket/n8n-backups/
```

**Using Backblaze B2:**
```bash
# Install B2 CLI
pip install b2

# Authorize
b2 authorize-account <keyID> <applicationKey>

# Upload
b2 upload-file <bucketName> /root/n8n-backups/backup.tar.gz n8n-backups/backup.tar.gz
```

#### Option C: Sync to Dropbox/Google Drive

```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Configure rclone
rclone config

# Sync backups
rclone sync /root/n8n-backups remote:n8n-backups
```

---

## Backup Management

### List All Backups

```bash
ls -lh /root/n8n-backups/
```

### Check Backup Size

```bash
du -sh /root/n8n-backups/*
```

### Delete Old Backups Manually

```bash
# Delete backups older than 30 days
find /root/n8n-backups/ -name "n8n-backup-*.tar.gz" -mtime +30 -delete
```

### Test a Backup (Verify it's not corrupted)

```bash
tar -tzf /root/n8n-backups/n8n-backup-YYYYMMDD.tar.gz > /dev/null && echo "Backup OK" || echo "Backup corrupted"
```

---

## Troubleshooting

### Backup Script Fails

**Check if container is running:**
```bash
docker ps | grep n8n
```

**Check available disk space:**
```bash
df -h
```

**Check permissions:**
```bash
ls -l n8n-backup.sh
chmod +x n8n-backup.sh
```

### Restore Doesn't Work

**Verify backup file exists:**
```bash
ls -l /root/n8n-backups/
```

**Check backup integrity:**
```bash
tar -tzf /root/n8n-backups/backup-file.tar.gz
```

**Check Docker volume:**
```bash
docker volume ls
docker volume inspect n8n_data
```

### n8n Won't Start After Restore

**Check logs:**
```bash
docker logs n8n
```

**Restart container:**
```bash
docker restart n8n
```

**Check file permissions in volume:**
```bash
docker run --rm -v n8n_data:/data alpine ls -la /data
```

---

## Export Individual Workflows

You can also export individual workflows from the n8n UI:

1. Open n8n in browser
2. Go to **Workflows**
3. Click on the workflow you want to export
4. Click the **⋮** (three dots) menu
5. Select **Download**
6. Save the JSON file

To import:
1. Go to **Workflows**
2. Click **Import from File**
3. Select the JSON file

---

## Best Practices

1. **Backup Before Updates**
   - Always create a backup before updating n8n
   - Test the backup after creation

2. **Multiple Backup Locations**
   - Keep backups in at least 2 different locations
   - Use cloud storage for off-site backups

3. **Regular Testing**
   - Test restore process monthly
   - Verify backups are not corrupted

4. **Retention Policy**
   - Keep daily backups for 7 days
   - Keep weekly backups for 4 weeks
   - Keep monthly backups for 12 months

5. **Monitor Backup Size**
   - Large execution history increases backup size
   - Consider cleaning old executions regularly

6. **Secure Your Backups**
   - Backups contain encrypted credentials
   - Store in secure locations
   - Limit access to backup files

---

## Quick Reference Commands

```bash
# Create backup
./n8n-backup.sh

# Restore backup
./n8n-restore.sh

# List backups
ls -lh /root/n8n-backups/

# Manual backup
docker run --rm -v n8n_data:/data -v /root/n8n-backups:/backup alpine tar czf /backup/backup.tar.gz -C /data .

# Manual restore
docker stop n8n && \
docker run --rm -v n8n_data:/data -v /root/n8n-backups:/backup alpine sh -c "cd /data && rm -rf * && tar xzf /backup/backup.tar.gz" && \
docker start n8n

# Check n8n status
docker ps | grep n8n

# View n8n logs
docker logs n8n -f
```

---

## Support

For more information:
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Forum](https://community.n8n.io/)
- [Docker Volumes Documentation](https://docs.docker.com/storage/volumes/)
