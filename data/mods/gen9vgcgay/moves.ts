export const Moves: {[k: string]: ModdedMoveData} = {
	struggle: {
		inherit: true,
		basePower: 80,
	},
	ominouswind: {
		inherit: true,
		"isNonstandard": null,
		shortDesc: "20% chance to raise all stats by 1 (not acc/eva).",
		secondary: {
			chance: 20,
			self: {
				boosts: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
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
				boosts: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
			},
		},
	},
	"silverwind": {
		"inherit": true,
		shortDesc: "20% chance to raise all stats by 1 (not acc/eva).",
		secondary: {
			chance: 20,
			self: {
				boosts: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
			},
		},
		"isNonstandard": null,
	},
	ragefist: {
		inherit: true,
		shortDesc: "+50 power for each time user was hit. Max: 1000bp",
		basePowerCallback(pokemon) {
			return Math.min(1000, 50 + 50 * pokemon.timesAttacked);
		},
	},
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
		"inherit": true,
		"accuracy": 95,
	},
	armthrust: {
		"inherit": true,
		basePower: 25
	},
	"swagger": {
		inherit: true,
		"accuracy": 100,
		isNonstandard: null
	},
	"falseswipe": {
		inherit: true,
		"basePower": 140,
		isNonstandard: null
	},
	"razorwind": {
		inherit: true,
		"basePower": 150,
		isNonstandard: null
	},
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
		shortDesc:"Attacks 3 times, 10% chance to burn/para/freeze each.",
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
		shortDesc:"Always crits.",
		willCrit: true
	},
	echoedvoice: {
		inherit: true,
		shortDesc:"Raises Special Attack by 1.",
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
		shortDesc:"Raises Special Attack by 1.",
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
	healorder: {
		inherit: true,
		shortDesc:"Heals the user by 100% of its max HP.",
		pp: 5,
		heal: [1, 1],
		isNonstandard: null
	},
	milkdrink: {
		inherit: true,
		shortDesc:"Heals the user by 100% of its max HP.",
		pp: 5,
		heal: [1, 1],
		isNonstandard: null
	},
	shadowbone: {
		inherit: true,
		isNonstandard: null,
		shortDesc:"Hits Twice, 20% to drop defense",
		basePower: 50,
		multihit: 2,
	},
	diamondstorm: {
		inherit: true,
		isNonstandard: null,
		shortDesc:"Hits both in sandstorm, 50% raise defense by 1",
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
	gmaxmalador: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		basePower: 90,
	},
	spark: {
		inherit: true,
		basePower: 80,
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
		basePower: 100,
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
		basePower: 80
	},
	volttackle: {
		inherit: true,
		basePower: 130
	},
	belch: {
		inherit: true,
		basePower: 130,
		accuracy: 100
	},
	chatter: {
		inherit: true,
		isNonstandard: null,
		basePower: 80
	},
	snaptrap: {
		inherit: true,
		isNonstandard: null,
		basePower: 90,
		type: "Steel",
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
	stormthrow: {
		inherit: true,
		isNonstandard: null,
		basePower: 75,
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
	mysticalpower: {
		inherit: true,
		isNonstandard: null,
		type: "Fairy",
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
		shortDesc: "Lowers the both enemies' Speed by 1 and poisons them."
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
	// Moves edited for abilities
	auroraveil: {
		inherit: true,
		onTry(source) {
			return this.field.isWeather(['hail', 'snow']) || source.hasAbility("trueaurora");
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				var numTurns = 5
				if (source?.hasItem('lightclay')) {
					numTurns += 3
				}
				if (source?.hasAbility('trueaurora')) {
					numTurns += 3
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
			var damage = pokemon.hp;
			pokemon.faint();
			if (pokemon.hasAbility('reckless')) {
				damage *= 1.3
			}
			return damage;
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
	// spotlight: {
	// 	inherit: true,
	// 	isNonstandard: null,
	// 	pp: 2,
	// 	condition: {
	// 		duration: 1,
	// 		onStart(pokemon) {
	// 			this.add('-singleturn', pokemon, 'move: Spotlight');
	// 		},
	// 		onRedirectTargetPriority: 2,
	// 		onRedirectTarget(target, source, source2, move) {
	// 			this.debug("Try spotlight target");
	// 			if (this.validTarget(this.effectState.target, source, move.target)) {
	// 				this.debug("Spotlight redirected target of move");
	// 				return this.effectState.target;
	// 			}
	// 		},
	// 		onFoeRedirectTarget(target, source, source2, move) {
	// 			this.debug("Try spotlight foe");
	// 			if (this.validTarget(this.effectState.target, source, move.target)) {
	// 				this.debug("Spotlight redirected target of move");
	// 				return this.effectState.target;
	// 			}
	// 			return;
	// 		},
	// 	},
	// },
	// tailwind: {
	// 	inherit: true,
	// 	shortDesc: "1.5x speed for your side for 4 turns",
	// 	condition: {
	// 		duration: 4,
	// 		durationCallback(target, source, effect) {
	// 			if (source?.hasAbility('persistent')) {
	// 				this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
	// 				return 6;
	// 			}
	// 			return 4;
	// 		},
	// 		onSideStart(side, source) {
	// 			if (source?.hasAbility('persistent')) {
	// 				this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
	// 			} else {
	// 				this.add('-sidestart', side, 'move: Tailwind');
	// 			}
	// 		},
	// 		onModifySpe(spe, pokemon) {
	// 			return this.chainModify(1.5);
	// 		},
	// 		onSideResidualOrder: 26,
	// 		onSideResidualSubOrder: 5,
	// 		onSideEnd(side) {
	// 			this.add('-sideend', side, 'move: Tailwind');
	// 		},
	// 	},
	// },
	// Z Moves
	trickortreat: {
		inherit: true,
		isNonstandard: null,
		shortDesc:"Charges, adds Ghost to target's type, boosts all stats turn 2.",
		boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
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
	forestscurse: {
		inherit: true,
		isNonstandard: null,
		shortDesc:"Charges, adds Grass to target's type, boosts all stats turn 2.",
		boosts: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
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
	conversion: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Charges, changes user's type to match its first move and boosts all stats turn 2.",
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
		shortDesc: "Charges, changes user's type to match its first move and boosts all stats turn 2.",
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
	// Pledges
	firepledge: {
		inherit: true,
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
		secondary: { chance: 20, status: 'fst'},
	},
	icebeam: {
		inherit: true,
		secondary: { chance: 10, status: 'fst'},
	},
	freezedry: {
		inherit: true,
		secondary: { chance: 10, status: 'fst'},
	},
	freezingglare: {
		inherit: true,
		secondary: { chance: 10, status: 'fst'},
	},
	icepunch: {
		inherit: true,
		secondary: { chance: 10, status: 'fst'},
	},
	icefang: {
		inherit: true,
		basePower: 75,
		secondaries: [
			{ chance: 10, status: 'fst'},
			{ chance: 10, volatileStatus: 'flinch'},
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
		shortDesc: "User cannot move next turn if it fails to KO.",
		basePower: 140,
		onHit(target, source) {
			if (target.hp) {
				source.addVolatile('mustrecharge');
			}
		},
	},
	hydrocannon: {
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
	blastburn: {
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
		pp: 16
	},
	thunderbolt: {
		inherit: true,
		pp: 16
	},
	// Making Standard
	firewall: {
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
	technoblast: {
		inherit: true,
		isNonstandard: null
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
	anchorshot: {
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
	octolock: {
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
};
