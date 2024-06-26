import TranslationModal from '../components/PopupModal.svelte';
import { ContextoTranslettoSentence } from '../lib/translate';

const textSelection = window.getSelection();
const textToTranslate = textSelection.toString();
const range = textSelection.getRangeAt(0);
const sentenceBeforeSelection = range.startContainer.textContent.slice(0, range.startOffset);
const sentenceAfterSelection = range.startContainer.textContent.slice(range.endOffset);

const divElement = document.createElement('div');

divElement.style.position = 'fixed';
divElement.style.zIndex = '999999';

const selectionPosition = textSelection.getRangeAt(0).getBoundingClientRect();
const selectionAbsoluteLeftPos = selectionPosition.left + (selectionPosition.width / 2);

divElement.style.top = `${selectionPosition.top + 40}px`;
divElement.style.left = `${selectionAbsoluteLeftPos}px`;

divElement.addEventListener('click', ev => {
  ev.stopPropagation();
});
document.body.addEventListener('click', () => {
  divElement.remove();
});

document.body.appendChild(divElement);

new TranslationModal({
  target: divElement,
  props: {
    sentenceToTranslate: new ContextoTranslettoSentence(sentenceBeforeSelection, textToTranslate, sentenceAfterSelection),
  },
});

// When we know element width, it is possible to correct it position
divElement.style.left = `${selectionAbsoluteLeftPos - (divElement.offsetWidth / 2)}px`;
