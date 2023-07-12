//let page = 0;
let
	musicplayed = false,

	loadingGame,

	lastMenu = 0,
	menu = 0,

	mainList = document.getElementById("main-screen"),
	tabs = document.getElementById("sky-games-tabs"),
	greenButton = document.querySelector("footer a.green"),
	allList = document.getElementById("all-games"),
	sortOptions = document.getElementById("sort-options"),

	menus = [
		createMenu({
			pages: Array.from(document.getElementsByClassName("games-list")),
			rows: 3,
			columns: 3,
			itemSelector: "a.game",
			onFocus: updateGameInfo,
			animations: true
		}),
		createMenu({
			pages: [sortOptions],
			rows: sortOptions.children.length
		}),
		createMenu({
			pages: [allList],
			rows: Math.ceil(allList.children.length / 3),
			columns: 3
		})
	];
menus.forEach(m => {
	m.init();

	m.getPages().forEach((p, i) => {
		m.getItems(i).forEach(item => {
			item.addEventListener("mouseenter", () => {
				m.goto(item);
			});
		});
	});
});

function nextPage() {
	if (!musicplayed) toggleMusic();
	menus[menu].nextPage();

}
function lastPage() {
	if (!musicplayed) toggleMusic();
	menus[menu].lastPage();
}


function updateGameInfo() {
	let gameInfo = document.getElementById("game-info"),
		image = new Image(),
		currentGame = menus[menu].getSelected();
	gameInfo.getElementsByTagName("h1")[0].innerText = image.alt = currentGame.dataset.title;
	image.src = image_prefix + (currentGame.dataset.gameplay || currentGame.dataset.image || currentGame.dataset.splash);
	if (Math.floor((Date.now() - new Date(currentGame.dataset.archives)) / (1000 * 60 * 60 * 24)))
		gameInfo.classList.add("new");
	else
		gameInfo.classList.remove("new");
	gameInfo.getElementsByTagName("img")[0].replaceWith(image);
	gameInfo.getElementsByTagName("p")[0].innerText = currentGame.dataset.description;
}


function pressRed() {
	let controls = document.getElementById("controls");
	controls.style.display = controls.style.display ? null : "none";
}




function pressGreen() {
	let menuTmp = menu;
	if (menu == 1) {
		menu = lastMenu;
		if (void 0 != sortOptions) sortOptions.style.display = "none";
		if (void 0 != greenButton) greenButton.innerText = "Sort Games";
	} else {
		menu = 1;
		if (void 0 != sortOptions) sortOptions.style.display = null;
		if (void 0 != greenButton) greenButton.innerText = "Back";
	}

	lastMenu = menuTmp;
}

if (allList) allList.style.display = "none";
sortOptions.style.display = "none";

function toggleMusic() {
	if (song.paused) {
		musicplayed = true;
		song.play();
	} else {
		song.pause();
	}

}

let xor = (foo, bar) => (foo && !bar) || (!foo && bar);

function sortBy(attr) {
	//close green menu
	pressBack();

	if (!attr) {
		//go back to main screen
		if (menu != 0) pressBack();
		return;
	}

	menu = 2;
	if (void 0 != allList) allList.textContent = "";
	let games = SKY_GAMES.toSorted((a, b) => {
		let sorted = [a[attr], b[attr]].sort();
		if (xor(sorted[0] == b[attr], typeof a[attr] == "boolean" || typeof b[attr] == "boolean")) {
			return 1;
		} else {
			return -1;
		}
	});
	games.forEach(game => {
		let link = document.createElement("a");
		link.classList.add("game");
		link.href = game.url;
		link.innerText = game.title;
		if (attr != "title" && game[attr]) {

			let attrEl = document.createElement("strong");
			attrEl.innerText = typeof game[attr] == "boolean" ? attr : game[attr];
			link.innerText = ` - ${game.title}`;
			link.prepend(attrEl);
		}
		if (typeof game[attr] == "boolean") link.classList.add("yes");
		link.addEventListener("mouseenter", () => {
			menus[2].goto(link);
		});
		if (void 0 != allList) allList.appendChild(link);
	});
	if (void 0 != allList) allList.style.display = null;
	if (void 0 != tabs) tabs.style.display = "none";
	if (void 0 != mainList) mainList.style.display = "none";
}


function pressYellow() {
	toggleMusic();
}

function pressBack() {

	if (loadingGame) {
		clearTimeout(loadingGame.timeout);
		loadingGame.splash.remove();
		loadingGame = null;
		return;
	}

	if (menu == 1) {
		pressGreen();
		return;
	}
	if (menu != 0) {
		if (void 0 != allList) allList.style.display = "none";
		if (void 0 != mainList) mainList.style.display = null;
		if (void 0 != tabs) tabs.style.display = null;
		if (void 0 != greenButton) greenButton.innerText = "Sort";
		menu = 0;
	}
}


function pressBlue() {
	window.location = "/sky-games";
}

function pressSelect() {
	menus[menu].getSelected().click();
}


function pressLeft() {
	menus[menu].left();
}
function pressRight() {
	menus[menu].right();
}
function pressUp() {
	menus[menu].up();
}
function pressDown() {
	menus[menu].down();
}

SkyRemote.createSkyRemote({
	pressRed, pressGreen, pressYellow, pressBack, pressBlue, pressSelect, pressLeft, pressRight, pressUp, pressDown
});


window.addEventListener("click", () => {
	if (!musicplayed) toggleMusic();
});

Array.from(document.getElementsByClassName("game")).forEach(g => {


	g.addEventListener("click", e => {
		e.preventDefault();

		loadingGame = {
			splash: splash(image_prefix + (g.dataset.splash || g.dataset.image)),
			timeout: setTimeout(() => {
				window.location.href = g.dataset.url;
			}, 5000)
		};
	});
});



document.addEventListener("keyup", event => {
	if (!musicplayed) toggleMusic();
});
