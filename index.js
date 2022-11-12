const { Extension, INPUT_METHOD, PLATFORMS, log } = require('deckboard-kit');
const fs = require('fs-extra');
const path = require('path');
const opn = require('opn');
const { acfToJson } = require('./utils');

class SteamLauncherExtension extends Extension {
	constructor() {
		super();
		this.name = 'Steam Launcher';
		this.platforms = [PLATFORMS.WINDOWS];
		this.configs = {
			steamPaths: {
				type: 'array',
				name: 'Paths',
				descriptions: '',
				value: [
					path.join(
						'C:',
						'Program Files (x86)',
						'Steam',
						'steamapps'
					),
					path.join('D:', 'Program Files (x86)', 'Steam', 'steamapps')
				]
			}
		};
		this.initExtension();
	}

	initExtension() {
		this.setInputOptions();
	}

	update() {
		this.setInputOptions();
	}

	setInputOptions() {
		this.inputs = [
			{
				label: 'Launch Game',
				value: 'steam-launch-games',
				icon: 'steam',
				fontIcon: 'fab',
				color: '#171A21',
				input: [
					{
						label: 'Game',
						ref: 'appid',
						type: INPUT_METHOD.INPUT_SELECT,
						items: this.getGameList()
					}
				]
			}
		];
	}

	getGameList() {
		let input = [];
		this.configs.steamPaths.value.forEach(steamPath => {
			try {
				const steamappsdir = fs.readdirSync(steamPath);
				if (steamappsdir) {
					const acfFiles = steamappsdir.filter(
						x => x.split('.').pop() === 'acf'
					);
					const gamesObject = acfFiles.map(x => {
						const raw = fs.readFileSync(path.join(steamPath, x));
						const { appid, name } = acfToJson(raw);
						return { value: appid, label: name };
					});
					input = [...input, ...gamesObject];
				}
			} catch (err) {
				log.error(
					'no Steam installation in the directory ' + steamPath
				);
			}
		});
		return input.sort((a, b) => a.label - b.label);
	}

	execute(action, { appid }) {
		switch (action) {
			case 'steam-launch-games':
				opn('steam://rungameid/' + appid);
				break;
			default:
				break;
		}
	}
}

module.exports = new SteamLauncherExtension();
