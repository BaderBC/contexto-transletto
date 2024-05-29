import TranslationModal from '../components/TranslationModal/TranslationModal.svelte';

const textSelection = window.getSelection();
const textToTranslate = textSelection.toString();
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
    wordToTranslate: textToTranslate,
  }
});

// When we know element width, it is possible to correct it position
divElement.style.left = `${selectionAbsoluteLeftPos - (divElement.offsetWidth / 2)}px`;

//document.getElementById('home').innerHTML = 'test';
// eslint-disable-next-line no-console
console.log('textToTranslate: ', textToTranslate);
getEntireSentenceOfSelectedWord();
function getEntireSentenceOfSelectedWord() {
  
}
