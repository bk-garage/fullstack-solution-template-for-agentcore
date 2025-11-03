#!/bin/bash

# Set this to the Amplify-generated URL, output from the amplify-deploy script.
CALLBACK_URL=http://localhost:3001

# Validate callback URL is set
if [ -z "$CALLBACK_URL" ]; then
  echo "Error: CALLBACK_URL variable is not set. Please update the script with your callback URL."
  echo "Example: CALLBACK_URL="https://main.d3nn4rt8q6t5la.amplifyapp.com""
  exit 1
fi

# Create the User Pool
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "react-spa-user-pool" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  }' \
  --username-attributes email \
  --auto-verified-attributes email \
  --admin-create-user-config '{
    "AllowAdminCreateUserOnly": true
  }' \
  --query 'UserPool.Id' \
  --output text)

# Create the User Pool Client for React SPA
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-name "react-spa-client" \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --supported-identity-providers COGNITO \
  --callback-urls "http://localhost:3000" "$CALLBACK_URL" \
  --logout-urls "http://localhost:3000" "$CALLBACK_URL" \
  --allowed-o-auth-flows code \
  --allowed-o-auth-scopes openid email profile \
  --allowed-o-auth-flows-user-pool-client \
  --query 'UserPoolClient.ClientId' \
  --output text)

# Create the User Pool Domain with managed login branding
DOMAIN_PREFIX="react-spa-$(date +%s)"
aws cognito-idp create-user-pool-domain \
  --domain "$DOMAIN_PREFIX" \
  --user-pool-id "$USER_POOL_ID" \
  --managed-login-version 2

# Create managed login branding (enables branding editor)
aws cognito-idp create-managed-login-branding \
  --user-pool-id "$USER_POOL_ID" \
  --client-id "$CLIENT_ID" \
  --use-cognito-provided-values

# Get the current AWS region
REGION=$(aws configure get region)

# Output environment variables
echo "# Add these to your .env.local file:"
echo "NEXT_PUBLIC_COGNITO_REGION=$REGION"
echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID"
echo "NEXT_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID"
echo "NEXT_PUBLIC_COGNITO_REDIRECT_URI=$CALLBACK_URL"
echo ""
echo "# Managed Login URL: https://$DOMAIN_PREFIX.auth.$REGION.amazoncognito.com"
echo "# Branding editor is now available in the AWS Console"
