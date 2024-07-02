export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	deltastream: {
		inherit: true,
		isNonstandard: null,
		onAnySetWeather(target, source, weather) {
		}
	},
	arcticrush: {
		inherit: true,
		isNonstandard: null,
	},
	loveydovey: {
		inherit: true,
		isNonstandard: null,
	},
	acidrain: {
		inherit: true,
		isNonstandard: null,
	},
	pollinator: {
		inherit: true,
		isNonstandard: null,
	},
	trueaurora: {
		inherit: true,
		isNonstandard: null
	},
	rampage: {
		inherit: true,
		isNonstandard: null
	},
	mysticfist: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "This Pokemon's punch attacks have 1.2x power and become Special.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	swarm: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "On switch-in, this Pokemon summons Locusts.",
		desc: "On switch-in, this Pokemon summons Locusts.",
		onStart(source) {
			this.field.setWeather('locusts');
		},
		onModifyAtk() {},
		onModifySpA() {}
	},
	illuminate: {
		inherit: true,
		shortDesc: "This pokemon and allies have 1.1x Accuracy, 1.3x in Darkness",
		onTryBoost(boost, target, source, effect) {
		},
		onModifyMove(move) {
		},
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
				if (source.effectiveWeather() === "darkness") {
					return this.chainModify([5325, 4096]);
				} else {
					return this.chainModify([4506, 4096]);
				}
			}
		},
	},
	thunderstorm: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Sets Thunderstorm on Entry.",
		desc: "Sets Thunderstorm on Entry.",
		onStart(source) {
			this.field.setWeather('thunderstorm');
		},
	},
	surgesurfer: {
		inherit: true,
		shortDesc: "If Thunderstorm is active, this Pokemon's Speed is doubled.",
		onModifySpe(spe) {
			if (this.field.isWeather("Thunderstorm")) {
				return this.chainModify(2);
			}
		},
	},
	windrider: {
		inherit: true,
		shortDesc: "Attack +1 if hit by wind move or Tailwind/Strong Winds begins. Wind move immunity.",
		onStart(pokemon) {
			if (pokemon.side.sideConditions['tailwind']) {
				this.boost({atk: 1}, pokemon, pokemon);
			}
			if (pokemon.effectiveWeather() === "deltastream") {
				this.boost({atk: 1}, pokemon, pokemon);
			}
		},
		onWeatherChange(pokemon) {
			if (pokemon.effectiveWeather() === "deltastream") {
				this.boost({atk: 1}, pokemon, pokemon);
			}
		},
		onAllySideConditionStart(target, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				this.boost({atk: 1}, pokemon, pokemon);
			}
		},
	},
	windpower: {
		inherit: true,
		shortDesc: "Pokemon gains Charge when hit by a wind move or Tailwind/Strong Winds begins.",
		onAllySideConditionStart(target, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				pokemon.addVolatile('charge');
			}
		},
		onWeatherChange(pokemon) {
			if (pokemon.effectiveWeather() === "deltastream") {
				pokemon.addVolatile('charge');
			}
		},
	},
	rivalry: {
		inherit: true,
		shortDesc: "1.3x damage on same gender, 0.9x damage on opposite gender",
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender || attacker.effectiveWeather() === "loveintheair") {
					this.debug('Rivalry boost');
					return this.chainModify(1.3);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.9);
				}
			}
		},
	},
	forecast: {
		inherit: true,
		shortDesc: "Castform's type changes to the current weather condition's type",
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			if (pokemon.species.id !== 'castform') forme = 'Castform';
			let type = "Normal";
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				type = "Fire";
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				type = "Water";
				break;
			case 'hail':
			case 'snow':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				type = "Ice";
				break;
			case 'deltastream':
				type = "Flying";
				break;
			case 'thunderstorm':
				type = "Electric";
				break;
			case 'pollen':
				type = "Grass";
				break;
			case 'locusts':
				type = "Bug";
				break;
			case 'acidrain':
				type = "Poison";
				break;
			case 'darkness':
				type = "Dark";
				break;
			case 'twilightzone':
				type = "Ghost";
				break;
			case 'loveintheair':
				type = "Fairy";
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');
			}
			if (type && pokemon.getTypes().join() !== type) {
				if (!pokemon.setType(type)) return;
				this.add('-start', pokemon, 'typechange', type, '[from] ability: Forecast');
			}
		},
	},
	lonewolf: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "1.5x damage if alone or in darkness.",
		desc: "1.5x damage if no allies on the field or in darkness.",
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.side.hasAlly(attacker) || attacker.effectiveWeather() === "darkness") {
				this.add('-activate', attacker, 'ability: Lone Wolf');
				return this.chainModify([6144, 4096]);
			}
		},
	},

	sandveil: {
		inherit: true,
		shortDesc: "1.2x defenses in Sandstorm. Immune to Sandstorm.",
		onModifyAccuracy(accuracy) {
		},
		onModifyDefPriority: 6,
		onModifyDef(def) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.2);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(def) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.2);
			}
		},
	},
	snowcloak: {
		inherit: true,
		shortDesc: "1.2x defenses in Snow.",
		onModifyAccuracy(accuracy) {
		},
		onModifyDefPriority: 6,
		onModifyDef(spd) {
			if (this.field.isWeather(['hail', 'snow'])) {
				return this.chainModify(1.2);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd) {
			if (this.field.isWeather(['hail', 'snow'])) {
				return this.chainModify(1.2);
			}
		},
	},
	overcoat: {
		inherit: true,
		shortDesc: "This Pokemon is immune to powder moves, Weather damage, and Effect Spore.",
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'swarm' ||
			 type === 'acidrain' || type === 'powder') return false;
		},
	},
	raindish: {
		inherit: true,
		shortDesc: "If Rain Dance is active, this Pokemon heals 1/8 of its max HP each turn.",
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 8);
			}
		},
	},
	reckless: {
		inherit: true,
		shortDesc: "ALL of this Pokemon's attacks with self-damage have 1.2x power; not Struggle.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage || move.mindBlownRecoil || move.selfdestruct) {
				this.debug('Reckless boost');
				return this.chainModify([12, 10]);
			}
		},
	},
	megalauncher: {
		inherit: true,
		shortDesc: "Pulse, and Bullet moves have 1.5x Power.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse'] || move.flags['bullet']) {
				return this.chainModify(1.5);
			}
		},
	},
};
