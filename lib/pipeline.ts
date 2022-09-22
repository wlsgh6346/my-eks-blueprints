import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope,id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    
    
    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns( new blueprints.ArgoCDAddOn())
    .teams();
  
    blueprints.CodePipelineStack.builder()
      .name("eks-blueprints-workshop-pipeline")
      .owner("wlsgh6346")
      .repository({
          repoUrl: 'my-eks-blueprints',
          credentialsSecretName: 'github-token',
          targetRevision: 'main'
      }).wave({
        id: "envs",
        stages: [   
          { id: "dev", stackBuilder: blueprint.clone('us-west-2')},
        ]
      })
      .build(scope, id+'-stack', { env:{ account:props?.env?.account, region:props?.env?.region}});
  }
}