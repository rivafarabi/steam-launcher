const { Extension, INPUT_METHOD, PLATFORMS } = require('deckboard-kit');
const fs = require('fs-extra');
const path = require('path');
const opn = require('opn');

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
						items: this.extractGameList()
					}
				]
			}
		];
	}

	extractGameList() {
		const acfToJson = raw => {
			return JSON.parse(
				raw
					.toString()
					.split('LastUpdated')[0]
					.replace(/AppState/g, '')
					.replace(/"/g, '')
					.replace(/\t\t/g, '": "')
					.replace(/\n/g, '", "')
					.replace(/\t/g, ' ')
					.replace(/ " /g, ' "')
					.replace('", "{", ', '{ ')
					.slice(0, -3) + '}'
			);
		};

		const steamappsdir = fs.readdirSync(
			'C:\\Program Files (x86)\\Steam\\steamapps'
		);
		const acfFiles = steamappsdir.filter(x => x.split('.').pop() === 'acf');
		const gameArrays = acfFiles.map(x => {
			const raw = fs.readFileSync(
				path.join('C:\\Program Files (x86)\\Steam\\steamapps', x)
			);
			const { appid, name } = acfToJson(raw);
			return { value: appid, label: name };
		});

		return gameArrays;
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
