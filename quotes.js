// Fetches a quote and displays it in the first section

fetch("https://api.quotable.io/quotes/random?maxLength=90")
.then((data) => data.json())
.then((json) => {
	const quote = json[0].content;
	const author = json[0].author;

	const quoteContainer = document.querySelector(".quote");
	quoteContainer.children[0].textContent = quote;
	quoteContainer.children[2].textContent = "- " + author;
})
.catch((error) => {
	console.error(error);
});
