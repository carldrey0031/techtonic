# Ubuntu 24.10 to 24.04 LTS Upgrade Instructions

## Overview
This guide helps you upgrade from Ubuntu 24.10 (Oracular) - which has reached end-of-life - to Ubuntu 24.04 LTS (Noble), which is supported until 2029.

## Prerequisites
- SSH access to your VPS
- Sudo privileges
- Stable internet connection
- At least 30-60 minutes for the upgrade process

## Step-by-Step Instructions

### 1. Transfer the Script to Your VPS

```bash
# On your local machine, copy the script to your VPS
scp ubuntu-upgrade-to-lts.sh ubuntu@vps-a12e3b2b:~/
```

### 2. Connect to Your VPS

```bash
ssh ubuntu@vps-a12e3b2b
```

### 3. Make the Script Executable

```bash
chmod +x ubuntu-upgrade-to-lts.sh
```

### 4. Run the Upgrade Script

```bash
sudo ./ubuntu-upgrade-to-lts.sh
```

### 5. Follow the Prompts
The upgrade process will:
- Fix repository sources
- Update package lists
- Install necessary upgrade tools
- Start the interactive upgrade to 24.04 LTS

During the upgrade, you'll be asked to:
- Confirm the upgrade (press 'y')
- Choose whether to restart services (recommend 'Yes')
- Handle configuration file conflicts (usually keep your current version)

### 6. Reboot After Upgrade

```bash
sudo reboot
```

### 7. Verify the Upgrade

After reboot, check your new Ubuntu version:

```bash
lsb_release -a
```

You should see:
```
Description:    Ubuntu 24.04 LTS
Release:        24.04
Codename:       noble
```

### 8. Fix Docker GPG Key Warning (Optional)

After the upgrade, if you still see Docker GPG warnings:

```bash
# Download and properly install Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Update Docker repository source to use new key location
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package lists
sudo apt update
```

## Troubleshooting

### If the upgrade fails:
1. Check `/var/log/dist-upgrade/` for error logs
2. Restore backup: `sudo cp /etc/apt/sources.list.backup.* /etc/apt/sources.list`
3. Try running `sudo apt --fix-broken install`

### If SSH disconnects during upgrade:
- The upgrade continues in the background
- Wait 5 minutes and try reconnecting
- Check upgrade status: `screen -r` (if using screen)

## Important Notes

⚠️ **Before You Start:**
- Backup important data
- Note down any custom configurations
- Ensure you have console access (VPS provider panel) in case SSH fails
- Consider creating a VPS snapshot if your provider supports it

✅ **After Upgrade:**
- All your files and configurations will be preserved
- Installed packages will be upgraded to 24.04 versions
- You'll receive security updates until 2029
- System should be more stable on LTS release

## What This Script Does

1. **Backs up** your current repository sources
2. **Fixes** the 404 error by pointing to old-releases temporarily
3. **Updates** package lists
4. **Installs** update-manager-core (if not present)
5. **Configures** system to upgrade to LTS
6. **Runs** the interactive do-release-upgrade process

## Support

If you encounter issues:
- Check Ubuntu forums: https://ubuntuforums.org/
- Ubuntu documentation: https://help.ubuntu.com/
- Your VPS provider's support
