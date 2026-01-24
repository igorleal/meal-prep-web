#!/bin/bash
set -e

echo "Building Docker image..."
gcloud builds submit \
  --tag europe-west1-docker.pkg.dev/meal-prep-483519/cloud-run-source-deploy/receitai-web \
  --project meal-prep-483519

echo "Deploying to Cloud Run..."
gcloud run deploy receitai-web \
  --image europe-west1-docker.pkg.dev/meal-prep-483519/cloud-run-source-deploy/receitai-web \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --service-account receitai-web-sa@meal-prep-483519.iam.gserviceaccount.com \
  --set-env-vars "BACKEND_URL=https://receitai-744258893644.europe-west1.run.app" \
  --memory 512Mi \
  --project meal-prep-483519

echo "Deployment complete!"
