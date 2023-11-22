document.addEventListener("DOMContentLoaded", function() {
    let includedTags = [];
    function createTag(tagName){
        const tagButton = document.createElement('button');
        tagButton.textContent = tagName;
        tagButton.className = 'tag';
        return tagButton;
    }
    
    function hideArticles() {
        const articles = document.querySelectorAll('.article-container');
        articles.forEach(article => {
            const articleTags = Array.from(article.querySelectorAll('li')).map(tag => tag.textContent.toLowerCase().trim());
    
            if (includedTags.every(tag => articleTags.includes(tag))) {
                article.classList.remove('hidden');
            } else {
                article.classList.add('hidden');
            }
        });
    }
    
    function addSearchTerm(tagName){
        includedTags.push(tagName.toLowerCase().trim());
        const tagButton = createTag(tagName);
        tagButton.addEventListener('click', () => {
            tagButton.remove();
            includedTags = includedTags.filter(tag => tag !== tagName.toLowerCase().trim());
            hideArticles();
            removeQueryParameter('tag');
            updateUrl();
        });
        const tagContainer = document.querySelector('.tag-container');
        tagContainer.appendChild(tagButton);
        hideArticles();
        updateUrl();
    }
    
    function updateUrl(){
       const urlSearchParams = new URLSearchParams();
       includedTags.forEach(tag => {
         urlSearchParams.append('tag', tag);
       });
       history.pushState(null, ' ', `?${urlSearchParams.toString()}`);
    }
    
    function removeQueryParameter(paramKey){
       const urlSearchParams = new URLSearchParams(window.location.search);
       urlSearchParams.delete(paramKey);
       history.pushState(null, ' ', `?${urlSearchParams.toString()}`);
    }
    
    function initialize(){
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.getAll('tag').forEach(tag => {
            addSearchTerm(tag);
        });
    }
    
    const inputBox = document.querySelector('input');
    inputBox.addEventListener('keypress', (event) => {
        if(event.key === 'Enter'){
            const searchTerm = inputBox.value;
            addSearchTerm(searchTerm);
            inputBox.value = '';
        }
    });
    
    initialize();
    });
    
    
    
    //questions to answer about defer
    //1. without the defer attribute, the browser is not able to select the input elements. 
    //2. the defer attribute parallely allows for the script to download while parsing the HTML page
    //3. with the defer attribute, the "DOMContentLoaded" event must occur before script is executed
    //4. diagram with defer: html parsing and download script -> DOMContentLoaded occurs and execute script
    //5. diagram without defer: html parsing -> download script -> execute script -> DOMContentLoaded occurs
    