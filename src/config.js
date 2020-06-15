const CONFIGS = {
  templateUrl: // TODO: modify
    'https://serverless-templates-1300862921.cos.ap-beijing.myqcloud.com/express-demo.zip',
  framework: 'nestjs',
  frameworkFullname: 'Nest.js',
  handler: 'sl_handler.handler',
  runtime: 'Nodejs10.15',
  exclude: ['.git/**', '.gitignore', '.DS_Store'],
  timeout: 3,
  memorySize: 128,
  namespace: 'default',
  description: 'This is a function created by serverless component'
}

module.exports = CONFIGS
