import { WebStorageStateStore } from "oidc-client-ts"

// Configuration interface matching the CDK-generated aws-exports.json structure
interface AwsExportsConfig {
  Auth: {
    Cognito: {
      userPoolClientId: string
      userPoolId: string
      loginWith: {
        oauth: {
          domain: string
          scopes: string[]
          redirectSignIn: string[]
          redirectSignOut: string[]
          responseType: string
        }
        username: boolean
        email: boolean
        phone: boolean
      }
    }
  }
  AgentCore: {
    runtimeArn: string
    region: string
  }
}

// Cache for loaded config
let configCache: AwsExportsConfig | null = null
let configPromise: Promise<AwsExportsConfig | null> | null = null

// Load configuration from aws-exports.json at runtime
async function loadAwsConfig(): Promise<AwsExportsConfig | null> {
  if (configCache) {
    return configCache
  }

  if (configPromise) {
    return configPromise
  }

  configPromise = (async () => {
    try {
      const response = await fetch("/aws-exports.json")
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`)
      }
      const config = await response.json()
      configCache = config
      return config
    } catch {
      console.warn("aws-exports.json not found, falling back to environment variables")
      return null
    }
  })()

  return configPromise
}

// Create auth config factory function that loads config dynamically
export async function createCognitoAuthConfig() {
  const awsConfig = await loadAwsConfig()

  // Extract Cognito configuration from aws-exports.json or fallback to env vars
  const cognitoConfig = awsConfig?.Auth?.Cognito
  const userPoolId = cognitoConfig?.userPoolId || process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
  const clientId = cognitoConfig?.userPoolClientId || process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
  const cognitoDomain = cognitoConfig?.loginWith?.oauth?.domain
  const region = awsConfig?.AgentCore?.region || process.env.NEXT_PUBLIC_COGNITO_REGION

  // Build authority URL from either domain or region/userPoolId
  const authority = cognitoDomain
    ? `https://${cognitoDomain}`
    : `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

  // Get redirect URIs from config or fallback to env var
  const redirectUris = cognitoConfig?.loginWith?.oauth?.redirectSignIn || [
    process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI,
  ]
  const redirectUri = Array.isArray(redirectUris) ? redirectUris[0] : redirectUris

  return {
    authority,
    client_id: clientId,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: redirectUri,
    response_type: "code",
    scope: "email openid profile",
    automaticSilentRenew: true,
    userStore:
      typeof window !== "undefined"
        ? new WebStorageStateStore({ store: window.localStorage })
        : undefined,
  }
}

// Synchronous version for backwards compatibility (uses env vars as fallback)
export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "email openid profile",
  automaticSilentRenew: true,
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.localStorage })
      : undefined,
}
