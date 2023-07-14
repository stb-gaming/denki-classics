(async function () {
	'use strict';

	let lists = document.querySelectorAll('#games-lists, .games-lists')[0];

	function createPage() {
		let page = document.createElement("div");
		page.classList.add("games-list");

		let leftTriangle = document.createElement("a");
		leftTriangle.classList.add("triangle", "left");
		leftTriangle.href = "javascript:lastPage()";

		let rightTriangle = document.createElement("a");
		rightTriangle.classList.add("triangle", "right");
		rightTriangle.href = "javascript:nextPage()";

		page.appendChild(leftTriangle);
		page.appendChild(rightTriangle);

		lists.appendChild(page);

		return page;
	}

	/*
	todo: create at the end of each page
	<a class="triangle left" href="javascript:lastPage()"></a>
	<a class="triangle right" href="javascript:nextPage()"></a>
	*/

	function createGame(page, game) {
		let gameEl = document.createElement("a");
		gameEl.classList.add("game");
		Object.assign(gameEl.dataset, game);

		const gameUrlParts = game.url.split("/")
		gameEl.href = `javascript:SkyGames.launchGame('${gameUrlParts[gameUrlParts.length - 2]}')`;

		let gameImage = new Image();
		gameImage.src = "https://stb-gaming.github.io/sky-games/assets/img/games/" + (game.image || game.splash || game.menu || game.gameplay);
		gameEl.appendChild(gameImage);

		page.appendChild(gameEl);
		return gameEl;

	}



	if (typeof SkyGames != 'undefined')
		if (SkyGames.loadGames) {
			const games = await SkyGames.loadGames(),
				pageLength = 9,
				pages = Math.ceil(games.length / pageLength);
			for (let p = 0; p < pages; p++) {
				let offset = p * pageLength,
					page = createPage();
				for (let g = 0; g < pageLength; g++) {
					const game = games[offset + g];
					if (game) createGame(page, game);
				}
			}
		}

})();


function pressBlue() {
	window.location = "../www/settings.html";
}

if (typeof SkyRemote != "undefined") {
	SkyRemote.onPressButton("blue", pressBlue);
}

SkyGames.on("test", () => {
	console.log("hi");
});
