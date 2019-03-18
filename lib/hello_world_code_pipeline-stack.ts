import cdk = require("@aws-cdk/cdk");
import codecommit = require("@aws-cdk/aws-codecommit");
import codebuild = require("@aws-cdk/aws-codebuild");
import codepipeline = require("@aws-cdk/aws-codepipeline");

export class HelloWorldCodePipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
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

    const sourceAction = new codecommit.PipelineSourceAction({
      branch: "master",
      repository: repo,
      actionName: "Source"
    });

    const buildAction = new codebuild.PipelineBuildAction({
      inputArtifact: sourceAction.outputArtifact,
      actionName: "Build",
      project: buildProject
    });

    new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "HelloWorldPipeline",
      stages: [
        { actions: [sourceAction], name: "Source" },
        { actions: [buildAction], name: "Build" }
      ]
    });

    new cdk.Output(this, "Clone URL (HTTPS)", {
      value: repo.repositoryCloneUrlHttp
    });
    new cdk.Output(this, "Clone URL (SSH)", {
      value: repo.repositoryCloneUrlSsh
    });
  }
}
