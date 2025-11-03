#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
#
# Replace with your actual Amplify Hosting app ID
APP_ID=YOUR_APP_ID
# Replace with the bucket created from the amplify-setup script
DEPLOYMENT_BUCKET=USER-amplify-builds-6a5cbe5a

APP_ID=dwakdk54k0fgj
DEPLOYMENT_BUCKET=zambb-amplify-builds-cf7ab095

# Defaults
BRANCH_NAME=main
S3_KEY=amplify-deploy-$(date +%s).zip
NEXT_BUILD_DIR=build

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

cleanup() {
    if [ -f "amplify-deploy.zip" ]; then
        rm -f amplify-deploy.zip
        log_info "Cleaned up local zip file"
    fi
}

trap cleanup EXIT

# Find and change to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../package.json" ]; then
    cd "$SCRIPT_DIR/.."
    log_info "Changed to project root: $(pwd)"
elif [ -f "package.json" ]; then
    log_info "Running from project root: $(pwd)"
else
    log_error "Cannot find package.json. Run from project root or bin/ directory."
    exit 1
fi

# Validate prerequisites
log_info "Validating prerequisites..."
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed"
    exit 1
fi

if ! command -v zip &> /dev/null; then
    log_error "zip is not installed"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    log_error "jq is not installed"
    exit 1
fi

# Build Next.js app
log_info "Building Next.js app..."
if npm run build; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Verify build directory exists
if [ ! -d "$NEXT_BUILD_DIR" ]; then
    log_error "Build directory '$NEXT_BUILD_DIR' not found"
    exit 1
fi

# Create deployment zip
log_info "Creating deployment package..."
if (cd "$NEXT_BUILD_DIR" && zip -r ../amplify-deploy.zip . -q); then
    ZIP_SIZE=$(ls -lah amplify-deploy.zip | awk '{print $5}')
    log_success "Package created (${ZIP_SIZE})"
else
    log_error "Failed to create deployment package"
    exit 1
fi

# Upload to S3
log_info "Uploading to S3 (s3://$DEPLOYMENT_BUCKET/$S3_KEY)..."
if aws s3 cp amplify-deploy.zip "s3://$DEPLOYMENT_BUCKET/$S3_KEY" --no-progress; then
    log_success "Upload completed"
else
    log_error "S3 upload failed"
    exit 1
fi

# Start Amplify deployment
log_info "Starting Amplify deployment..."
DEPLOYMENT_OUTPUT=$(aws amplify start-deployment \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH_NAME" \
    --source-url "s3://$DEPLOYMENT_BUCKET/$S3_KEY" \
    --output json 2>&1)

echo "-----------------------------------------"
echo "$DEPLOYMENT_OUTPUT"
echo "-----------------------------------------"

if [ $? -eq 0 ]; then
    JOB_ID=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.jobSummary.jobId')

    # Get app URL
    APP_URL=$(aws amplify get-app --app-id "$APP_ID" --query 'app.defaultDomain' --output text)

    log_success "Deployment initiated successfully"
    echo
    log_info "Job ID: $JOB_ID"

    # Poll deployment status
    log_info "Monitoring deployment status..."
    while true; do
        STATUS=$(aws amplify get-job --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --job-id "$JOB_ID" --output json | jq -r '.job.summary.status')

        echo "  Status: $STATUS"

        case $STATUS in
            "SUCCEED")
                log_success "Deployment completed successfully!"
                break
                ;;
            "FAILED")
                log_error "Deployment failed"
                exit 1
                ;;
            "CANCELLED")
                log_error "Deployment was cancelled"
                exit 1
                ;;
            *)
                sleep 10
                ;;
        esac
    done

    echo
    log_info "S3 Package: s3://$DEPLOYMENT_BUCKET/$S3_KEY"
    log_info "Console: https://console.aws.amazon.com/amplify/apps"
    log_info "App URL: https://$BRANCH_NAME.$APP_URL"
else
    log_error "Amplify deployment failed"
    echo "$DEPLOYMENT_OUTPUT"
    exit 1
fi