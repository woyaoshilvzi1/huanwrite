import { AssetPaths } from "./assetPaths.js";
import { CreativeLaneAssetReader } from "./creativeLaneAsset.js";
import { DefaultPlanAssetReader } from "./defaultPlanAsset.js";
import { TemplateAssetReader } from "./templateAsset.js";
import { CandidateTemplateRenderer } from "./templateRenderer.js";

export class AssetCatalog {
  readonly creativeLanes: CreativeLaneAssetReader;
  readonly defaultPlan: DefaultPlanAssetReader;
  readonly templates: TemplateAssetReader;
  readonly candidateRenderer: CandidateTemplateRenderer;

  constructor(root: string) {
    const paths = new AssetPaths(root);
    this.creativeLanes = new CreativeLaneAssetReader(paths);
    this.defaultPlan = new DefaultPlanAssetReader(paths);
    this.templates = new TemplateAssetReader(paths);
    this.candidateRenderer = new CandidateTemplateRenderer();
  }
}
