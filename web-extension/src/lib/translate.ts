import { FetchAuthorized } from './fetchAuthorized';

export class ContextoTranslettoSentence {
  public readonly leftSide: string;
  public readonly selectedPhrase: string;
  public readonly rightSide: string;

  constructor(leftSide: string, selectedPhrase: string, rightSide: string) {
    leftSide = leftSide.trim();
    rightSide = rightSide.trim();

    // We split selected node into multiple sentences
    const splitRegEx = /[.!?\n]/;

    const leftSplit = leftSide.split(splitRegEx);
    const rightSplit = rightSide.split(splitRegEx);

    const [rightSeparator] = rightSide.match(splitRegEx) || [''];

    this.leftSide = leftSplit[leftSplit.length - 1];
    this.rightSide = rightSplit[0] + rightSeparator;

    // If right side is empty or contain only separator:
    // There's no need to check left side, because it doesn't contain a separator
    if (this.rightSide.length <= 1) {
      this.selectedPhrase = ' ' + selectedPhrase;
      return;
    }

    // Add spaces to selected phrase:
    this.selectedPhrase = ` ${selectedPhrase} `;
  }

  public joinMakingSelectedPhraseBold() {
    return `${this.leftSide}<b>${this.selectedPhrase}</b>${this.rightSide}`.trim();
  }
  
  public async get_translated(): Promise<ContextoTranslettoSentence> {
    const res = await FetchAuthorized.post<any>('/translate', {
      left_sentence_part: this.leftSide,
      selected_phrase: this.selectedPhrase,
      right_sentence_part: this.rightSide,
    });
    
    return new ContextoTranslettoSentence(
      res.left_sentence_part,
      res.selected_phrase,
      res.right_sentence_part,
    );
  }
}
