npx del "dist/*" "!dist/.serverless"
npm run build
cp package* dist/
cp serverless.yml dist/
cp .env dist/
cd dist
npm ci --only=production
sls --debug
