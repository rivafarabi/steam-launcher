const { Extension, INPUT_METHOD, PLATFORMS } = require('deckboard-kit');
const fs = require('fs-extra');
const path = require('path');
const opn = require('opn');
const { acfToJson } = require('./utils');

class SteamLauncherExtension extends Extension {
	constructor() {
		super();
		this.name = 'Steam Launcher';
		this.platforms = [PLATFORMS.WINDOWS];
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
		const drives = ['C:', 'D:', 'E:', 'F:', 'G:'];
		drives.forEach(drive => {
			const steamPath = path.join(
				drive,
				'Program Files (x86)',
				'Steam',
				'steamapps'
			);
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
				console.log('no Steam installation in the drive ' + drive);
			}
		});
		return input;
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
