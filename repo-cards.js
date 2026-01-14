// @ts-check

const REPO_NAMES = ["Sashank999/spacex-clone", "Sashank999/static-qr-gen", "Sashank999/static-qr-gen-react"];
const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 60;

// The below SVG is copied from GitHub.
const GITHUB_REPO_SVG = `<svg height="16" viewBox="0 0 16 16" width="16">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
</svg>`;
const GITHUB_LANGUAGE_COLORS = {
	CSS: "#663399",
	JavaScript: "#f1e05a",
	TypeScript: "#3178c6",
};
const GITHUB_STAR_SVG = `<svg height="16" viewBox="0 0 16 16" width="16">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
</svg>`;
const GITHUB_FORK_SVG = `<svg height="16" viewBox="0 0 16 16" width="16">
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
</svg>`;

/**
 * @param {string} key
 *
 * @returns {boolean}
 */
function hasKeyInCache(key) {
	if (!window.localStorage) return false;

	const storedValue = localStorage.getItem(key);
	if (!storedValue) return false;

	let cacheResult = null;
	try {
		cacheResult = JSON.parse(storedValue);
	} catch (e) {
		console.warn(`Issue decoding cache for ${key}:`, e);
	}

	if (!cacheResult || !cacheResult.value || !cacheResult.expiresAt) return false;
	if (Date.now() > cacheResult.expiresAt) {
		localStorage.removeItem(key);
		return false;
	}

	return true;
}

/**
 * @param {string} key
 * @returns {object | null}
 */
function getKeyInCache(key) {
	if (!window.localStorage) return null;

	const storedValue = localStorage.getItem(key);
	if (!storedValue) return null;

	let cacheResult = null;
	try {
		cacheResult = JSON.parse(storedValue);
	} catch (e) {
		console.warn(`Issue decoding cache for ${key}:`, e);
	}

	if (!cacheResult || !cacheResult.value || !cacheResult.expiresAt) return null;

	return cacheResult.value;
}

/**
 * @param {string} key
 * @param {object} value
 * @param {number} expiresIn
 */
function setKeyInCache(key, value, expiresIn) {
	if (!window.localStorage) return;

	localStorage.setItem(key, JSON.stringify({ value, expiresAt: Date.now() + expiresIn }));
}

/**
 * @param {string} description
 * @returns {Promise<string>}
 */
async function processGithubDescriptionEmojis(description) {
	const cacheKey = "github-emojis";
	let emojis;
	if (hasKeyInCache(cacheKey)) {
		emojis = getKeyInCache(cacheKey);
	} else {
		const response = await fetch("https://api.github.com/emojis", { headers: { Authorization: "application/vnd.github+json" } });
		if (response.status !== 200) throw Error(`Error fetching emojis list for repo cards:` + (await response.text()));
		emojis = await response.json();

		setKeyInCache(cacheKey, emojis, 5 * 60 * 1000);
	}

	let s = "";
	const descriptionCharacters = [...description];
	let i = 0;
	while (i < descriptionCharacters.length) {
		if (descriptionCharacters[i] !== ":") {
			s += descriptionCharacters[i];
		} else {
			let emojiName = "";
			let j = i + 1;
			for (; j < descriptionCharacters.length; j++) {
				if (descriptionCharacters[j] === ":") break;
				emojiName += descriptionCharacters[j];
			}
			if (!(emojiName in emojis)) {
				s += ":" + emojiName;
				if (j < descriptionCharacters.length) s += ":";
			} else {
				s += `<img src="${emojis[emojiName]}"></img>`;
			}
			i = j;
		}
		i++;
	}
	return s;
}

(async () => {
	let html = "";
	for (const repoTag of REPO_NAMES) {
		try {
			const cacheKey = "repo-" + repoTag;
			let repoInfo;
			if (hasKeyInCache(cacheKey)) {
				repoInfo = getKeyInCache(cacheKey);
			} else {
				const response = await fetch("https://api.github.com/repos/" + repoTag, { headers: { Authorization: "application/vnd.github+json" } });
				if (response.status !== 200) throw Error(`Error fetching ${repoTag}'s data for repo cards:` + (await response.text()));
				const data = await response.json();
				repoInfo = {
					language: data.language,
					stargazers_count: data.stargazers_count,
					forks_count: data.forks_count,
					description: data.description,
					name: data.name,
					full_name: data.full_name,
				};

				setKeyInCache(cacheKey, repoInfo, DEFAULT_CACHE_TIMEOUT);
			}

			html += `<a href="https://www.github.com/${repoInfo.full_name}" target="_blank" aria-label="${repoInfo.description}" class="repo-card">
        <div class="title"><span>${GITHUB_REPO_SVG}<span>${repoInfo.name}</span></span></div>
        <div class="description">${await processGithubDescriptionEmojis(repoInfo.description)}</div>
        <div class="info">
          <span>
            <svg height="16" width="16"><circle cx="8" cy="8" r="5" fill="${repoInfo.language in GITHUB_LANGUAGE_COLORS ? GITHUB_LANGUAGE_COLORS[repoInfo.language] : "green"}"></circle></svg>
            <span>${repoInfo.language}</span>
          </span>
          <span>
            ${GITHUB_STAR_SVG}
            <span>${repoInfo.stargazers_count}</span>
          </span>
          <span>
            ${GITHUB_FORK_SVG}
            <span>${repoInfo.forks_count}</span>
          </span>
        </div>
			</a>`;
		} catch (e) {
			console.error("Error fetching repository data for repo cards:", e);
		}
	}

	const previousProjectsList = document.querySelector("#previous-projects > .repo-card-container");
	if (previousProjectsList) previousProjectsList.innerHTML = html;
})();
