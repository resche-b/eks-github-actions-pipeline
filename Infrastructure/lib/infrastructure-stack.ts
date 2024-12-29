import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the default VPC
    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    const cluster = new eks.Cluster(this, "EKS-Cluster", {
      clusterName: "eks-cluster",
      vpc: vpc,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_30,
    });

    const repo = new ecr.Repository(this, "ECRRepo", {
      repositoryName: "ecr-repo",
    });

    // IAM Role for Worker Nodes
    const workerRole = new iam.Role(this, "WorkerNodeRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSWorkerNodePolicy"),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonEC2ContainerRegistryReadOnly"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKS_CNI_Policy"),
      ],
    });

    // Allow Internal Traffic in the Cluster
    cluster.connections.allowInternally(ec2.Port.allTraffic());

    new cdk.CfnOutput(this, "ECRRepoUri", {
      value: repo.repositoryUri,
      description: "ECR Repository URI",
    });
  }
}
