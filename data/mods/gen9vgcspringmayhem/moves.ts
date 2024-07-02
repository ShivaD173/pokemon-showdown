export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	charge: {
		inherit: true,
		condition: {
			onStart(pokemon, source, effect) {
				if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
					if (this.activeMove) {
						this.add('-start', pokemon, 'Charge', this.activeMove.name, '[from] ability: ' + effect.name);
					} else {
						this.add('-start', pokemon, 'Charge', 'Delta Stream', '[from] ability: ' + effect.name);
					}
				} else {
					this.add('-start', pokemon, 'Charge');
				}
			},
			onRestart(pokemon, source, effect) {
				if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
					if (this.activeMove) {
						this.add('-start', pokemon, 'Charge', this.activeMove.name, '[from] ability: ' + effect.name);
					} else {
						this.add('-start', pokemon, 'Charge', 'Delta Stream', '[from] ability: ' + effect.name);
					}
				} else {
					this.add('-start', pokemon, 'Charge');
				}
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Electric' && move.id !== 'charge') {
					pokemon.removeVolatile('charge');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Electric' && move.id !== 'charge') {
					pokemon.removeVolatile('charge');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Charge', '[silent]');
			},
		},
	},
	auroraveil: {
		inherit: true,
		onTry(source) {
			return this.field.isWeather(['hail', 'snow']) || source.hasAbility("trueaurora");
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				let numTurns = 5;
				if (source?.hasItem('lightclay') || source?.hasAbility('trueaurora')) {
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
	aurorabeam: {
		inherit: true,
		shortDesc: "20% to lower target's Attack by 1",
		basePower: 70,
		secondary: {chance: 20, boosts: {atk: -1}},
	},
	growth: {
		inherit: true,
		shortDesc: "User's Atk and SpA +1; +2 in Sun/Grassy Terrain.",
		onModifyMove(move, pokemon) {
			if (['sunnyday', 'desolateland', 'pollen'].includes(pokemon.effectiveWeather())) {
				move.boosts = {atk: 2, spa: 2};
			}
		},
	},
	moonblast: {
		inherit: true,
		basePower: 90,
	},
	finalgambit: {
		inherit: true,
		damageCallback(pokemon) {
			let damage = pokemon.hp;
			pokemon.faint();
			if (pokemon.hasAbility('reckless')) {
				damage *= 1.2;
			}
			return damage;
		},
	},
	attract: {
		inherit: true,
		shortDesc: "A target of ANY gender gets infatuated.",
		volatileStatus: 'attract',
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.name === 'Cute Charm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.name === 'Destiny Knot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
				if (target.effectiveWeather() === "loveintheair" || this.randomChance(1, 4)) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
		onTryImmunity(target, source) {
			return true;
		},
	},
	lastrespects: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.effectiveWeather() === "twilightzone") {
				return 200;
			}
			return 50 + 50 * pokemon.side.totalFainted;
		},
	},
	risingvoltage: {
		inherit: true,
		basePowerCallback(source, target, move) {
			if (this.field.isWeather('thunderstorm') || (this.field.isTerrain('electricterrain') && target.isGrounded())) {
				if (!source.isAlly(target)) this.hint(`${move.name}'s BP doubled.`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snow':
				move.type = 'Ice';
				break;
			case 'deltastream':
				move.type = "Flying";
				break;
			case 'thunderstorm':
				move.type = "Electric";
				break;
			case 'pollen':
				move.type = "Grass";
				break;
			case 'locusts':
				move.type = "Bug";
				break;
			case 'acidrain':
				move.type = "Poison";
				break;
			case 'darkness':
				move.type = "Dark";
				break;
			case 'twilightzone':
				move.type = "Ghost";
				break;
			case 'loveintheair':
				move.type = "Fairy";
				break;
			case 'stellarstorm':
				move.type = "Stellar";
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.effectiveWeather()) {
				move.basePower *= 2;
			}
			this.debug('BP: ' + move.basePower);
		},
	},
	flyingpress: {
		inherit: true,
		basePower: 110,
	},
	octazooka: {
		inherit: true,
		isNonstandard: null,
		accuracy: 90
	},
	mountaingale: {
		inherit: true,
		shortDesc: "Hits both opponents. 20% chance to frostbite.",
		target: "allAdjacentFoes",
		isNonstandard: null,
		accuracy: 90,
		secondary: {chance: 20, status: 'fst'},
	},
	shadowpunch: {
		inherit: true,
		basePower: 75,
	},
	icehammer: {
		inherit: true,
		basePower: 110
	},
	diamondstorm: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "Hits both in sandstorm, 50% raise defense by 1",
		target: "normal",
		category: "Special",
		onModifyMove(move, source, target) {
			if (this.field.isWeather('sandstorm')) {
				move.target = 'allAdjacentFoes';
			}
		},
		self: {
			chance: 50,
			boosts: {def: 1},
		},
	},
	falseswipe: {
		inherit: true,
		"basePower": 130,
		isNonstandard: null
	},
	gmaxgravitas: {
		inherit: true,
		isNonstandard: null,
		isMax: false,
		flags: {protect: 1, mirror: 1},
		category: "Special",
		basePower: 80,
		shortDesc: "Sets up Gravity after succesful use.",
	},
	// Gay Stuff
	struggle: {
		inherit: true,
		basePower: 60,
	},
	// Sleep Nerf
	spore: {
		inherit: true,
		pp: 5,
	},
	hypnosis: {
		inherit: true,
		pp: 5,
	},
	sleeppowder: {
		inherit: true,
		pp: 5,
	},
	sing: {
		inherit: true,
		pp: 5,
	},
	// Genie moves
	springtidestorm: {
		inherit: true,
		shortDesc: "20% to lower foe(s) Atk by 1. Sun: can't miss.",
		onModifyMove(move, pokemon, target) {
			if (target && ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) move.accuracy = true;
		},
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
		"type": "Psychic",
		"isNonstandard": null,
	},
	"cometpunch": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		"type": "Fairy",
		"isNonstandard": null,
	},
	"spikecannon": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		multihit: [2, 5],
		"type": "Steel",
		"isNonstandard": null,
	},
	"furyattack": {
		"inherit": true,
		"accuracy": 100,
		"basePower": 25,
		multihit: [2, 5],
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
		shortDesc: "Hits 2-5 Times, does 1/16 each to other enemy.",
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
	// Explosions
	"mistyexplosion": {
		inherit: true,
		"basePower": 150,
		shortDesc: "User faints. User in Love In The Air: 1.5x power.",
		onBasePower(basePower, source) {
			if (this.field.isWeather("loveintheair") || (this.field.isTerrain('mistyterrain') && source.isGrounded())) {
				return this.chainModify(1.5);
			}
		},
		isNonstandard: null
	},
	"explosion": {
		inherit: true,
		"basePower": 325
	},
	"selfdestruct": {
		inherit: true,
		"basePower": 250
	},
	// Regular Moves
	meteorbeam: {
		inherit: true,
		accuracy: 100,
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
		shortDesc: "15% chance to frostbite foes. Can't miss in Snow.",
		secondary: {chance: 15, status: 'fst'},
	},
	icebeam: {
		inherit: true,
		shortDesc: "10% chance to frostbite.",
		secondary: {chance: 10, status: 'fst'},
	},
	freezedry: {
		inherit: true,
		shortDesc: "10% chance to frostbite. Super effective on Water.",
		secondary: {chance: 10, status: 'fst'},
	},
	icepunch: {
		inherit: true,
		shortDesc: "10% chance to frostbite.",
		secondary: {chance: 10, status: 'fst'},
	},
	// pp changes
	whirlwind: {
		inherit: true,
		pp: 10,
	},
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
	burningbulwark: {
		inherit: true,
		pp: 5,
	},
	strengthsap: {
		inherit: true,
		pp: 5,
	},
	wish: {
		inherit: true,
		pp: 5,
	},
	junglehealing: {
		inherit: true,
		pp: 5,
	},
	lifedew: {
		inherit: true,
		pp: 5,
	},
	trumpcard: {
		inherit: true,
		isNonstandard: null,
		category: "Physical",
		pp: 2
	},
	// Hidden Powers
	hiddenpower: {
		inherit: true,
		isNonstandard: null,
		onModifyMove(move, pokemon, target) {
			const physTypes = ['Normal', 'Bug', 'Fighting', 'Flying', 'Ghost', 'Poison', 'Rock', 'Steel', 'Ground'];
			if (physTypes.includes(move.type)) {
				move.category = "Physical";
			}
		},
	},
	"hiddenpowerfairy": {
		"inherit": true,
		"isNonstandard": null,
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
		"category": "Physical",
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
	// Making Standard
	purifyingwater: {
		inherit: true,
		isNonstandard: null,
	},
	divinesmite: {
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
	quarry: {
		inherit: true,
		isNonstandard: null,
	},
	smeltery: {
		inherit: true,
		isNonstandard: null,
	},
	icerink: {
		inherit: true,
		isNonstandard: null,
	},
	flashfreeze: {
		inherit: true,
		isNonstandard: null,
	},
	slushcrush: {
		inherit: true,
		isNonstandard: null,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if ((pokemonWeight >= targetWeight * 5) || pokemon.hasAbility('thickfat')) {
				bp = 120;
			} else if (pokemonWeight >= targetWeight * 4) {
				bp = 100;
			} else if (pokemonWeight >= targetWeight * 3) {
				bp = 80;
			} else if (pokemonWeight >= targetWeight * 2) {
				bp = 60;
			} else {
				bp = 40;
			}
			this.debug('BP: ' + bp);
			return bp;
		},
	},
	proposition: {
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
	blazingtorque: {
		inherit: true,
		basePower: 100,
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
		basePower: 100,
		isNonstandard: null,
	},
	secretsword: {
		inherit: true,
		isNonstandard: null,
	},
	purify: {
		inherit: true,
		isNonstandard: null,
	},
	bonemerang: {
		inherit: true,
		isNonstandard: null,
	},
	mefirst: {
		inherit: true,
		isNonstandard: null,
	},
	laserfocus: {
		inherit: true,
		isNonstandard: null,
	},
	luckychant: {
		inherit: true,
		isNonstandard: null,
	},
	shellsidearm: {
		inherit: true,
		isNonstandard: null,
		flags: {protect: 1, mirror: 1, bullet: 1},
	},
	autotomize: {
		inherit: true,
		isNonstandard: null,
	},
	barrier: {
		inherit: true,
		isNonstandard: null,
	},
	iceball: {
		inherit: true,
		isNonstandard: null,
	},
	healblock: {
		inherit: true,
		isNonstandard: null,
	},
	oblivionwing: {
		inherit: true,
		isNonstandard: null,
	},
	corrosivegas: {
		inherit: true,
		isNonstandard: null,
	},
	lovelykiss: {
		inherit: true,
		isNonstandard: null,
	},
	naturesmadness: {
		inherit: true,
		isNonstandard: null,
	},
	pikapapow: {
		inherit: true,
		isNonstandard: null,
	},
	// Move Deletions
	slam: {
		inherit: true,
		isNonstandard: "CAP",
	},
	bubblebeam: {
		inherit: true,
		isNonstandard: "CAP",
	},
	psybeam: {
		inherit: true,
		isNonstandard: "CAP",
	},
	hornattack: {
		inherit: true,
		isNonstandard: "CAP",
	},
	powdersnow: {
		inherit: true,
		isNonstandard: "CAP",
	}
};
