const weathers = ['Rain Dance', 'Sunny Day', 'Hail', 'Snow', 'Sandstorm', 'Locusts',
	'Delta Stream', 'Acid Rain', 'Stellar Storm', 'Darkness', 'Pollen', 'Thunderstorm'];
// const weathers = ['Acid Rain', 'Darkness', 'Twilight Zone', 'Pollen', 'Thunderstorm'];
function newWeather(battle: Battle, currentWeather: string) {
	battle.add('-weather', currentWeather.replace(' ', ''), '[upkeep]');
	battle.eachEvent('Weather');
	const otherWeathers = weathers.filter(item => item !== currentWeather);
	const rndInt = Math.floor(Math.random() * otherWeathers.length);
	const weather = otherWeathers[rndInt];
	const lowercase = weather.toLowerCase().replace(' ', '');
	battle.add('-weather', weather);
	battle.field.weather = lowercase as ID;
	battle.field.weatherState = {id: lowercase};
}

export const Conditions: {[k: string]: ModdedConditionData} = {
	raindance: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.3);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},

		onFieldResidual() {
			newWeather(this, "Rain Dance");
		},
	},
	sunnyday: {
		inherit: true,
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.id === 'hydrosteam' && !attacker.hasItem('utilityumbrella')) {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.3);
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
		},

		onFieldResidual() {
			newWeather(this, "Sunny Day");
		},
	},
	hail: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Hail");
		},
	},
	snow: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Snow");
		},
	},
	sandstorm: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Sandstorm");
		},
	},
	locusts: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Locusts");
		},
	},
	acidrain: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Acid Rain");
		},
	},
	stellarstorm: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Stellar Storm");
		},
	},
	darkness: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Darkness");
		},
	},
	twilightzone: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Twilight Zone");
		},
	},
	pollen: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Pollen");
		},
	},
	thunderstorm: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Thunderstorm");
		},
	},
	deltastream: {
		inherit: true,
		onFieldResidual() {
			newWeather(this, "Delta Stream");
		},
	},
	slp: {
		inherit: true,
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-2 turns
			this.effectState.startTime = this.random(2, 4);
			this.effectState.time = this.effectState.startTime;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
	},
};
