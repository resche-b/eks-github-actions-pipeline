import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import { KubectlV28Layer } from "@aws-cdk/lambda-layer-kubectl-v28";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the default VPC
    const vpc = ec2.Vpc.fromLookup(this, "DefaultVPC", {
      isDefault: true,
    });

    // Filter out subnets in unsupported AZs
    const filteredSubnets = vpc.selectSubnets({
      subnetFilters: [
        ec2.SubnetFilter.availabilityZones([
          "us-east-1a",
          "us-east-1b",
          "us-east-1c",
          "us-east-1d",
          "us-east-1f",
        ]),
      ],
    }).subnets;

    // Create an EKS Cluster with Kubectl Layer
    const cluster = new eks.Cluster(this, "EKS-Cluster", {
      clusterName: "eks-cluster",
      vpc: vpc,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_28,
      vpcSubnets: [{ subnets: filteredSubnets }],
      kubectlLayer: new KubectlV28Layer(this, "KubectlLayer"),
    });

    // Create an ECR Repository
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

    // Grant Cluster Access to an IAM User
    const userArn = "arn:aws:iam::905418307151:user/resche";
    cluster.awsAuth.addUserMapping(iam.User.fromUserArn(this, "UserResche", userArn), {
      username: "resche",
      groups: ["system:masters"],
    });

    // Allow Internal Traffic in the Cluster
    cluster.connections.allowInternally(ec2.Port.allTraffic());

    // Output the ECR Repository URI
    new cdk.CfnOutput(this, "ECRRepoUri", {
      value: repo.repositoryUri,
      description: "ECR Repository URI",
    });
  }
}
