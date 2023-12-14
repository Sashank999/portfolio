const NUMBER_OF_DOTS = 20;

const background = document.querySelector(".space-background");
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

if (background) {
	showDots();
	setInterval(showDots, 1000);
}

function showDots() {
	// Remove all current dots
	background.textContent = "";

	// Add new dots
	const nodes = [];
	let newDot;
	for (let i = 0; i < NUMBER_OF_DOTS; i++) {
		newDot = document.createElement("div");
		newDot.className = "space-dot";
		newDot.style = `top: ${randomBetween(1, windowHeight)}px; left: ${randomBetween(1, windowWidth)}px;`;
		background.appendChild(newDot);
		nodes.push(newDot);
	}
	setTimeout(() => nodes.forEach(x => x.remove()), 2000);
}

function randomBetween(min, max) {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
