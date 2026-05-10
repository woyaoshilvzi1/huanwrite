export interface CandidateTemplateValues {
  actionType: string;
  manuscriptTitle: string;
  storyPromise: string;
}

export class CandidateTemplateRenderer {
  render(template: string, values: CandidateTemplateValues): string {
    return template
      .replaceAll("{actionType}", values.actionType)
      .replaceAll("{manuscriptTitle}", values.manuscriptTitle)
      .replaceAll("{storyPromise}", values.storyPromise);
  }
}
