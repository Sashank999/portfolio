const NUMBER_OF_DOTS = 20;

const background = document.querySelector(".space-background");
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

if (background) {
	let newDot;
	for (let i = 0; i < NUMBER_OF_DOTS; i++) {
		newDot = document.createElement("div");
		newDot.className = "space-dot";
		background.appendChild(newDot);
	}

	replaceDots();
	setInterval(replaceDots, 1000);
}

function replaceDots() {
	// Change position of dots
	[...background.children].forEach((dot) => {
		dot.style = `top: ${randomBetween(1, windowHeight)}px; left: ${randomBetween(1, windowWidth - 10)}px;`;
	});
}

function randomBetween(min, max) {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
