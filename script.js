const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

const quotationmark = document.getElementById('quotationmark');

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote From API

// count the attemps of getting a quote
let counter = 0;
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://thawing-forest-44534.herokuapp.com/'
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    
    try {
        quotationmark.style.display = "inline";
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        if(data.quoteAuthor === ''){
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font siye for long quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        // Stop Loader, Show Quote
        removeLoadingSpinner();

        // reset counter after successfully loading a quote
        counter = 0;
    } catch (error) {
        if(counter<=10) {
            getQuote();
            counter++;
            
        } else {
            //Notify the user that an error occured 
            //after 10 attemps of loading a quote
            removeLoadingSpinner();
            quotationmark.style.display = "none";
            quoteText.innerText = 'Sorry, an error occured!';
            authorText.innerText ='';
            newQuoteBtn.innerText = 'Try again';
            counter = 0;
        }
    }
}
// Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event listener
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();