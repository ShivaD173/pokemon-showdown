export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	unseenfist: {
		inherit: true,
		shortDesc: "This Pokemon's PUNCH moves ignore the target's protection.",
		onModifyMove(move) {
			if (move.flags['punch']) delete move.flags['protect'];
		},
	},
	slowstart: {
		inherit: true,
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 3 turns.",
		condition: {
			duration: 3,
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
	},
	reckless: {
		inherit: true,
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 1.3x power; not Struggle.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage || move.mindBlownRecoil || move.selfdestruct) {
				this.debug('Reckless boost');
				return this.chainModify([13, 10]);
			}
		},
	},
	ironfist: {
		inherit: true,
		shortDesc: "This Pokemon's punch-based attacks have 1.3x power. Sucker Punch is not boosted.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				return this.chainModify([13, 10]);
			}
		},
	},
	berserk: {
		inherit: true,
		shortDesc: "Atk and Sp. Atk raised by 1 when it reaches 1/2 or less of max HP.",
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBerserk = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({atk: 1, spa: 1}, target, target);
			}
		},
	},
	megalauncher: {
		inherit: true,
		shortDesc: "Pulse, Cannon, and Bullet moves have 1.3x Power.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse'] || move.flags['bullet'] || move.name.toLowerCase().includes("cannon")) {
				return this.chainModify(1.3);
			}
		},
	},
	wonderskin: {
		inherit: true,
		shortDesc: "This Pokemon is immune to Status moves.",
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				this.add('-immune', target, '[from] ability: Wonder Skin');
				return null;
			}
		},
	},
	sandforce: {
		inherit: true,
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.5x in Sandstorm; immunity to it.",
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([3, 2]);
				}
			}
		},
	},
	leafguard: {
		inherit: true,
		shortDesc: "Guards Self and Allies from Status Conditions in Sun.",
		onAllySetStatus(status, target, source, effect) {
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Guard');
				}
				return false;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Guard');
				}
				return false;
			}
		},
	},
	runaway: {
		inherit: true,
		shortDesc: "Immune to Trapping.",
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
	},
	tanglinghair: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.add('-ability', target, 'Tangling Hair');
				source.addVolatile('trapped', source, null, 'trapper');
				this.boost({spe: -1}, source, target, null, true);
			}
		},
		shortDesc: "Traps target and -1 speed on contact."
	},
	rivalry: {
		inherit: true,
		shortDesc: "1.5x damage on same gender, 0.9x damage on opposite gender",
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.5);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.9);
				}
			}
		},
	},
	magmaarmor: {
		inherit: true,
		shortDesc: "Reduces Contact damage by 25%, 30% Chance to burn on contact moves.",
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.flags['contact']) mod /= 1.5;
			return this.chainModify(mod);
		},
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('brn', target);
				}
			}
		},
	},
	flamebody: {
		inherit: true,
		shortDesc: "30% to burn on any contact",
		onModifyMove(move) {
			if (!move?.flags['contact'] || move.target === 'self') return;
			if (!move.secondaries) {
				move.secondaries = [];
			}
			move.secondaries.push({
				chance: 30,
				status: 'brn',
				ability: this.dex.abilities.get('flamebody'),
			});
		},
	},
	liquidooze: {
		inherit: true,
		shortDesc: "This Pokemon's contact moves replace items with Black Sludges on hit.",
		onSourceTryHeal(damage, target, source, effect) {
		},
		onModifyMove(move) {
			move.secondaries?.push({
				chance: 100,
				onHit(target) {
					const item = target.getItem();
					if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
					this.add('message', 'Item replaced with Liquid Ooze');
					target.setItem("blacksludge");
				}
			});
		}
	},
	stickyhold: {
		inherit: true,
		shortDesc: "Contact moves make the attacker's items sticky and unusable. Prevents item loss.",
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, target, source)) {
				const item = source.getItem();
				if (this.runEvent('TakeItem', source, null, move, item)) {
					if (!source.itemState.knockedOff) {
						source.itemState.knockedOff = true;
						this.add('-enditem', source, item.name, '[from] ability: Sticky Hold');
					}
				}
			}
		},
	},
	healer: {
		inherit: true,
		shortDesc: "Heals ally by 1/16th, Also 30% to heal ally status.",
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
				if (allyActive.maxhp > allyActive.hp) {
					this.heal(allyActive.baseMaxhp / 16, allyActive, pokemon);
				}
				if (allyActive.status && this.randomChance(3, 10)) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive.cureStatus();
				}
			}
		},
	},
	bigpecks: {
		inherit: true,
		shortDesc: "Immune to defense lowering, +1 Atk/SpA/Spe if intimidated.",
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.def && boost.def < 0) {
				delete boost.def;
				if (!(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
					this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", "[of] " + target);
				}
			}
			if (effect.name === 'Intimidate' && boost.atk) {
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Big Pecks', '[of] ' + target);
				boost.atk = 1;
				boost.spa = 1;
				boost.spe = 1;
			}
		},
	},
	aftermath: {
		inherit: true,
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user loses 1/3 its max HP.",
		onDamagingHit(damage, target, source, move) {
			if (!target.hp && this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 3, source, target);
			}
		},
	},
	illuminate: {
		inherit: true,
		shortDesc: "While this Pokemon is active, all moves have 1.2x accuracy.",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Illuminate');
		},
		onTryBoost(boost, target, source, effect) {
		},
		onModifyMove(move) {
		},
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (typeof accuracy === 'number') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	justified: {
		inherit: true,
		shortDesc: "Immune to Intimidate, +1 Atk, SpA after damaged by a Dark-type move.",
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Dark') {
				this.boost({atk: 1, spa: 1});
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Justified', '[of] ' + target);
			}
		},
	},
	analytic: {
		inherit: true,
		shortDesc: "1.3x power and 1.1x accuracy if it is the last to move in a turn.",
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number') return;
			let boosted = true;
			for (const pokemon of this.getAllActive()) {
				if (pokemon === source) continue;
				if (this.queue.willMove(pokemon)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				return this.chainModify([11, 10]);
			}
		},
	},
	sandveil: {
		inherit: true,
		shortDesc: "1.2x Defense in Sandstorm. Immune to Sandstorm.",
		onModifyAccuracy(accuracy) {
		},
		onModifyDefPriority: 6,
		onModifyDef(def) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.2);
			}
		},
	},
	snowcloak: {
		inherit: true,
		shortDesc: "1.2x Special Defense in Snow.",
		onModifyAccuracy(accuracy) {
		},
		onModifySpDPriority: 6,
		onModifySpD(spd) {
			if (this.field.isWeather(['hail', 'snow'])) {
				return this.chainModify(1.2);
			}
		},
	},
	icebody: {
		inherit: true,
		shortDesc: "Heals 1/16 in Snow. 30% to frostbite on contact.",
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('fst', target);
				}
			}
		},
	},
	heavymetal: {
		inherit: true,
		shortDesc: "This Pokemon's weight is doubled, 1.1x Def and SpDef.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			return this.chainModify([11, 10]);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			return this.chainModify([11, 10]);
		}
	},
	hypercutter: {
		inherit: true,
		shortDesc: "Prevents this Pokemon's attack from ever being lowered.",
		onTryBoost(boost, target, source, effect) {
			if (boost.atk && boost.atk < 0) {
				delete boost.atk;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", "[of] " + target);
				}
			}
		},
	},
	unnerve: {
		inherit: true,
		shortDesc: "On switch-in, lowers the Special Attack of opponents by 1 stage.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Unnerve', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		onEnd() {
		},
		onFoeTryEatItem() {
		},
	},
	swarm: {
		inherit: true,
		shortDesc: "This Pokemon's allies have the power of their bug moves multiplied by 1.5.",
		desc: "This Pokemon's allies have the power of their bug moves multiplied by 1.5.",
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (attacker !== this.effectState.target && move.type === 'Bug') {
				this.debug('Swarm boost');
				return this.chainModify([6144, 4096]);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
		},
		onModifySpA(atk, attacker, defender, move) {
		},
	},
	// Signature Ability Buffs
	plus: {
		inherit: true,
		shortDesc: "Copies all moves used by an ally with Minus.",
		// Done in battle-actions.ts
		onModifySpA(spa, pokemon) {
		}
	},
	minus: {
		inherit: true,
		shortDesc: "Copies all moves used by an ally with Plus.",
		// Done in battle-actions.ts
		onModifySpA(spa, pokemon) {
		}
	},
	toxicchain: {
		inherit: true,
		shortDesc: "This Pokemon's moves have a 40% chance of badly poisoning.",
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Toxic Chain's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.randomChance(4, 10)) {
				target.trySetStatus('tox', source);
			}
		},
	},
	heatproof: {
		inherit: true,
		shortDesc: "Fire damage against this Pokemon is dealt with 1/4 offensive stat; 1/4 burn damage.",
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.25);
			}
		},
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.25);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 4;
			}
		},
	},
	orichalcumpulse: {
		inherit: true,
		shortDesc: "During Sunny Day, Atk and SpA is 1.3333x.",
		onStart(pokemon) {
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('Orichalcum boost');
				return this.chainModify([5461, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('Orichalcum boost');
				return this.chainModify([5461, 4096]);
			}
		},
	},
	hadronengine: {
		inherit: true,
		shortDesc: "During Electric Terrain, Atk and SpA is 1.3333x.",
		onStart(pokemon) {},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				this.debug('Hadron Engine boost');
				return this.chainModify([5461, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (this.field.isTerrain('electricterrain')) {
				this.debug('Hadron Engine boost');
				return this.chainModify([5461, 4096]);
			}
		},
	},
	toxicboost: {
		inherit: true,
		shortDesc: "While Pokemon is poisoned, its attacks have 1.5x power, Immune to psn dmg.",
		onBasePower(basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox')) {
				return this.chainModify(1.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.name === 'psn' || effect.name === 'tox') {
				return false;
			}
		},
	},
	quarkdrive: {
		inherit: true,
		flags: {},
	},
	protosynthesis: {
		inherit: true,
		flags: {},
	},
	waterbubble: {
		inherit: true,
		shortDesc: "This Pokemon's Water power is 1.5x; it can't be burned; Fire power against it is halved.",
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.5);
			}
		},
	},
	supersweetsyrup: {
		shortDesc: "On switch-in, this Pokemon lowers the evasiveness of opponents 1 stage.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Supersweet Syrup');
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Supersweet Syrup', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({evasion: -1}, target, pokemon, null, true);
				}
			}
		},
		name: "Supersweet Syrup",
		rating: 1.5,
		num: 306,
	},
	galewings: {
		inherit: true,
		shortDesc: "If Pokemon's HP is >= 50%, Flying moves have priority increased by 1.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying' && pokemon.hp >= pokemon.maxhp / 2) return priority + 1;
		},
	},
	liquidvoice: {
		inherit: true,
		shortDesc: "Sound moves become water and 1.2x power.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				return this.chainModify([6, 5]);
			}
		},
	},
	truant: {
		inherit: true,
		shortDesc: "This Pokemon heals 25% every other turn instead of using a move.",
		onBeforeMove(pokemon) {
			if (pokemon.removeVolatile('truant')) {
				this.heal(pokemon.baseMaxhp / 4, pokemon, pokemon);
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
			pokemon.addVolatile('truant');
		},
	},
	flowergift: {
		inherit: true,
		shortDesc: "If Sunny Day active, it and allies' Atk, SpA, Def, and SpDef are 1.3x.",
		onAllyModifySpAPriority: 3,
		onAllyModifySpA(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.3);
			}
		},
		onAllyModifyDef(spd, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.3);
			}
		},
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.3);
			}
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.3);
			}
		},
	},
	quickdraw: {
		inherit: true,
		shortDesc: "30% chance to move first in priority bracket with attack, 60% if Bullet Move.",
		onFractionalPriority(priority, pokemon, target, move) {
			const numerator = (move.flags['bullet']) ? 6 : 3;
			if (move.category !== "Status" && this.randomChance(numerator, 10)) {
				this.add('-activate', pokemon, 'ability: Quick Draw');
				return 0.1;
			}
		},
	},
	colorchange: {
		inherit: true,
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, failskillswap: 1, breakable: 1},
		shortDesc: "Changes type to be perfect offensive and defensive type once per turn.",
		onResidualOrder: 29,
		onResidual(pokemon) {
			this.effectState.colorChange = false;
		},
		onSwitchIn(pokemon) {
			delete this.effectState.colorChange;
		},
		onPrepareHit(source, target, move) {
			if (this.effectState.colorChange) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.colorChange = true;
				this.add('-start', source, 'typechange', type, '[from] ability: Color Change');
			}
		},
		onAfterMoveSecondary(target, source, move) {
			return;
		},
		onTryHit(target, source, move) {
			if (this.effectState.colorChange) return;
			if (source === target) return;
			let type = move.type;
			switch (type) {
			case 'Normal':
				type = 'Ghost';
				break;
			case 'Fighting':
				type = 'Ghost';
				break;
			case 'Flying':
				type = 'Rock';
				break;
			case 'Poison':
				type = 'Steel';
				break;
			case 'Ground':
				type = 'Flying';
				break;
			case 'Rock':
				type = 'Fighting';
				break;
			case 'Bug':
				type = 'Poison';
				break;
			case 'Ghost':
				type = 'Normal';
				break;
			case 'Steel':
				type = 'Steel';
				break;
			case 'Fire':
				type = 'Fire';
				break;
			case 'Water':
				type = 'Water';
				break;
			case 'Grass':
				type = 'Grass';
				break;
			case 'Electric':
				type = 'Ground';
				break;
			case 'Psychic':
				type = 'Dark';
				break;
			case 'Ice':
				type = 'Ice';
				break;
			case 'Dragon':
				type = 'Fairy';
				break;
			case 'Dark':
				type = 'Dark';
				break;
			case 'Fairy':
				type = 'Poison';
				break;
			}
			if (move.pranksterBoosted) {
				type = 'Dark';
			}
			if (move.flags['powder']) {
				type = 'Grass';
			}
			if (type && type !== '???' && target.getTypes().join() !== type) {
				if (!target.setType(type)) return;
				this.effectState.colorChange = true;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');
			}
		},
	},
	normalize: {
		inherit: true,
		shortDesc: "All moves are normal, but are 1.2x power and ignore immunities and resistances.",
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onModifyDamage(damage, source, target, move) {
			const typeMod = target.getMoveHitData(move).typeMod;
			if (typeMod < 0) {
				return this.chainModify(Math.pow(2, -typeMod));
			}
		},
	},
	mimicry: {
		inherit: true,
		shortDesc: "Sets primary type to terrain, Sets terrain if use move of corresponding type",
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type === "Electric") this.field.setTerrain('electricterrain');
			if (type === "Grass") this.field.setTerrain('grassyterrain');
			if (type === "Psychic") this.field.setTerrain('psychicterrain');
			if (type === "Fairy") this.field.setTerrain('mistyterrain');
		},
		onTerrainChange(pokemon) {
			let types;
			switch (this.field.terrain) {
			case 'electricterrain':
				types = ['Electric', 'Steel'];
				break;
			case 'grassyterrain':
				types = ['Grass', 'Steel'];
				break;
			case 'mistyterrain':
				types = ['Fairy', 'Steel'];
				break;
			case 'psychicterrain':
				types = ['Psychic', 'Steel'];
				break;
			default:
				types = pokemon.baseSpecies.types;
			}
			const oldTypes = pokemon.getTypes();
			if (oldTypes.join() === types.join() || !pokemon.setType(types)) return;
			if (this.field.terrain || pokemon.transformed) {
				this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
				if (!this.field.terrain) this.hint("Transform Mimicry changes you to your original un-transformed types.");
			} else {
				this.add('-activate', pokemon, 'ability: Mimicry');
				this.add('-end', pokemon, 'typechange', '[silent]');
			}
		},
	},
	// longreach: {
	// 	inherit: true,
	// 	shortDesc: "Moves no longer make contact, Arrow moves do 1.5x",
	// 	onBasePower(basePower, attacker, defender, move) {
	// 		if (['Triple Arrows', 'Thousand Arrows', 'Spirit Shackle'].includes(move.name)) {
	// 			this.debug('Long Reach boost');
	// 			return this.chainModify([3, 2]);
	// 		}
	// 	},
	// },
	wonderguard: {
		inherit: true,
		shortDesc: "If not Terad, then can only be damaged by supereffective moves and indirect damage.",
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			if (target.terastallized) return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
				}
				return null;
			}
		},
	},
	punkrock: {
		inherit: true,
		shortDesc: "This Pokemon receives 1/2 damage from sound moves. Its own have 1.5x power.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock boost');
				return this.chainModify([3, 2]);
			}
		},
	},
	zenmode: {
		inherit: true,
		shortDesc: "Switches to Zen move if less than 75% health",
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp * 3 / 4 && !['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp * 3 / 4 && ['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
				pokemon.removeVolatile('zenmode');
			}
		},
	},
	gulpmissile: {
		inherit: true,
		shortDesc: "When hit after Surf/Dive and start, attacker takes 33% and -1 Def or Para.",
		onSwitchIn(pokemon) {
			if (
				pokemon.hasAbility('gulpmissile') && pokemon.species.name === 'Cramorant'
			) {
				const forme = pokemon.hp <= pokemon.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				pokemon.formeChange(forme);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (!source.hp || !source.isActive || target.transformed || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 3, source, target);
				if (target.species.id === 'cramorantgulping') {
					this.boost({def: -1}, source, target, null, true);
				} else {
					source.trySetStatus('par', target, move);
				}
				target.formeChange('cramorant', move);
			}
		},
	},
	pastelveil: {
		inherit: true,
		shortDesc: "This pokemon and its allies cannot be statused, cure on switch in.",
		onStart(pokemon) {
			for (const ally of pokemon.alliesAndSelf()) {
				if (ally.status) {
					this.add('-activate', pokemon, 'ability: Pastel Veil');
					ally.cureStatus();
				}
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status) {
				this.add('-activate', pokemon, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Pastel Veil');
			}
			return false;
		},
		onAllySetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Pastel Veil', '[of] ' + effectHolder);
			}
			return false;
		},
	},
	grasspelt: {
		inherit: true,
		shortDesc: "If Grassy Terrain is up, Atk, Def, and SpDef are multiplied by 1.5.",
		onModifyAtkPriority: 6,
		onModifyAtk(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		onModifySpDPriority: 6,
		onModifySpD(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
	},
	myceliummight: {
		inherit: true,
		shortDesc: "Status moves ignore abilities. Powder moves go last in their priority bracket.",
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.flags['powder']) {
				return -0.1;
			}
		},
	},
	battlebond: {
		inherit: true,
		shortDesc: "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Greninja-Ash', this.effect, true);
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' &&
				!attacker.transformed) {
				move.multihit = 3;
			}
		},
	},
	receiver: {
		inherit: true,
		shortDesc: "Inherits ability and boosts when ally faints.",
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			if (this.effectState.target.setAbility(ability)) {
				this.boost(target.boosts, this.effectState.target, this.effectState.target);
				this.add('-ability', this.effectState.target, ability, '[from] ability: Receiver', '[of] ' + target);
			}
		},
	},
	supremeoverlord: {
		inherit: true,
		shortDesc: "15% more power per fainted ally, Max 45%.",
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [20, 23, 26, 29, 29, 29];
				return this.chainModify([powMod[this.effectState.fallen], 20]);
			}
		},
	},
	// magician: {
	// 	inherit: true,
	// 	shortDesc: "Sets Magic Room on entrance, steals item with attack.",
	// 	onStart(source) {
	// 		this.field.addPseudoWeather('magicroom');
	// 	},
	// },
	watercompaction: {
		inherit: true,
		shortDesc: "This Pokemon's defense is raised by 2 stages if hit by a Water move; Water Immunity.",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({def: 2})) {
					this.add('-immune', target, '[from] ability: Water Compaction');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},
	emergencyexit: {
		inherit: true,
		shortDesc: "When reaches <= 50% HP, Immediately attacks and then switches out.",
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			for (const action of this.queue.list as MoveAction[]) {
				if (
					!action.move || !action.pokemon?.isActive ||
					action.pokemon.fainted || action.maxMove || action.zmove
				) {
					continue;
				}
				if (action.pokemon === target) {
					this.add('-activate', target, 'ability: Emergency Exit');
					this.queue.prioritizeAction(action);
					(action.move.selfSwitch as boolean) = true;
					target.switchFlag = false;
					break;
				}
			}
		},
	},
	corrosion: {
		inherit: true,
		shortDesc: "Can poison regardless of typing, Poison moves hit Steel.",
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
	},
	honeygather: {
		inherit: true,
		shortDesc: "Boosts Pollen Puff damage and healing by 50%",
		onBasePower(basePower, attacker, defender, move) {
			if (move.name === "Pollen Puff") {
				return this.chainModify([3, 2]);
			}
		},
	},
	windrider: {
		inherit: true,
		shortDesc: "+1 Atk when Tailwind begins, +2 Attack if hit by a wind move. Wind move immunity.",
		onStart(pokemon) {
			if (pokemon.side.sideConditions['tailwind']) {
				this.boost({atk: 1}, pokemon, pokemon);
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.flags['wind']) {
				if (!this.boost({atk: 2}, target, target)) {
					this.add('-immune', target, '[from] ability: Wind Rider');
				}
				return null;
			}
		},
		onAllySideConditionStart(target, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				this.boost({atk: 1}, pokemon, pokemon);
			}
		},
	},
	guarddog: {
		inherit: true,
		shortDesc: "Takes an attack directed at ally once per switch in, Reverses Intim",
		onSwitchIn(pokemon) {
			this.effectState.guardDog = false;
		},
		onFoeRedirectTarget(target, source, source2, move) {
			if (this.effectState.guardDog) return;
			if (!this.effectState.target.isSkyDropped() && this.validTarget(this.effectState.target, source, move.target)) {
				if (move.smartTarget) move.smartTarget = false;
				this.add('-activate', source, 'ability: Guard Dog');
				this.effectState.guardDog = true;
				return this.effectState.target;
			}
		},
	},
	perishbody: {
		inherit: true,
		shortDesc: "Attacking this Pokemon starts the Perish Song effect for the attacker.",
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['perishsong']) return;
			this.add('-ability', target, 'Perish Body');
			source.addVolatile('perishsong');
		},
	},
	mummy: {
		inherit: true,
		shortDesc: "On contact: Ability changed to Mummy; 0.8x Atk, SpAtk to non-Cofagrigus.",
		onModifyAtkPriority: 6,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.baseSpecies !== "Cofagrigus") {
				return this.chainModify([4, 5]);
			}
		},
		onModifySpAPriority: 6,
		onModifySpA(spa, pokemon) {
			if (pokemon.species.baseSpecies !== "Cofagrigus") {
				return this.chainModify([4, 5]);
			}
		}
	},
	wanderingspirit: {
		inherit: true,
		shortDesc: "On contact: Abilities swapped; 0.8x Def, SpDef to non-Runerigus.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.species.baseSpecies !== "Runerigus") {
				return this.chainModify([4, 5]);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.species.baseSpecies !== "Runerigus") {
				return this.chainModify([4, 5]);
			}
		}
	},
	fullmetalbody: {
		inherit: true,
		shortDesc: "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves.",
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		onTryBoost(boost, target, source, effect) {
		},
	},
	lingeringaroma: {
		inherit: true,
		shortDesc: "On contact: Abilities swapped; -1 Priority to non-Oinkologne",
		onModifyPriority(priority, pokemon, target, move) {
			if (pokemon.species.baseSpecies !== "Oinkologne") {
				return priority - 1;
			}
		},
	},
	schooling: {
		inherit: true,
		shortDesc: "Heals 1/16th each turn. Changes to School Form if it has > 1/4 max HP, else Solo Form.",
		onResidual(pokemon) {
			if (
				pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 ||
				pokemon.transformed || !pokemon.hp
			) return;
			this.heal(pokemon.baseMaxhp / 16);
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
	},
	angershell: {
		inherit: true,
		shortDesc: "Once per turn, if user gets hit, +1 Atk/SpA/Spe and -1 Def/SpD.",
		onResidual(pokemon) {
			this.effectState.angerShell = false;
		},
		onDamage(damage, target, source, effect) {
		},
		onTryEatItem(item) {
		},
		onAfterMoveSecondary(target, source, move) {
		},
		onDamagingHit(damage, target, source, move) {
			if (!this.effectState.angerShell) {
				this.boost({atk: 1, spa: 1, spe: 1, def: -1, spd: -1}, target, target);
				this.effectState.angerShell = true;
			}
		},
	},
	curiousmedicine: {
		inherit: true,
		shortDesc: "On switch-in, all pokemon have their stat stages reset to 0.",
		onStart(source) {
			this.add('-ability', source, 'Curious Medicine');
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
	},
	cottondown: {
		inherit: true,
		shortDesc: "If this Pokemon is hit, gets +1 Def, All other Pokemon: -1 Speed.",
		onDamagingHit(damage, target, source, move) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon === target || pokemon.fainted) continue;
				if (!activated) {
					// this.add('-ability', target, 'Cotton Down');
					this.boost({def: 1}, target, target);
					activated = true;
				}
				this.boost({spe: -1}, pokemon, target, null, true);
			}
		},
	},
	stancechange: {
		inherit: true,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = ((move.id === 'kingsshield' || move.id === 'behemothbash') ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
	},
	// Ruin Nerf
	swordofruin: {
		inherit: true,
		shortDesc: "Active Pokemon without this ability have their Def multiplied by 0.8.",
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Sword of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Sword of Ruin Def drop');
			return this.chainModify(0.8);
		},
	},
	tabletsofruin: {
		inherit: true,
		shortDesc: "Active Pokemon without this ability have their Atk multiplied by 0.8.",
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Tablets of Ruin')) return;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Tablets of Ruin Atk drop');
			return this.chainModify(0.8);
		},
	},
	vesselofruin: {
		inherit: true,
		shortDesc: "Active Pokemon without this ability have their SpAtk multiplied by 0.8.",
		onAnyModifySpA(spa, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Vessel of Ruin')) return;
			if (!move.ruinedSpA) move.ruinedSpA = abilityHolder;
			if (move.ruinedSpA !== abilityHolder) return;
			this.debug('Vessel of Ruin SpA drop');
			return this.chainModify(0.8);
		},
	},
	beadsofruin: {
		inherit: true,
		shortDesc: "Active Pokemon without this ability have their SpDef multiplied by 0.8.",
		onAnyModifySpD(spd, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Beads of Ruin')) return;
			if (!move.ruinedSpD?.hasAbility('Beads of Ruin')) move.ruinedSpD = abilityHolder;
			if (move.ruinedSpD !== abilityHolder) return;
			this.debug('Beads of Ruin SpD drop');
			return this.chainModify(0.8);
		},
	},
	// turboblaze/teravolt buffs
	turboblaze: {
		inherit: true,
		shortDesc: "Mold Breaker. Fire moves: 1.2x when resisted.",
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0 && move.type === 'Fire') {
				this.debug('Turboblaze boost');
				return this.chainModify([4915, 4096]);
			}
		},
	},
	teravolt: {
		inherit: true,
		shortDesc: "Mold Breaker. Electric moves: Immunity becomes resistance, 1.2x when resisted.",
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0 && move.type === 'Electric') {
				this.debug('Teravolt boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Electric'] = true;
			}
		},
		onFoeEffectiveness(typeMod, target, type, move) {
			if (type === 'Ground' && move.type === 'Electric') return -1;
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
			case 'sandstorm':
				type = "Rock";
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
	// As One now gives Symbioisis
	asoneglastrier: {
		inherit: true,
		shortDesc: "Combination of the Symbiosis and Chilling Neigh Abilities.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onEnd() {
		},
		onFoeTryEatItem() {
			return true;
		},
		onAllyAfterUseItem(item, pokemon) {
			if (pokemon.switchFlag) return;
			const source = this.effectState.target;
			const myItem = source.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				source.item = myItem.id;
				return;
			}
			this.add('-activate', source, 'ability: As One', myItem, '[of] ' + pokemon);
		},
	},
	asonespectrier: {
		inherit: true,
		shortDesc: "Combination of the Symbiosis and Grim Neigh Abilities.",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onEnd() {
		},
		onFoeTryEatItem() {
			return true;
		},
		onAllyAfterUseItem(item, pokemon) {
			if (pokemon.switchFlag) return;
			const source = this.effectState.target;
			const myItem = source.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				source.item = myItem.id;
				return;
			}
			this.add('-activate', source, 'ability: As One', myItem, '[of] ' + pokemon);
		},
	},
	// Diancie now "Mega Evolves on switch in cuz I feel like it"
	// magicbounce: {
	// 	inherit: true,
	// 	onPreStart(pokemon) {
	// 		if (pokemon.baseSpecies.baseSpecies !== 'Diancie') return;
	// 		if (pokemon.species.forme !== 'Mega') {
	// 			this.add('-activate', pokemon, 'ability: Magic Bounce');
	// 			pokemon.formeChange('Diancie-Mega', this.effect, true);
	// 		}
	// 	},
	// },
	// New Abilities
	triplethreat: {
		inherit: true,
		isNonstandard: null,
	},
	mindsurfer: {
		inherit: true,
		isNonstandard: null,
	},
	thunderstorm: {
		inherit: true,
		isNonstandard: null,
	},
	justthetip: {
		inherit: true,
		isNonstandard: null,
	},
	arcticrush: {
		inherit: true,
		isNonstandard: null,
	},
	cloakchange: {
		inherit: true,
		isNonstandard: null,
	},
	bigballs: {
		inherit: true,
		isNonstandard: null,
	},
	oddkeystone: {
		inherit: true,
		isNonstandard: null,
	},
	monkeybusiness: {
		inherit: true,
		isNonstandard: null,
	},
	wideeyed: {
		inherit: true,
		isNonstandard: null,
	},
	constrictor: {
		inherit: true,
		isNonstandard: null,
	},
	heatsink: {
		inherit: true,
		isNonstandard: null,
	},
	captivatingsong: {
		inherit: true,
		isNonstandard: null,
	},
	transphobia: {
		inherit: true,
		isNonstandard: null,
	},
	homophobia: {
		inherit: true,
		isNonstandard: null,
	},
	ilvaticano: {
		inherit: true,
		isNonstandard: null,
	},
	lawnsurfer: {
		inherit: true,
		isNonstandard: null,
	},
	trueaurora: {
		inherit: true,
		isNonstandard: null,
	},
	singularity: {
		inherit: true,
		isNonstandard: null,
	},
	catscradle: {
		inherit: true,
		isNonstandard: null,
	},
	superduperluck: {
		inherit: true,
		isNonstandard: null,
	},
	largewingspan: {
		inherit: true,
		isNonstandard: null,
	},
	theflock: {
		inherit: true,
		isNonstandard: null,
	},
	growingpumpkin: {
		inherit: true,
		isNonstandard: null,
	},
	doubledown: {
		inherit: true,
		isNonstandard: null,
	},
	sinnohangrit: {
		inherit: true,
		isNonstandard: null,
	},
	hammertime: {
		inherit: true,
		isNonstandard: null,
	},
	rampage: {
		inherit: true,
		isNonstandard: null,
	},
	calmb4storm: {
		inherit: true,
		isNonstandard: null,
	},
	lifetaker: {
		inherit: true,
		isNonstandard: null,
	},
	shadowtagged: {
		inherit: true,
		isNonstandard: null,
	},
	moltendown: {
		inherit: true,
		isNonstandard: null,
	},
	fightingspirit: {
		inherit: true,
		isNonstandard: null,
	},
	tremorsense: {
		inherit: true,
		isNonstandard: null,
	},
	regalmajesty: {
		inherit: true,
		isNonstandard: null,
	},
	putridstench: {
		inherit: true,
		isNonstandard: null,
	},
	windchime: {
		inherit: true,
		isNonstandard: null,
	},
	machinelearning: {
		inherit: true,
		isNonstandard: null,
	},
	mysticfist: {
		inherit: true,
		isNonstandard: null,
	},
	ballin: {
		inherit: true,
		isNonstandard: null,
	},
	runningstart: {
		inherit: true,
		isNonstandard: null,
	},
	dauntless: {
		inherit: true,
		isNonstandard: null,
	},
	copycore: {
		inherit: true,
		isNonstandard: null,
	},
	onslaughtcore: {
		inherit: true,
		isNonstandard: null,
	},
	barriercore: {
		inherit: true,
		isNonstandard: null,
	},
	hazardcore: {
		inherit: true,
		isNonstandard: null,
	},
	hyperbolictime: {
		inherit: true,
		isNonstandard: null,
	},
	megashiftx: {
		inherit: true,
		isNonstandard: null,
	},
	megashifty: {
		inherit: true,
		isNonstandard: null,
	},
	timelord: {
		inherit: true,
		isNonstandard: null,
	},
	ancestor: {
		inherit: true,
		isNonstandard: null,
	},
	serenegracidea: {
		inherit: true,
		isNonstandard: null,
	},
	loophole: {
		inherit: true,
		isNonstandard: null,
	},
	stuckinthepast: {
		inherit: true,
		isNonstandard: null,
	},
};
