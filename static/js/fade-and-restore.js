const ALL_SECTIONS = ["#start", "#about", "#qualifications", "#previous-projects", "#contact", "#thank-you"];
const TOTAL_SECTIONS = ALL_SECTIONS.length;

let count = 0;

const observer = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (entry.target.className.includes("visible")) return;

			if (entry.intersectionRatio >= 0.25) {
				entry.target.classList.add("visible");
				count++;
			}

			if (count === TOTAL_SECTIONS) observer.disconnect();
		});
	},
	{
		root: null,
		threshold: 0.25,
	}
);

ALL_SECTIONS.forEach((selector) => {
	observer.observe(document.querySelector(selector));
});
