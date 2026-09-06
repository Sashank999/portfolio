// Fetches a quote and displays it in the first section.

const QUOTES_INDEX_URL = "/static/quotes_indices.bin",
	QUOTES_URL = "/static/randomised_quotes.txt";

(async () => {
	try {
		const quotesIndicesDetailsResponse = await fetch(QUOTES_INDEX_URL, { method: "HEAD" });
		if (quotesIndicesDetailsResponse.status !== 200) throw Error(`Error fetching quotes indices list - status ${quotesIndicesDetailsResponse.status}.`);

		const totalNumberOfQuotes = parseInt(quotesIndicesDetailsResponse.headers.get("Content-Length")) / 3;
		const randomQuoteIndex = Math.floor(Math.random() * totalNumberOfQuotes);

		// Fetching a total of 6 bytes from the quotes indices list - beginning index of current quote to beginning index of next quote.
		const quoteIndexFromByte = randomQuoteIndex * 3,
			quoteIndexToByte = quoteIndexFromByte + 5;
		const quoteIndicesResponse = await fetch(QUOTES_INDEX_URL, { headers: { Range: `bytes=${quoteIndexFromByte}-${quoteIndexToByte}` } });
		if (quoteIndicesResponse.status !== 206) throw Error(`Error fetching quotes indices - status ${quoteIndicesResponse.status}.`);

		const quoteIndices = new Uint8Array(await quoteIndicesResponse.arrayBuffer());
		const quoteFromByte = quoteIndices[0] * 2 ** 16 + quoteIndices[1] * 2 ** 8 + quoteIndices[2];
		const quoteToByte = quoteIndices[3] * 2 ** 16 + quoteIndices[4] * 2 ** 8 + quoteIndices[5] - 1; // "- 1" to not fetch the newline.

		const quoteResponse = await fetch(QUOTES_URL, { headers: { Range: `bytes=${quoteFromByte}-${quoteToByte}` } });
		if (quoteResponse.status !== 206) throw Error(`Error fetching quote - status ${quoteResponse.status}.`);

		const quoteInfo = (await quoteResponse.text()).split(";");

		const quoteAuthor = quoteInfo[0],
			quoteText = quoteInfo[1];
		const quoteContainer = document.querySelector(".quote");
		quoteContainer.children[0].textContent = quoteText;
		quoteContainer.children[2].textContent = "- " + quoteAuthor;
	} catch (error) {
		console.error("Error setting quote:", error);
	}
})();
