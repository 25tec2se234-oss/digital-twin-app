$ErrorActionPreference = "Stop"

Write-Host "Authenticating Docker with AWS ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 163362229215.dkr.ecr.us-east-1.amazonaws.com

Write-Host "Building Docker image locally..."
docker build -t digital-twin-backend:latest .

Write-Host "Tagging image for ECR..."
docker tag digital-twin-backend:latest 163362229215.dkr.ecr.us-east-1.amazonaws.com/digital-twin-backend:latest

Write-Host "Pushing image to ECR..."
docker push 163362229215.dkr.ecr.us-east-1.amazonaws.com/digital-twin-backend:latest

Write-Host "Image pushed to ECR! Now restarting backend containers on EC2 instances..."

# Get Instance IDs for digital-twin-backend
$InstanceIds = (aws ec2 describe-instances --filters "Name=tag:Name,Values=digital-twin-backend" "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].InstanceId" --output text)

if (-not [string]::IsNullOrWhiteSpace($InstanceIds)) {
    $InstanceArray = $InstanceIds -split '\s+'
    Write-Host "Found instances: $($InstanceArray -join ', ')"

    # Read variables from local .env to avoid hardcoding secrets in the script
    $envContent = Get-Content ".env"
    $envVars = @{}
    foreach ($line in $envContent) {
        if (![string]::IsNullOrWhiteSpace($line) -and !$line.StartsWith("#")) {
            $parts = $line -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $val = $parts[1].Trim().Trim('"').Trim("'")
                $envVars[$key] = $val
            }
        }
    }

    $Command = @"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 163362229215.dkr.ecr.us-east-1.amazonaws.com
docker pull 163362229215.dkr.ecr.us-east-1.amazonaws.com/digital-twin-backend:latest
docker stop backend || true
docker rm backend || true
docker run -d --name backend --network dtv-net --restart always -p 80:3000 -v /home/ec2-user/uploads:/app/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="$($envVars['DATABASE_URL'])" \
  -e TEST_DATABASE_URL="$($envVars['TEST_DATABASE_URL'])" \
  -e DB_POOL_MAX=10 \
  -e DB_IDLE_TIMEOUT_MS=10000 \
  -e DB_CONNECTION_TIMEOUT_MS=15000 \
  -e JWT_ACCESS_SECRET="$($envVars['JWT_ACCESS_SECRET'])" \
  -e JWT_REFRESH_SECRET="$($envVars['JWT_REFRESH_SECRET'])" \
  -e JWT_ACCESS_TTL=15m \
  -e JWT_REFRESH_TTL=30d \
  -e CORS_ORIGINS="$($envVars['CORS_ORIGINS'])" \
  -e RATE_LIMIT_WINDOW_MS=900000 \
  -e RATE_LIMIT_MAX=10000 \
  -e AUTH_RATE_LIMIT_MAX=20 \
  -e OPENROUTER_API_KEY="$($envVars['OPENROUTER_API_KEY'])" \
  -e OPENAI_API_KEY="$($envVars['OPENAI_API_KEY'])" \
  -e OPENROUTER_MODEL="google/gemini-2.5-flash" \
  -e AI_PROVIDER="openai" \
  -e FILE_STORAGE=local \
  -e UPLOAD_DIR=uploads \
  -e PUBLIC_BASE_URL="http://\`$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)" \
  -e RAZORPAY_KEY_ID="$($envVars['RAZORPAY_KEY_ID'])" \
  -e RAZORPAY_KEY_SECRET="$($envVars['RAZORPAY_KEY_SECRET'])" \
  -e SMTP_USER="$($envVars['SMTP_USER'])" \
  -e SMTP_PASS="$($envVars['SMTP_PASS'])" \
  -e BREVO_API_KEY="$($envVars['BREVO_API_KEY'])" \
  -e ADMIN_EMAIL="$($envVars['ADMIN_EMAIL'])" \
  -e ADMIN_PASSWORD="$($envVars['ADMIN_PASSWORD'])" \
  -e REDIS_URL="redis://redis:6379" \
  -e CACHE_TTL_SECONDS=30 \
  163362229215.dkr.ecr.us-east-1.amazonaws.com/digital-twin-backend:latest
"@

    Write-Host "Executing SSM Command on instances..."
    $jsonPayload = @{
        DocumentName = "AWS-RunShellScript"
        InstanceIds = $InstanceArray
        Parameters = @{
            commands = @($Command)
        }
    } | ConvertTo-Json -Depth 10
    
    [System.IO.File]::WriteAllText("ssm-payload.json", $jsonPayload)
    $CommandId = (aws ssm send-command --cli-input-json file://ssm-payload.json --query "Command.CommandId" --output text)
    Write-Host "Sent SSM command: $CommandId"
    Remove-Item "ssm-payload.json" -ErrorAction SilentlyContinue
} else {
    Write-Host "No running instances found to restart!"
}

Write-Host "Deployment completed!"
