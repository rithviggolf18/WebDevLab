document.addEventListener('DOMContentLoaded', restoreScrollPosition);

function saveScrollPosition(){
  let scrollPosition = window.scrollY;
  localStorage.setItem(document.title + '_scrollY', scrollPosition);
}

function restoreScrollPosition(){
    const savedPosition = localStorage.getItem(document.title + '_scrollY');
    const savedPositionAsNumber = parseInt(savedPosition, 10);
    if (savedPositionAsNumber)
      window.scrollTo(0, savedPositionAsNumber);
}

window.addEventListener('scroll', saveScrollPosition);
const highlights = [];

document.addEventListener('mouseup', () => {
   const selection = window.getSelection();
   if(selection.rangeCount > 0){
     const range = selection.getRangeAt(0);
     const highlight = document.createElement('span');
     highlight.className = 'highlight';
     range.surroundContents(highlight);
     highlight.addEventListener('click', () => { 
        highlight.outerHTML = highlight.innerHTML;
        const index = highlights.indexOf(highlight.innerHTML);
        if(index!==-1)
          highlights.splice(index, 1);
     });
     const text = highlight.textContent.trim();
     if(!highlights.includes(text))
       highlights.push(text);
   }
});

const downloadButton = document.querySelector('#db');
downloadButton.addEventListener('click', () => {
	const highlightsJSON = JSON.stringify(highlights);
	const encodedHighlights = encodeURIComponent(highlightsJSON);
	const downloadLink = document.createElement('a');
	downloadLink.href = `data:text/json;charset=utf-8,${encodedHighlights}`;
	downloadLink.download = 'highlights.json';
	downloadLink.click();
});
