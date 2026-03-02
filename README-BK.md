# Bulent's Notes

Using Rancher Desktop for Docker.

## Changes

Changed the Bedrock model used in `patterns/strands-single-agent/basic_agent.py`

## Deployment

https://github.com/awslabs/fullstack-solution-template-for-agentcore/blob/main/docs/DEPLOYMENT.md

    cd infra-cdk
    npm install
    cdk bootstrap # Once ever
    cdk deploy
    cd ..
    python scripts/deploy-frontend.py

App: https://main.d19zp3tanepndz.amplifyapp.com/


## Local Development

https://github.com/awslabs/fullstack-solution-template-for-agentcore/blob/main/docs/LOCAL_DEVELOPMENT.md

* Created a .env file in folder docker/ with memory id, stack name, aws region.
* Using env variables from the AWS access portal (https://d-9c6767cb6b.awsapps.com/start/#/?tab=accounts) for the aws credentials.

Extract Memory ID from MemoryArn (last part after the final /):

    aws cloudformation describe-stacks --stack-name FAST-stack --query 'Stacks[0].Outputs'


Build the container and run

    cd docker
    docker compose up --build


Runs locally, logs the following error due to missing OpenTelemetry endpoint:

> HTTPConnectionPool(host='localhost', port=4318): Max retries exceeded with url: /v1/traces


## Infra Cleanup

    cd infra-cdk
    cdk destroy --force


## Local Cleanup

```
# Stop all services
cd docker && docker compose down

# Stop and remove volumes
cd docker && docker compose down -v

# Stop and remove images
cd docker && docker compose down --rmi all
```