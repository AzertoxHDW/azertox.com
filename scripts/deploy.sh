#!/bin/bash

# Deployment script for azertox.com
# Executed by Debian Runner -> Actions on Alpine Server (192.168.0.102)

set -e # Exit immediately if a command exits with a non-zero status

# --- Configuration ---
REMOTE_USER="root"
REMOTE_HOST="192.168.0.102"
REMOTE_SITE_DIR="azertox.com"
REMOTE_TARGET_PATH="/root/${REMOTE_SITE_DIR}"
REPO_URL="https://github.com/AzertoxHDW/azertox.com"

# Branch passed from GitHub Actions input, defaults to 'main'
BRANCH=${1:-main}

echo "=== Starting deployment of '$BRANCH' branch to $REMOTE_HOST ==="

# --- Step 1: Connect to Remote and Reset Directory ---
echo "Connecting to remote server to prepare directory..."
ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << EOF
    set -e
    
    # Delete the old website directory (Replicating manual script logic)
    if [ -d "$REMOTE_TARGET_PATH" ]; then
        echo "Removing old directory: $REMOTE_TARGET_PATH..."
        rm -rf "$REMOTE_TARGET_PATH"
    fi

    # Ensure parent directory exists
    mkdir -p "/root/"
    cd "/root/"

    # Clone the repository
    echo "Cloning repository..."
    git clone "$REPO_URL" "$REMOTE_SITE_DIR"
    cd "$REMOTE_SITE_DIR"

    # Checkout the specific branch
    echo "Checking out $BRANCH branch..."
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
EOF

# --- Step 2: Build the Application Remote ---
echo "Building application on remote server..."
ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << EOF
    set -e
    cd "$REMOTE_TARGET_PATH"

    echo "Installing dependencies..."
    # npm ci is faster/cleaner for CI/CD than npm install
    npm ci

    echo "Building application..."
    npm run build

    # Optional: Prune dev dependencies to save space
    # npm prune --production
EOF

# --- Step 3: Manage PM2 Process ---
echo "Managing application process..."
ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << EOF
    set -e
    
    # Check if app is running
    if pm2 list | grep -q "Website"; then
        echo "App is running. Reloading..."
        pm2 reload Website
    else
        echo "App not running. Starting..."
        # Start the app from the build folder
        pm2 start "$REMOTE_TARGET_PATH/build/index.js" --name "Website" --env production --max-memory-restart 300M
    fi

    # Save PM2 list so it survives reboots
    pm2 save
EOF

echo "=== Deployment Complete ==="