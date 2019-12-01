
import codecommit = require("@aws-cdk/aws-codecommit");
import codebuild = require("@aws-cdk/aws-codebuild");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import { App, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { CodeCommitSourceAction, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';

export class HelloWorldCodePipelineStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const repo = new codecommit.Repository(this, "Repository", {
      repositoryName: "HelloWorldRepository",
      description: "A simple Hello World application."
    });


    const buildProject = new codebuild.PipelineProject(this, "Build", {
      description: "Build project for the HelloWorld application",
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_OPEN_JDK_9
      }
    });

    const sourceOutput = new codepipeline.Artifact();    
    const sourceAction = new CodeCommitSourceAction({
      branch: "master",
      repository: repo,
      actionName: "Source",
      output: sourceOutput
    });

    const buildAction = new CodeBuildAction({
      input: sourceOutput,
      actionName: "Build",
      project: buildProject
    });

    new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "HelloWorldPipeline",
      stages: [
        { actions: [sourceAction], stageName: "Source" },
        { actions: [buildAction], stageName: "Build" }
      ]
    });

    new CfnOutput(this, "Clone URL (HTTPS)", {
      value: repo.repositoryCloneUrlHttp
    });
    new CfnOutput(this, "Clone URL (SSH)", {
      value: repo.repositoryCloneUrlSsh
    });
  }
}
