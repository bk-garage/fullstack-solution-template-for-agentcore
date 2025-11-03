#!/bin/bash
set -e

# Configuration
APP_NAME="${APP_NAME:-my-awesome-app}"
RANDOM_SUFFIX=$(openssl rand -hex 4)
BUCKET_NAME="${BUCKET_NAME:-$USER-amplify-builds-$RANDOM_SUFFIX}"
REGION="${AWS_REGION:-us-west-2}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

# Validate AWS CLI
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed"
    exit 1
fi

log_info "Creating Amplify app: $APP_NAME"

# Create Amplify app with manual deployment
APP_OUTPUT=$(aws amplify create-app \
    --name "$APP_NAME" \
    --platform WEB \
    --output json)

# Extract App ID using jq (preferred) or fallback to grep/sed
if command -v jq &> /dev/null; then
    APP_ID=$(echo "$APP_OUTPUT" | jq -r '.app.appId')
else
    APP_ID=$(echo "$APP_OUTPUT" | grep -o '"appId": "[^"]*"' | sed 's/.*"appId": "\([^"]*\)".*/\1/')
fi

log_success "Amplify app created successfully!"

log_info "Creating main branch"
aws amplify create-branch \
    --app-id "$APP_ID" \
    --branch-name "main" \
    --stage PRODUCTION \
    --output json > /dev/null

# log_info "Setting main branch as production branch"
# aws amplify update-branch \
#     --app-id "$APP_ID" \
#     --branch-name "main" \
#     --stage PRODUCTION \
#     --output json > /dev/null

log_success "Main branch created and set as production!"

log_info "Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

log_info "Creating bucket policy for Amplify access"
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AmplifyAccess",
            "Effect": "Allow",
            "Principal": {
                "Service": "amplify.amazonaws.com"
            },
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled
rm /tmp/bucket-policy.json

log_success "S3 bucket $BUCKET_NAME created successfully!"
log_info "App ID: $APP_ID"
log_info "Bucket: $BUCKET_NAME"
log_info "Console: https://console.aws.amazon.com/amplify/home#/$APP_ID"
echo "\n"
echo "-----------------------------------------------------"
log_info "Copy these values into the amplify-deploy.sh script:"
echo "APP_ID=$APP_ID"
echo "DEPLOYMENT_BUCKET=$BUCKET_NAME"
echo "-----------------------------------------------------"