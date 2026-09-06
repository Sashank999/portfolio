import fs from "node:fs";

const QUOTES_JSON_URL = "https://raw.githubusercontent.com/dwyl/quotes/45bdefe4e8b291a26c7b4c4a8dd1e24139ab7a17/quotes.json";
const ONE_BYTE = 2 ** 8;

if (process.argv.length !== 4) throw Error("Incorrect arguments.");

// Source - https://stackoverflow.com/a/2450976
// Posted by ChristopheD, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-05, License - CC BY-SA 4.0
function shuffleArray(array) {
	// While there remain elements to shuffle...
	let currentIndex = array.length;

	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

function splitNumberTo3Bytes(number) {
	let array = [];
	while (number > 0) {
		array.unshift(number % ONE_BYTE);
		number = Math.floor(number / ONE_BYTE);
	}

	while (array.length < 3) {
		array.unshift(0);
	}

	if (array.length > 3) throw Error(`Quote index exceeded 2 ** 24.`);

	return new Uint8Array(array);
}

(async () => {
	// Storing command line arguments.
	const quotesFilePath = process.argv[2];
	const indexFilePath = process.argv[3];

	// Fetch quotes from source.
	const quotesResponse = await fetch(QUOTES_JSON_URL);
	if (quotesResponse.status !== 200) throw Error(`Error fetching quotes - status ${quotesResponse.status}.`);

	const quotes = await quotesResponse.json();

	shuffleArray(quotes);

	// Create output file stream.
	const indexFile = fs.createWriteStream(indexFilePath);
	const quotesFile = fs.createWriteStream(quotesFilePath);
	let quoteIndex = 0;
	for (const quote of quotes) {
		const formattedQuote = `${quote["author"]};${quote["text"]}\n`;
		quotesFile.write(formattedQuote);

		const quoteByteLength = new Blob([formattedQuote]).size;
		quoteIndex += quoteByteLength;

		const quoteIndexBytes = splitNumberTo3Bytes(quoteIndex);
		indexFile.write(quoteIndexBytes);
	}
})();
