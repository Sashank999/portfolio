const NUMBER_OF_DOTS = 20;

const backgrounds = document.querySelectorAll(".space-background");
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

if (backgrounds.length) {
	backgrounds.forEach((background) => {
		let newDot;
		for (let i = 0; i < NUMBER_OF_DOTS; i++) {
			newDot = document.createElement("div");
			newDot.className = "space-dot";
			background.appendChild(newDot);
		}

		replaceDots(background);
		setInterval(() => replaceDots(background), 1000);
	});
}

window.addEventListener("resize", () => {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
});

function replaceDots(background) {
	// Change position of dots
	[...background.children].forEach((dot) => {
		dot.style = `top: ${randomBetween(1, windowHeight)}px; left: ${randomBetween(1, windowWidth - 10)}px;`;
	});
}

function randomBetween(min, max) {
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
