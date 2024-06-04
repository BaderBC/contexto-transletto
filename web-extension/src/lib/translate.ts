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
}
