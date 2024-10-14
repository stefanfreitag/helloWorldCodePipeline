#!/usr/bin/env node
import 'source-map-support/register';
import { HelloWorldCodePipelineStack } from '../lib/hello_world_code_pipeline-stack';
import { App } from 'aws-cdk-lib';

const app = new App();
new HelloWorldCodePipelineStack(app, 'HelloWorldCodePipelineStack');

