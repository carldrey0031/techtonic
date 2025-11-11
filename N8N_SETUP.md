# n8n Docker Setup and Password Management Guide

This guide will help you set up n8n with Docker and manage passwords on your Linux VPS.

## Quick Start

### 1. Initial Setup

```bash
# Start n8n
docker-compose up -d

# Check if it's running
docker-compose ps
```

n8n will be accessible at `http://localhost:5678` (or your VPS IP:5678)

### 2. First Time Access

When you first access n8n, you'll be prompted to create an **Owner Account**. This is the main administrative account.

1. Open your browser and navigate to `http://your-vps-ip:5678`
2. Fill in the registration form:
   - Email
   - Password (choose a strong password)
   - First Name
   - Last Name

## Password Management

### Method 1: Change Owner Password via UI (Recommended)

1. Log into n8n
2. Click on your user icon in the bottom left
3. Go to **Settings** → **Personal**
4. Click **Change Password**
5. Enter your current password and new password
6. Save changes

### Method 2: Reset Password via Command Line

If you've forgotten your password, you can reset it using the n8n CLI:

```bash
# Access the n8n container
docker-compose exec n8n /bin/sh

# Reset the owner password (you'll be prompted for email and new password)
n8n user-management:reset-password --email=your-email@example.com

# Exit the container
exit
```

### Method 3: Change Basic Authentication Password (Optional)

If you've enabled HTTP Basic Authentication for an additional security layer:

1. Edit the `.env` file:
   ```bash
   nano .env
   ```

2. Update these values:
   ```
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=your-username
   N8N_BASIC_AUTH_PASSWORD=your-new-password
   ```

3. Restart n8n:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Complete Password Reset (If Locked Out)

If you're completely locked out and need to start fresh:

```bash
# Stop n8n
docker-compose down

# Remove the database (WARNING: This deletes all workflows and credentials!)
docker volume rm techtonic_n8n_data

# Start n8n again (this creates a fresh database)
docker-compose up -d

# You'll be prompted to create a new owner account
```

## Useful Commands

### Check n8n Logs
```bash
docker-compose logs -f n8n
```

### Restart n8n
```bash
docker-compose restart n8n
```

### Stop n8n
```bash
docker-compose down
```

### Update n8n to Latest Version
```bash
docker-compose pull
docker-compose up -d
```

### Backup Your n8n Data
```bash
# Backup the volume
docker run --rm \
  -v techtonic_n8n_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/n8n-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore n8n Data
```bash
# Stop n8n
docker-compose down

# Restore from backup
docker run --rm \
  -v techtonic_n8n_data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && tar xzf /backup/n8n-backup-YYYYMMDD.tar.gz"

# Start n8n
docker-compose up -d
```

## Security Best Practices

1. **Use Strong Passwords**: Use a password manager to generate strong, unique passwords
2. **Keep Encryption Key Safe**: Never change `N8N_ENCRYPTION_KEY` after initial setup - it's used to encrypt credentials
3. **Regular Backups**: Schedule regular backups of your n8n data
4. **Update Regularly**: Keep n8n updated to the latest version
5. **Use HTTPS**: In production, always use HTTPS (setup reverse proxy with nginx/caddy)
6. **Firewall**: Restrict port 5678 access to only trusted IPs if possible

## Environment Configuration

The `.env` file contains important configuration:

- `N8N_HOST`: Your domain name or IP
- `N8N_PROTOCOL`: Use `https` in production
- `N8N_ENCRYPTION_KEY`: **NEVER CHANGE THIS** after first use
- `N8N_BASIC_AUTH_*`: Optional additional HTTP authentication layer

## Troubleshooting

### Can't Access n8n
```bash
# Check if container is running
docker-compose ps

# Check logs for errors
docker-compose logs n8n

# Check if port is open
netstat -tulpn | grep 5678
```

### Forgot Password
Use Method 2 above (Reset Password via Command Line)

### Database Issues
```bash
# Check database file permissions
docker-compose exec n8n ls -la /home/node/.n8n/
```

## Production Deployment

For production use on a VPS with a domain:

1. Update `.env`:
   ```
   N8N_HOST=n8n.yourdomain.com
   N8N_PROTOCOL=https
   WEBHOOK_URL=https://n8n.yourdomain.com/
   N8N_SECURE_COOKIE=true
   ```

2. Set up reverse proxy (nginx/Caddy) with SSL certificate
3. Configure firewall to allow only 80/443
4. Enable regular backups
5. Consider using PostgreSQL instead of SQLite for better performance

## Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Forum](https://community.n8n.io/)
- [n8n GitHub](https://github.com/n8n-io/n8n)
