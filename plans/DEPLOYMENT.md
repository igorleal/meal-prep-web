# Cloud Run Deployment Guide

This guide explains how to deploy the meal-prep-web React application to Google Cloud Run with IAM-based backend authentication.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Cloud Run                                   │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Frontend Service                              │    │
│  │  ┌──────────────┐     ┌─────────────────────────────────────┐   │    │
│  │  │    nginx     │     │         Node.js Proxy               │   │    │
│  │  │  (port 8080) │     │         (port 3001)                 │   │    │
│  │  │              │     │                                     │   │    │
│  │  │ Static files │     │ - Receives /api/* requests          │   │    │
│  │  │ SPA routing  │────▶│ - Fetches IAM ID token              │   │    │
│  │  │ Proxy /api/* │     │ - Forwards with both tokens:        │   │    │
│  │  │              │     │   * Authorization: Bearer <user-jwt>│   │    │
│  │  │              │     │   * X-Serverless-Authorization:     │   │    │
│  │  │              │     │     Bearer <iam-token>              │   │    │
│  │  └──────────────┘     └───────────────┬─────────────────────┘   │    │
│  └───────────────────────────────────────┼─────────────────────────┘    │
│                                          │                               │
│                                          ▼                               │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Backend Service (IAM Protected)               │    │
│  │                    - Validates IAM token (Cloud Run built-in)    │    │
│  │                    - Validates user JWT (your code)              │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

Before deploying, ensure you have:
- A GCP project with billing enabled
- The backend service already deployed (or deploy it first)

## Step 1: Enable Required APIs

In the GCP Console:

1. Go to **APIs & Services > Library**
2. Search and enable these APIs:
   - **Cloud Run Admin API**
   - **Artifact Registry API**
   - **IAM Service Account Credentials API**
   - **Cloud Build API**

Or via gcloud CLI:
```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable iamcredentials.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Step 2: Create Service Account for Frontend

In the GCP Console:

1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Fill in:
   - **Name:** `meal-prep-frontend`
   - **Description:** `Service account for meal-prep-web frontend`
4. Click **Create and Continue**
5. Skip the optional steps (we'll add permissions later)
6. Click **Done**

Note the email: `meal-prep-frontend@YOUR_PROJECT_ID.iam.gserviceaccount.com`

## Step 3: Grant Frontend Permission to Invoke Backend

This step grants your frontend service account permission to call the backend service.

### 3.1: Find Your Backend Service Details from the Browser URL

1. Navigate to **Cloud Run** and click on your backend service
2. Look at the browser URL, which follows this pattern:
   ```
   https://console.cloud.google.com/run/detail/REGION/SERVICE_NAME/...?project=PROJECT_ID
   ```
3. Example: `https://console.cloud.google.com/run/detail/europe-west1/receitai/...?project=meal-prep-483519`
   - Region: `europe-west1`
   - Service name: `receitai`
   - Project ID: `meal-prep-483519`

### 3.2: Construct the Full Resource Path

Using the values from the URL, construct the resource path:
```
projects/PROJECT_ID/locations/REGION/services/SERVICE_NAME
```

Example: `projects/meal-prep-483519/locations/europe-west1/services/receitai`

### 3.3: Grant Permission via IAM Console

1. Go to **IAM & Admin > IAM** (not Cloud Run)
2. Click **Grant Access** at the top
3. In "New principals", enter your frontend service account email:
   ```
   YOUR_FRONTEND_SA@PROJECT_ID.iam.gserviceaccount.com
   ```
   Example: `meal-prep-frontend@meal-prep-483519.iam.gserviceaccount.com`
4. In "Select a role", choose **Cloud Run > Cloud Run Invoker**
5. Click **Add IAM Condition**
   - **Title:** `Backend only`
   - **Condition type:** Resource > Name
   - **Operator:** `is`
   - **Value:** your full resource path from step 3.2
6. Click **Save**

## Step 4: Ensure Backend Requires Authentication

In the GCP Console:

1. Go to **Cloud Run**
2. Click on your **backend service**
3. Go to the **Security** tab (or check the service settings)
4. Ensure **Authentication** is set to **Require authentication**
5. If it shows "Allow unauthenticated invocations", edit the service and change it

## Step 5: Deploy Frontend to Cloud Run

### Option A: Deploy from Source (Recommended)

In the GCP Console:

1. Go to **Cloud Run**
2. Click **Create Service**
3. Select **Continuously deploy from a repository** or **Deploy one revision from source**
4. Configure:
   - **Service name:** `receitai-web`
   - **Region:** `europe-west1`
5. Under **Container, Networking, Security**:
   - **Container port:** `8080`
   - **Memory:** `512 MiB`
   - **CPU:** `1`
   - **Min instances:** `0`
   - **Max instances:** `10`
6. Under **Environment variables**, add:
   - `BACKEND_URL` = `https://receitai-<hash>.europe-west1.run.app`

   To find your backend URL: Go to Cloud Run, click on your backend service (`receitai`), and copy the URL shown at the top.
7. Under **Security**:
   - **Authentication:** `Allow unauthenticated invocations` (frontend is public)
   - **Service account:** Select `meal-prep-frontend@meal-prep-483519.iam.gserviceaccount.com`
8. Click **Create**

### Option B: Deploy via gcloud CLI

```bash
# Set your variables
PROJECT_ID="meal-prep-483519"
REGION="europe-west1"
BACKEND_URL="https://receitai-<hash>.europe-west1.run.app"  # Get from Cloud Run console

# Deploy from source
gcloud run deploy receitai-web \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --service-account meal-prep-frontend@${PROJECT_ID}.iam.gserviceaccount.com \
  --set-env-vars "BACKEND_URL=$BACKEND_URL" \
  --memory 512Mi \
  --project $PROJECT_ID
```

## Step 6: Update Backend URL (If Needed)

If you deploy the frontend before knowing the backend URL, update it later:

### Via Console:
1. Go to **Cloud Run > receitai-web**
2. Click **Edit & Deploy New Revision**
3. Go to **Variables & Secrets**
4. Update `BACKEND_URL` with the correct backend URL
5. Click **Deploy**

### Via CLI:
```bash
gcloud run services update receitai-web \
  --region europe-west1 \
  --set-env-vars "BACKEND_URL=https://receitai-<hash>.europe-west1.run.app" \
  --project meal-prep-483519
```

## Step 7: Verify Deployment

1. Get the frontend URL from Cloud Run console
2. Open the URL in your browser - the React app should load
3. Open browser DevTools (F12) > Console
4. Check that `window.__ENV__` shows the correct configuration
5. Try logging in and making API calls - they should work through the proxy

### Verify IAM Protection

```bash
# Direct call to backend should fail (403 Forbidden)
curl https://receitai-<hash>.europe-west1.run.app/api/health

# Call through frontend should work (with valid JWT)
curl https://receitai-web-<hash>.europe-west1.run.app/api/health \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Or if using custom domain:
curl https://www.receit.ai/api/health \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### "Permission denied" when calling backend

- Verify the service account has `Cloud Run Invoker` role on the backend
- Check that the frontend is using the correct service account
- Ensure `BACKEND_URL` environment variable is set correctly

### Frontend loads but API calls fail

- Check browser DevTools Network tab for error details
- Verify `BACKEND_URL` is set in environment variables
- Check Cloud Run logs for the frontend service

### 403 on backend even through proxy

- The IAM token might not be getting attached
- Check frontend Cloud Run logs for proxy errors
- Verify the backend URL doesn't have a trailing slash

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | Full URL of the backend Cloud Run service | `https://meal-prep-backend-abc123.run.app` |
| `PORT` | Port for nginx to listen on (set by Cloud Run) | `8080` |

---

## Custom Domain Setup (e.g., www.receit.ai)

If you want to use a custom domain instead of the default `.run.app` URL, follow these steps.

### Step 1: Verify Domain Ownership

Before you can use a custom domain, Google needs to verify you own it.

#### Option A: Via Google Search Console (Recommended)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add property**
3. Select **Domain** and enter your domain (e.g., `receit.ai`)
4. Follow the verification steps (usually adding a TXT record to your DNS)
5. Wait for verification to complete (can take a few minutes to hours)

#### Option B: Via GCP Console

1. Go to **Cloud Run > Manage Custom Domains**
2. Click **Add mapping**
3. If the domain isn't verified, you'll be prompted to verify it
4. Follow the on-screen instructions

### Step 2: Map Domain to Cloud Run Service

In the GCP Console:

1. Go to **Cloud Run**
2. Click on your service (`meal-prep-web`)
3. Go to the **Integrations** tab (or find **Custom domains** in the menu)
4. Click **Add Custom Domain** or **Add Mapping**
5. Select your verified domain from the dropdown
6. Choose the subdomain:
   - For `www.receit.ai`: enter `www`
   - For `receit.ai` (apex domain): leave blank or select "apex"
   - For `app.receit.ai`: enter `app`
7. Click **Continue** / **Save**

GCP will show you the DNS records you need to configure.

### Step 3: Configure DNS Records

Go to your domain registrar (where you bought the domain) and add the DNS records provided by GCP.

#### For Subdomain (e.g., www.receit.ai)

Add a **CNAME** record:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | ghs.googlehosted.com. |

#### For Apex Domain (e.g., receit.ai - no www)

Apex domains don't support CNAME, so you need **A** records. Add these:

| Type | Name | Value |
|------|------|-------|
| A | @ | 216.239.32.21 |
| A | @ | 216.239.34.21 |
| A | @ | 216.239.36.21 |
| A | @ | 216.239.38.21 |

#### For Both (www and apex)

If you want both `receit.ai` and `www.receit.ai` to work:

1. Set up the apex domain with A records (as above)
2. Set up www with a CNAME record (as above)
3. Create **two domain mappings** in Cloud Run (one for each)

### Step 4: Wait for DNS Propagation

- DNS changes can take **15 minutes to 48 hours** to propagate globally
- You can check propagation status at [whatsmydns.net](https://www.whatsmydns.net)
- Enter your domain and check for the correct records

### Step 5: SSL Certificate (Automatic)

Google Cloud Run **automatically provisions and renews SSL certificates** for custom domains. No action needed from you.

- Certificate provisioning starts after DNS is configured
- Can take **15-30 minutes** after DNS propagates
- During this time, you might see SSL errors - this is normal
- Check the Cloud Run console for certificate status

### Step 6: Verify Custom Domain

1. Open `https://www.receit.ai` (or your domain) in a browser
2. Verify the SSL certificate is valid (lock icon in address bar)
3. Verify the app loads correctly
4. Test API calls work through the proxy

### Optional: Redirect Apex to www (or vice versa)

If you want `receit.ai` to redirect to `www.receit.ai`:

1. Create a separate Cloud Run service for the redirect, or
2. Use a Cloud Load Balancer with URL redirect rules, or
3. Configure the redirect at your DNS provider (if supported)

The simplest approach is to map both domains to the same Cloud Run service - both will work.

### Custom Domain for Backend API

If you also want a custom domain for the backend (e.g., `api.receit.ai`):

1. Repeat the domain mapping process for the backend service
2. Update the frontend's `BACKEND_URL` environment variable:
   ```
   BACKEND_URL=https://api.receit.ai
   ```
3. Redeploy or update the frontend service

### Troubleshooting Custom Domains

#### "Domain not verified"
- Ensure you verified the domain in Google Search Console
- The verification might be under a different Google account
- Try verifying via DNS TXT record method

#### SSL certificate not provisioning
- Verify DNS records are correct using `dig` or whatsmydns.net
- Wait longer - can take up to 24 hours in rare cases
- Check Cloud Run console for specific error messages

#### "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"
- Certificate is still being provisioned
- Wait 15-30 minutes and try again

#### Domain works but API calls fail
- If using custom domain for backend, update `BACKEND_URL`
- Ensure the proxy server can resolve the custom domain

---

## Files Created for Deployment

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: Node for building, nginx + proxy for serving |
| `nginx.conf` | Serves static files, proxies API calls, handles SPA routing |
| `proxy/server.js` | Node.js proxy that injects IAM tokens |
| `proxy/package.json` | Dependencies for the proxy server |
| `docker-entrypoint.sh` | Starts both nginx and the proxy |
| `env-config.template.js` | Template for runtime environment config |
| `.dockerignore` | Excludes unnecessary files from Docker build |
| `public/env-config.js` | Development placeholder |
