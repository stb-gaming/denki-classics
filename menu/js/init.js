(async function () {
	'use strict';

	let lists = document.querySelectorAll('#games-lists .games-lists')[0],
		triangleLeft = document.querySelectorAll(".triangle.left")[0];

	function createPage() {
		let page = document.createElement("div");
		page.classList.add("games-list");

		lists.appendChild(page);

		// uncomment this is anything breaks
		//lists.insertBefore(triangleLeft, page);

		return page;
	}

	function createGame(page, gameInfo) {
		let game = document.createElement("a");
		Object.assign(game.dataset, gameInfo);
		game.href = `javascript:SkyGames.launchGame(${game.url})"`;

		let gameImage = new Image();
		gameImage.src = "https://stb-gaming.github.io/sky-games/assets/img/games/" + (game.image || game.splash || game.menu || game.gameplay);

		page.appendChild(game);
		return game;

	}



	if (typeof SkyGames != 'undefined')
		if (SkyGames.loadGames) {
			const games = await SkyGames.loadGames(),
				pageLength = 9,
				pages = Math.round(games.length / pageLength);
			for (let p = 0; p < pages; p++) {
				let offset = p * pageLength,
					page = createPage();
				for (let g = offset; g - offset < pageLength || g < games.length; g++) {
					const game = games[g];
					createGame(page, game);
				}
			}
		}

})();
