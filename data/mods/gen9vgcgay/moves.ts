export const Moves: {[k: string]: ModdedMoveData} = {
	struggle: {
		inherit: true,
		basePower: 80,
	},
	// Sleep Nerf
	spore: {
		inherit: true,
		pp: 5,
		shortDesc: "Puts target to sleep. Fails if priority",
		onTryMove(attacker, defender, move) {
			if (move.pranksterBoosted) {
				this.add('-fail', attacker, 'move: Spore');
			}
		},
	},
	hypnosis: {
		inherit: true,
		pp: 10,
	},
	sleeppowder: {
		inherit: true,
		pp: 10,
	},
	// Omniboost moves
	ominouswind: {
		inherit: true,
		"isNonstandard": null,
		shortDesc: "20% chance to raise all stats by 1 (not acc/eva).",
		secondary: {
			chance: 20,
			self: {
				boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
			},
		},
	},
	ancientpower: {
		inherit: true,
		"isNonstandard": null,
		shortDesc: "20% chance to raise all stats by 1 (not acc/eva).",
		secondary: {
			chance: 20,
			self: {
				boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
			},
		},
	},
	"silverwind": {
		"inherit": true,
		shortDesc: "20% chance to raise all stats by 1 (not acc/eva).",
		secondary: {
			chance: 20,
			self: {
				boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
			},
		},
		"isNonstandard": null,
	},
	// Multi Hits
	"barrage": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"type": "Psychic",
		"isNonstandard": null,
	},
	"cometpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"category": "Physical",
		"type": "Fairy",
		"isNonstandard": null,
	},
	"spikecannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		multihit: [2, 5],
		"category": "Physical",
		"type": "Steel",
		"isNonstandard": null,
	},
	"furyattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		multihit: [2, 5],
		"category": "Physical",
		"type": "Flying",
		"isNonstandard": null,
	},
	furyswipes: {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
	},
	pinmissile: {
		"inherit": true,
		"accuracy": 100,
	},
	tailslap: {
		"inherit": true,
		"accuracy": 100,
		shortDesc: "Hits 3-5 Times",
		multihit: [3, 5],
	},
	"flameburst": {
		"inherit": true,
		"accuracy": 100,
		multihit: [2, 5],
		shortDesc: "Hits 2-5 Times, does 1/16 each to other enemy",
		"basePower": 20,
		"category": "Special",
		"type": "Fire",
		"isNonstandard": null,
	},
	rockblast: {
		inherit: true,
		accuracy: 95,
	},
	armthrust: {
		inherit: true,
		basePower: 25
	},
	clamp: {
		inherit: true,
		isNonstandard: null,
		basePower: 25,
		accuracy: 100,
		volatileStatus: undefined,
		multihit: [2, 5],
		desc: "Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
	},
	"swagger": {
		inherit: true,
		"accuracy": 95,
		isNonstandard: null
	},
	"falseswipe": {
		inherit: true,
		"basePower": 140,
		isNonstandard: null
	},
	// Multi Turn
	"razorwind": {
		inherit: true,
		"basePower": 150,
		isNonstandard: null
	},
	"fly": {
		inherit: true,
		isNonstandard: null,
		basePower: 100,
		accuracy: 100,
	},
	"dig": {
		inherit: true,
		isNonstandard: null,
		basePower: 100,
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
			onResidual(pokemon) {
				if (pokemon.ability === 'eartheater') {
					this.heal(pokemon.baseMaxhp / 4);
				}
			},
		},
	},
	// Explosions
	"mistyexplosion": {
		inherit: true,
		"basePower": 150,
		isNonstandard: null
	},
	"explosion": {
		inherit: true,
		"basePower": 350
	},
	"selfdestruct": {
		inherit: true,
		"basePower": 275
	},
	"crabhammer": {
		"inherit": true,
		shortDesc: "High Crit Ratio, 30% chance to lower speed by 1.",
		secondary: {
			chance: 30,
			boosts: {spe: -1},
		},
	},
	payback: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (this.queue.willMove(target)) {
				return 50;
			}
			this.debug('BP doubled');
			return 100;
		},
	},
	gunkshot: {
		inherit: true,
		accuracy: 85,
	},
	triattack: {
		inherit: true,
		basePower: 30,
		multihit: 3,
		shortDesc: "Attacks 3 times, 10% chance to burn/para/freeze each.",
		secondary: {
			chance: 10,
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('fst', source);
				}
			},
		},
	},
	smartstrike: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, slicing: 1},
		isNonstandard: null
	},
	slash: {
		inherit: true,
		basePower: 60,
		shortDesc: "Always crits.",
		willCrit: true
	},
	echoedvoice: {
		inherit: true,
		shortDesc: "Raises Special Attack by 1.",
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
	},
	chargebeam: {
		inherit: true,
		accuracy: 100,
		basePower: 40,
		shortDesc: "Raises Special Attack by 1.",
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		}
	},
	eggbomb: {
		inherit: true,
		accuracy: 100,
		type: "Fire",
		isNonstandard: null
	},
	// Some signature Moves
	technoblast: {
		inherit: true,
		isNonstandard: null,
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			const item = pokemon.getItem();
			if (!item.onDrive) return;
			move.type = item.onDrive;
		}
	},
	headcharge: {
		inherit: true,
		isNonstandard: null,
		basePower: 125,
	},
	snipeshot: {
		inherit: true,
		basePower: 75,
		willCrit: true,
	},
	spicyextract: {
		inherit: true,
		shortDesc: "Raises target's Atk by 2 and lowers its Def by 2.",
		boosts: {atk: 3, def: -3},
	},
	mysticalpower: {
		inherit: true,
		basePower: 60,
		accuracy: 100,
		type: "Fairy",
	},
	chatter: {
		inherit: true,
		isNonstandard: null,
		basePower: 80,
	},
	snaptrap: {
		inherit: true,
		isNonstandard: null,
		basePower: 90,
		type: "Steel",
	},
	anchorshot: {
		inherit: true,
		isNonstandard: null,
		basePower: 85,
	},
	shelltrap: {
		inherit: true,
		isNonstandard: null,
		basePower: 160,
	},
	beakblast: {
		inherit: true,
		isNonstandard: null,
		basePower: 120,
	},
	zingzap: {
		inherit: true,
		isNonstandard: null,
		basePower: 90,
	},
	mountaingale: {
		inherit: true,
		shortDesc: "Hits both opponents. 20% chance to frostbite.",
		isNonstandard: null,
		basePower: 90,
		secondary: {chance: 20, status: 'fst'},
	},
	gravapple: {
		inherit: true,
		shortDesc: "Target: 100% -2 Def. During Gravity: 2x power.",
		onBasePower(basePower) {
			if (this.field.getPseudoWeather('gravity')) {
				return this.chainModify(2);
			}
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -2,
			},
		},
	},
	appleacid: {
		inherit: true,
		shortDesc: "100% chance to lower the target's Sp. Def by 2.",
		secondary: {
			chance: 100,
			boosts: {
				spd: -2,
			},
		},
	},
	stormthrow: {
		inherit: true,
		isNonstandard: null,
		basePower: 75,
	},
	healorder: {
		inherit: true,
		shortDesc: "Heals the user by 100% of its max HP.",
		pp: 5,
		heal: [1, 1],
		isNonstandard: null
	},
	milkdrink: {
		inherit: true,
		shortDesc: "Heals the user by 100% of its max HP.",
		pp: 5,
		heal: [1, 1],
		isNonstandard: null
	},
	shadowbone: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Hits Twice, 20% to drop defense",
		basePower: 50,
		multihit: 2,
	},
	ragefist: {
		inherit: true,
		shortDesc: "+50 power for each time user was hit. Max: 1000bp",
		basePowerCallback(pokemon) {
			return Math.min(1000, 50 + 50 * pokemon.timesAttacked);
		},
	},
	dragondarts: {
		inherit: true,
		basePower: 55
	},
	twinbeam: {
		inherit: true,
		shortDesc: "Hits twice. Doubles: Tries to hit each foe once.",
		basePower: 55,
		smartTarget: true,
	},
	diamondstorm: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Hits both in sandstorm, 50% raise defense by 1",
		target: "normal",
		onModifyMove(move, source, target) {
			if (this.field.isWeather('sandstorm')) {
				move.target = 'allAdjacentFoes';
			}
		},
		self: {
			chance: 50,
			boosts: {
				def: 1,
			},
		},
	},
	spark: {
		inherit: true,
		basePower: 75,
	},
	poisontail: {
		inherit: true,
		target: "allAdjacentFoes",
		shortDesc: "Hits both foes, High Crit Rate, 10% to poison.",
		basePower: 80,
	},
	feint: {
		inherit: true,
		basePower: 40
	},
	doubleshock: {
		inherit: true,
		basePower: 130
	},
	spiritshackle: {
		inherit: true,
		basePower: 95,
	},
	firefang: {
		inherit: true,
		basePower: 75
	},
	thunderfang: {
		inherit: true,
		basePower: 75
	},
	megapunch: {
		inherit: true,
		basePower: 90,
		accuracy: 100
	},
	megakick: {
		inherit: true,
		basePower: 130,
	},
	twineedle: {
		inherit: true,
		isNonstandard: null,
		basePower: 45,
	},
	present: {
		inherit: true,
		shortDesc: "100, 130, 160 power, if target ally, heals 50% instead",
		accuracy: 100,
		onTryHit(target, source, move) {
			if (source.isAlly(target)) {
				move.basePower = 0;
				move.infiltrates = true;
			}
		},
		onHit(target, source) {
			if (source.isAlly(target)) {
				if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
					this.add('-immune', target);
					return this.NOT_FAIL;
				}
			}
		},
		onModifyMove(move, pokemon, target) {
			const rand = this.random(3);
			if (rand < 1) {
				move.basePower = 100;
			} else if (rand < 2) {
				move.basePower = 130;
			} else {
				move.basePower = 160;
			}
		},
	},
	wildcharge: {
		inherit: true,
		basePower: 100,
	},
	revelationdance: {
		inherit: true,
		basePower: 100,
	},
	doublekick: {
		inherit: true,
		basePower: 40,
	},
	shadowpunch: {
		inherit: true,
		basePower: 75,
	},
	volttackle: {
		inherit: true,
		basePower: 130,
	},
	belch: {
		inherit: true,
		basePower: 130,
		accuracy: 100,
	},
	moonblast: {
		inherit: true,
		isNonstandard: null,
		basePower: 90,
	},
	aircutter: {
		inherit: true,
		isNonstandard: null,
		basePower: 70,
	},
	tripledive: {
		inherit: true,
		isNonstandard: null,
		basePower: 80,
	},
	futuresight: {
		inherit: true,
		isNonstandard: null,
		basePower: 150,
	},
	doomdesire: {
		inherit: true,
		isNonstandard: null,
		basePower: 150,
	},
	geargrind: {
		inherit: true,
		isNonstandard: null,
		basePower: 55,
		accuracy: 90
	},
	steelwing: {
		inherit: true,
		isNonstandard: null,
		basePower: 75,
		accuracy: 95
	},
	rollingkick: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "100% chance to lower speed by 1.",
		basePower: 70,
		accuracy: 100,
		secondary: {
			chance: 100,
			boosts: {spe: -1},
		},
	},
	icehammer: {
		inherit: true,
		basePower: 110
	},
	meditate: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Boosts Atk and SpDef by 1",
		boosts: {
			atk: 1,
			spd: 1
		},
	},
	charge: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Doubles next Electric attack and heals 33%",
		heal: [1, 3],
		boosts: null,
	},
	steamroller: {
		inherit: true,
		isNonstandard: null,
		basePower: 85,
	},
	toxicthread: {
		inherit: true,
		isNonstandard: null,
		target: "allAdjacentFoes",
		shortDesc: "Lowers both enemies' Spe by 1 and poisons."
	},
	snatch: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "User steals certain support moves for it and allies to use.",
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'Snatch');
			},
			onAnyPrepareHitPriority: -1,
			onAnyPrepareHit(source, target, move) {
				const snatchUser = this.effectState.source;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch'] || move.sourceEffect === 'snatch') {
					return;
				}
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', '[of] ' + source);
				this.actions.useMove(move.id, snatchUser);
				for (const ally of (snatchUser as Pokemon).adjacentAllies()) {
					this.actions.useMove(move.id, ally);
				}
				return null;
			},
		},
	},
	octolock: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Traps target, lowers Def and SpD by 1, 1/6 dmg each turn.",
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Octolock', '[of] ' + source);
				this.effectState.boundDivisor = source.hasItem('bindingband') ? 4 : 6;
			},
			onResidualOrder: 14,
			onResidual(pokemon) {
				const source = this.effectState.source;
				if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
					delete pokemon.volatiles['octolock'];
					this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
					return;
				}
				this.boost({def: -1, spd: -1}, pokemon, source, this.dex.getActiveMove('octolock'));
				this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
			},
			onTrapPokemon(pokemon) {
				if (this.effectState.source && this.effectState.source.isActive) pokemon.tryTrap();
			},
		},
	},
	furycutter: {
		inherit: true,
		accuracy: 100,
		shortDesc: "Power doubles with each hit, up to 640.",
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.volatiles['furycutter'] || move.hit === 1) {
				pokemon.addVolatile('furycutter');
			}
			const bp = this.clampIntRange(move.basePower * pokemon.volatiles['furycutter'].multiplier, 1, 640);
			this.debug('BP: ' + bp);
			return bp;
		},
	},
	filletaway: {
		inherit: true,
		shortDesc: "+2 Atk, SpAtk, Spe for 1/3 user HP, Ally Heals 1/3.",
		onTry(source) {
			if (source.hp <= source.maxhp / 3 || source.maxhp === 1) return false;
		},
		onHit(pokemon) {
			this.directDamage(pokemon.maxhp / 3);
			for (const allyActive of pokemon.adjacentAllies()) {
				this.heal(allyActive.baseMaxhp / 3, allyActive, pokemon);
			}
		},
	},
	dragonrush: {
		inherit: true,
		accuracy: 80,
	},
	smellingsalts: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Power doubles if target is paralyzed, Does not Cure.",
		onHit(target) {
		},
	},
	frostbreath: {
		inherit: true,
		isNonstandard: null,
		basePower: 55,
		accuracy: 100
	},
	psychoshift: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Transfers the user's status ailment to the target. Cures Ally Status.",
		onTryHit(target, source, move) {
			if (!source.status) return false;
			move.status = source.status;
		},
		self: {
			onHit(pokemon) {
				pokemon.cureStatus();
				for (const allyActive of pokemon.adjacentAllies()) {
					allyActive.cureStatus();
				}
			},
		},
	},
	fairylock: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Prevents all Pokemon from switching for next 3 turns.",
		condition: {
			duration: 4,
			onFieldStart(target) {
				this.add('-fieldactivate', 'move: Fairy Lock');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
	},
	freezingglare: {
		inherit: true,
		shortDesc: "20% chance to frostbite, +Ice Type",
		secondary: {chance: 20, status: 'fst'},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Ice', type);
		},
	},
	thunderouskick: {
		inherit: true,
		shortDesc: "Lowers Def by 1, +Elec Type",
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Electric', type);
		},
	},
	fierywrath: {
		inherit: true,
		shortDesc: "20% to make foe(s) flinch, +Fire Type",
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Fire', type);
		},
	},
	lusterpurge: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "100% chance to reduce SpDef by 1",
		basePower: 80,
		secondary: {
			chance: 100, boosts: {spd: -1},
		},
	},
	mistball: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "100% chance to reduce SpA by 1",
		basePower: 80,
		secondary: {
			chance: 100, boosts: {spa: -1},
		},
	},
	// Moves edited for abilities
	auroraveil: {
		inherit: true,
		onTry(source) {
			return this.field.isWeather(['hail', 'snow']) || source.hasAbility("trueaurora");
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				let numTurns = 5;
				if (source?.hasItem('lightclay')) {
					numTurns += 3;
				}
				if (source?.hasAbility('trueaurora')) {
					numTurns += 3;
				}
				return numTurns;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target)) {
					if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
							(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
						return;
					}
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Aurora Veil weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Aurora Veil');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 10,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Aurora Veil');
			},
		},
	},
	finalgambit: {
		inherit: true,
		damageCallback(pokemon) {
			let damage = pokemon.hp;
			pokemon.faint();
			if (pokemon.hasAbility('reckless')) {
				damage *= 1.3;
			}
			return damage;
		},
	},
	electricterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (effect.ability === 'thunderstorm') {
					return 3;
				}
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Electric Terrain');
					}
					return false;
				}
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
	},
	// Z Moves
	trickortreat: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Charges, +Ghost to target's type, omniboost turn 2.",
		flags: {charge: 1, protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, attacker, attacker, move);
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, attacker, attacker, move);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		}
	},
	forestscurse: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Charges, +Grass to target's type, omniboost turn 2.",
		flags: {charge: 1, protect: 1, reflectable: 1, mirror: 1, allyanim: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, attacker, attacker, move);
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, attacker, attacker, move);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		}
	},
	conversion: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Charges, User's type to first move, Omniboost turn 2.",
		boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
		flags: {charge: 1, nonsky: 1, nosleeptalk: 1, failinstruct: 1},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		}
	},
	sinisterarrowraid: {
		inherit: true,
		isNonstandard: null,
		isZ: false,
		flags: {protect: 1, mirror: 1, charge: 1},
		shortDesc: "Charges, uses move turn 2",
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		}
	},
	splinteredstormshards: {
		inherit: true,
		isNonstandard: null,
		isZ: false,
		flags: {protect: 1, mirror: 1, charge: 1},
		shortDesc: "Charges, uses move turn 2, ends terrain",
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		}
	},
	extremeevoboost: {
		inherit: true,
		isNonstandard: null,
		isZ: false,
		shortDesc: "Eevee Only, Charges, Double Omniboosts turn 2",
		onTry(source, target, move) {
			if (source.species.name === 'Eevee' || move.hasBounced) {
				return;
			}
			this.add('-fail', source, 'move: Extreme Evoboost');
			this.hint("Only a Pokemon whose form is Eevee can use this move.");
			return null;
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		}
	},
	// Max Moves
	gmaxmalodor: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		basePower: 90,
		shortDesc: "Poisons both foes after successful use.",
	},
	gmaxsteelsurge: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		basePower: 100,
		shortDesc: "Sets up a Steel Hazard after use.",
	},
	gmaxgravitas: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		category: "Special",
		basePower: 90,
		shortDesc: "Sets up Gravity after succesful use.",
	},
	gmaxfinale: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		category: "Special",
		basePower: 90,
		shortDesc: "Heals self and allies by 1/6th",
	},
	gmaxdepletion: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		category: "Special",
		basePower: 90,
		shortDesc: "Foes: last move -2 PP.",
	},
	// Pledges
	firepledge: {
		inherit: true,
		shortDesc: "Use with other pledge for 200bp combined attack.",
		basePowerCallback(target, source, move) {
			if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 200;
			}
			return 80;
		}
	},
	waterpledge: {
		inherit: true,
		shortDesc: "Use with other pledge for 200bp combined attack.",
		basePowerCallback(target, source, move) {
			if (['grasspledge', 'firepledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 200;
			}
			return 80;
		}
	},
	grasspledge: {
		inherit: true,
		shortDesc: "Use with other pledge for 200bp combined attack.",
		basePowerCallback(target, source, move) {
			if (['firepledge', 'waterpledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 200;
			}
			return 80;
		}
	},
	// Freeze -> Frostbite
	blizzard: {
		inherit: true,
		shortDesc: "15% chance to frostbite foes. Can't miss in Snow",
		secondary: {chance: 15, status: 'fst'},
	},
	icebeam: {
		inherit: true,
		shortDesc: "10% chance to frostbite.",
		secondary: {chance: 10, status: 'fst'},
	},
	freezedry: {
		inherit: true,
		shortDesc: "10% chance to frostbite.",
		secondary: {chance: 10, status: 'fst'},
	},
	icepunch: {
		inherit: true,
		shortDesc: "10% chance to frostbite.",
		secondary: {chance: 10, status: 'fst'},
	},
	icefang: {
		inherit: true,
		basePower: 75,
		shortDesc: "10% chance to frostbite. 10% to flinch.",
		secondaries: [
			{chance: 10, status: 'fst'},
			{chance: 10, volatileStatus: 'flinch'},
		],
	},
	// Recharge moves
	hyperbeam: {
		inherit: true,
		self: null,
		shortDesc: "User cannot move next turn if it fails to KO.",
		basePower: 140,
		onHit(target, source) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
		},
	},
	gigaimpact: {
		inherit: true,
		self: null,
		shortDesc: "User cannot move next turn if it fails to KO.",
		basePower: 140,
		onHit(target, source) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
		},
	},
	frenzyplant: {
		inherit: true,
		self: null,
		shortDesc: "User recharges doesn't KO. Physical if user's Atk > SpA.",
		basePower: 140,
		onHit(target, source, move) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
			if (!source.isAlly(target)) this.hint(move.category + " Frenzy Plant");
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!source.isAlly(target)) this.hint(move.category + " Frenzy Plant");
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	hydrocannon: {
		inherit: true,
		self: null,
		shortDesc: "User recharges doesn't KO. Physical if user's Atk > SpA.",
		basePower: 140,
		onHit(target, source, move) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
			if (!source.isAlly(target)) this.hint(move.category + " Hydro Cannon");
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!source.isAlly(target)) this.hint(move.category + " Hydro Cannon");
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	blastburn: {
		inherit: true,
		self: null,
		shortDesc: "User recharges doesn't KO. Physical if user's Atk > SpA.",
		basePower: 140,
		onHit(target, source, move) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
			if (!source.isAlly(target)) this.hint(move.category + " Blast Burn");
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!source.isAlly(target)) this.hint(move.category + " Blast Burn");
		},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
	},
	rockwrecker: {
		inherit: true,
		isNonstandard: null,
		self: null,
		shortDesc: "User cannot move next turn if it fails to KO.",
		basePower: 140,
		onHit(target, source) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
		},
	},
	meteorassault: {
		inherit: true,
		isNonstandard: null,
		self: null,
		shortDesc: "User cannot move next turn if it fails to KO.",
		basePower: 150,
		onHit(target, source) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
		},
	},
	// pp changes
	flamethrower: {
		inherit: true,
		pp: 10,
	},
	thunderbolt: {
		inherit: true,
		pp: 10,
	},
	allyswitch: {
		inherit: true,
		pp: 5,
	},
	protect: {
		inherit: true,
		pp: 5,
	},
	// Making Standard
	firewall: {
		inherit: true,
		isNonstandard: null,
	},
	stalacbite: {
		inherit: true,
		isNonstandard: null,
	},
	divebomb: {
		inherit: true,
		isNonstandard: null,
	},
	psychout: {
		inherit: true,
		isNonstandard: null,
	},
	purifyingwater: {
		inherit: true,
		isNonstandard: null,
	},
	divinesmite: {
		inherit: true,
		isNonstandard: null,
	},
	sacredfire: {
		inherit: true,
		isNonstandard: null,
	},
	sketch: {
		inherit: true,
		isNonstandard: null,
	},
	lightofruin: {
		inherit: true,
		isNonstandard: null,
	},
	dualchop: {
		inherit: true,
		isNonstandard: null,
	},
	tailglow: {
		inherit: true,
		isNonstandard: null,
	},
	aeroblast: {
		inherit: true,
		isNonstandard: null,
	},
	aurawheel: {
		inherit: true,
		isNonstandard: null,
	},
	poweruppunch: {
		inherit: true,
		isNonstandard: null,
	},
	dizzypunch: {
		inherit: true,
		isNonstandard: null,
	},
	electrify: {
		inherit: true,
		isNonstandard: null,
	},
	topsyturvy: {
		inherit: true,
		isNonstandard: null,
	},
	return: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpower: {
		inherit: true,
		isNonstandard: null,
	},
	"hiddenpowerbug": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	"hiddenpowerdark": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerdragon": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerelectric": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerfighting": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	"hiddenpowerfire": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerflying": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	"hiddenpowerghost": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	"hiddenpowergrass": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerice": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerpoison": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerpsychic": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerrock": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	"hiddenpowersteel": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	"hiddenpowerwater": {
		"inherit": true,
		"isNonstandard": null,
	},
	"hiddenpowerground": {
		"inherit": true,
		"category": "Physical",
		"isNonstandard": null,
	},
	mindblown: {
		inherit: true,
		isNonstandard: null,
	},
	fishiousrend: {
		inherit: true,
		isNonstandard: null,
	},
	boltbeak: {
		inherit: true,
		isNonstandard: null,
	},
	seedflare: {
		inherit: true,
		isNonstandard: null,
	},
	aromatherapy: {
		inherit: true,
		isNonstandard: null,
	},
	pursuit: {
		inherit: true,
		isNonstandard: null,
	},
	kingsshield: {
		inherit: true,
		isNonstandard: null,
	},
	moongeistbeam: {
		inherit: true,
		isNonstandard: null,
	},
	sunsteelstrike: {
		inherit: true,
		isNonstandard: null,
	},
	matblock: {
		inherit: true,
		isNonstandard: null,
	},
	spotlight: {
		inherit: true,
		isNonstandard: null,
	},
	strangesteam: {
		inherit: true,
		isNonstandard: null,
	},
	decorate: {
		inherit: true,
		isNonstandard: null,
	},
	floralhealing: {
		inherit: true,
		isNonstandard: null,
	},
	craftyshield: {
		inherit: true,
		isNonstandard: null,
	},
	plasmafists: {
		inherit: true,
		isNonstandard: null,
	},
	signalbeam: {
		inherit: true,
		isNonstandard: null,
	},
	powder: {
		inherit: true,
		isNonstandard: null,
	},
	psychoboost: {
		inherit: true,
		isNonstandard: null,
	},
	clangingscales: {
		inherit: true,
		isNonstandard: null,
	},
	clangoroussoul: {
		inherit: true,
		isNonstandard: null,
	},
	obstruct: {
		inherit: true,
		isNonstandard: null,
	},
	multiattack: {
		inherit: true,
		isNonstandard: null,
	},
	thousandarrows: {
		inherit: true,
		isNonstandard: null,
	},
	magiccoat: {
		inherit: true,
		isNonstandard: null,
	},
	nightmare: {
		inherit: true,
		isNonstandard: null,
	},
	dragonhammer: {
		inherit: true,
		isNonstandard: null,
	},
	sparklingaria: {
		inherit: true,
		isNonstandard: null,
	},
	blazingtorque: {
		inherit: true,
		isNonstandard: null,
	},
	noxioustorque: {
		inherit: true,
		isNonstandard: null,
	},
	magicaltorque: {
		inherit: true,
		isNonstandard: null,
	},
	combattorque: {
		inherit: true,
		isNonstandard: null,
	},
	wickedtorque: {
		inherit: true,
		isNonstandard: null,
	},
};
