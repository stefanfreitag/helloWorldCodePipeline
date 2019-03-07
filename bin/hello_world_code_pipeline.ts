#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { HelloWorldCodePipelineStack } from '../lib/hello_world_code_pipeline-stack';

const app = new cdk.App();
new HelloWorldCodePipelineStack(app, 'HelloWorldCodePipelineStack');
app.run();
