
import { App, SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { BuildSpec, LinuxBuildImage, PipelineProject } from "aws-cdk-lib/aws-codebuild";
import { CodeBuildAction, GitHubSourceAction, GitHubTrigger } from "aws-cdk-lib/aws-codepipeline-actions";

import* as codepipeline from "aws-cdk-lib/aws-codepipeline";

export class HelloWorldCodePipelineStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const buildProject = new PipelineProject(this, "Build", {
      description: "Build project for the HelloWorld application",
      environment: {
        buildImage:LinuxBuildImage.AMAZON_LINUX_2_5
      },
      buildSpec: BuildSpec.fromObject({
        version: 0.2,
        phases: {
            install:{
              commands: [
                "echo Nothing to do in the install phase..."
              ]              
            },
            pre_build: {
              commands: [
                "echo Nothing to do in the pre_build phase..."
              ]
            },
            build: {
              commands: [
                "echo Build started on `date`",
                "./gradlew build"
              ],
              artifacts: {
                files: [
                    "build/libs/HelloWorld-0.0.1.jar"
                ]
              }
            },
            post_build: {
              commands: [
                "Build completed on `date`"
              ]
            }
        }
      })
    });

    const sourceOutput = new codepipeline.Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: "GitHub",
      owner: "stefanfreitag",
      repo: "helloWorld",
      oauthToken: SecretValue.secretsManager("my-github-token"),
      output: sourceOutput,
      branch: "master",
      trigger: GitHubTrigger.POLL
    });

    const buildAction = new CodeBuildAction({
      input: sourceOutput,
      actionName: "Build",
      project: buildProject

    });

    new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "HelloWorldPipeline",
      pipelineType: codepipeline.PipelineType.V1,
      stages: [
        { actions: [sourceAction], stageName: "Source" },
        { actions: [buildAction], stageName: "Build" }
      ]
    });
  }
}
