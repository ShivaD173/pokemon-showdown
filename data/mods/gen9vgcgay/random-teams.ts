import RandomTeams from '../../random-battles/gen9/teams';

// Always useful items
const USEFUL_ITEMS = [
	'Sitrus Berry', 'Covert Cloak', 'Leftovers', 'Rocky Helmet', 'Lum Berry', 'Iapapa Berry', 'Focus Sash'
];
const NICHE_POKEMON = [
	// Niche Strat
	'Orbeetle', 'Slaking', 'Regigigas', 'Bombirdier', 'Spinda', 'Tatusgiri', 'Spidops',
	// Weather/Terrain Abuser
	'Seaking', 'Lumineon', 'Dewgong', 'Sudowoodo', 'Sunflora', 'Cherrim', 'Gogoat', 'Hypno', 'Raichu-Alola',
	// Meme Mon
	'Clamperl', 'Unown', 'Pyukumuku', 'Dipplin', 'Shedinja',
];

const KINDA_NICHE_POKEMON = [
	// Sun
	'Victreebel', 'Exeggutor', 'Leafeon', 'Scovillian', 'Heliolisk', 'Charizard', 'Leavanny',
	// Rain
	 'Barraskewda', 'Floatzel', 'Poliwrath', 'Masquerain', 'Kabutops', 'Relicanth', 'Seismitoad', 'Gorebyss',
	// Hail
	'Beartic', 'Arctozolt', 'Cetitan', 'Glaceon', 'Sandslash-Alola',
	// Sand
	'Lycanroc', 'Houndstone',
	// Requires Specific Support but decent
	'Flamigo', 'Dachsbun', 'Kricketune', 'Slurpuff', 'Castform', 'Linoone', 'Hitmonlee', 'Hawlucha', 'Oinkologne',
	// Specific Support
	'Weezing-Galar', 'Skuntank', 'Charjabug', 'Espathra',
	// Unoptimized Sets
	'Eelektross', 'Wyrdeer', 'Lurantis', 'Sawsbuck', 'Machamp',
	// Blobs
	'Bastiodon', 'Vaporeon', 'Probopass', 'Shuckle', 'Walrein',
];

const HARD_TO_USE = [
	// Require TR
	'Marowak-Alola', 'Cursola', 'Arboliva', 'Vikavolt', 'Camerupt', 'Exeggutor-Alola',
	// Super frail
	'Ninjask', 'Wugtrio', 'Eevee', 'Squawkabilly', 'Pikachu', 'Flapple', 'Raticate', 'Dugtrio-Alola',
	// Require Enemy
	'Brambleghast', 'Shiftry', 'Klawf',
];

const CONSISTENT = [
	'Heatran', 'Latios', 'Latias', 'Blissey', 'Iron Hands',
	// Tailwind
	'Whimsicott', 'Volbeat', 'Illumise', 'Tornadus', 'Aerodactyl',
	// Follow Me
	'Blastoise', 'Indeedee-F', 'Maushold', 'Magmortar', 'Furret', 'Furfrou', 'Togekiss',
	// Fake Out
	'Lopunny', 'Hitmontop', 'Hitmonchan', 'Mr. Mime', 'Mr. Mime-Galar', 'Accelgor',
];

const BITCHES = [
	'Registeel', 'Goodra-Hisui', 'Kecleon', 'Tropius', 'Greedent'
];

export class RandomGayTeams extends RandomTeams {
	randomSets: {[species: string]: RandomTeamsTypes.RandomSpeciesData} = require('./random-doubles-sets.json');
	randomDoublesSets: {[species: string]: RandomTeamsTypes.RandomSpeciesData} = require('./random-doubles-sets.json');
	items: string[] = [];

	protected enforceNoDirectCustomBanlistChanges() {
	}
	getLevel(
		species: Species,
		isDoubles: boolean,
	): number {
		if (this.adjustLevel) return this.adjustLevel;
		if (NICHE_POKEMON.includes(species.name)) {
			return 50;
		} else if (KINDA_NICHE_POKEMON.includes(species.name)) {
			return 50;
		} else if (HARD_TO_USE.includes(species.name)) {
			return 50;
		} else if (CONSISTENT.includes(species.name)) {
			return 50;
		} else if (BITCHES.includes(species.name)) {
			return 50;
		} else {
			return 50;
		}
	}

	randomTeam() {
		this.items = [];
		return super.randomTeam();
	}
	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		// if (species.cosmeticFormes) {
		// 	forme = this.sample([species.name].concat(species.cosmeticFormes));
		// }
		const sets = (this as any)[`random${isDoubles ? 'Doubles' : ''}Sets`][species.id]["sets"];
		let possibleSets = [];

		// const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			// if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
			// 	continue;
			// }
			// Try to get set with unused item, else default
			if (this.items.includes(set["items"][0])) {
				continue;
			}
			possibleSets.push(set);
		}
		if (possibleSets.length === 0) {
			possibleSets = sets;
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			if (movename.startsWith("Hidden Power")) {
				movePool.push("hiddenpower" + movename.substr(13).toLowerCase());
			} else {
				movePool.push(this.dex.moves.get(movename).id);
			}
		}
		const teraTypes = set.teraTypes;
		const teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		// const types = species.types;
		// const abilities = new Set(Object.values(species.abilities));
		// if (species.unreleasedHidden) abilities.delete(species.abilities.H);


		// Shouldn't need to do this?
		// let hasHiddenPower = false;
		// for (const move of moves) {
		// 	if (move.startsWith('hiddenpower')) {
		// 		hasHiddenPower = true;
		// 	}
		// }
		// Fix IVs for non-Bottle Cap-able sets
		// if (hasHiddenPower) {
		// 	let hpType;
		// 	for (const move of moves) {
		// 		if (move.startsWith('hiddenpower')) hpType = move.substr(11);
		// 	}
		// 	if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
		// 	const HPivs = ivs.atk === 0 ? ZeroAttackHPIVs[hpType] : this.dex.types.get(hpType).HPivs;
		// 	let iv: StatID;
		// 	for (iv in HPivs) {
		// 		ivs[iv] = HPivs[iv]!;
		// 	}
		// }

		// Get ability
		// ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		ability = set["ability"];
		if (ability === "Commander") ability = "Storm Drain";

		// Get items
		item = this.sampleIfArray(set["items"]);
		if (this.items.includes(item)) {
			item = this.sample(USEFUL_ITEMS.concat(set["items"]).filter(i => !this.items.includes(i)));
		}
		this.items.push(item);

		// First, the priority items
		// item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		// if (item === undefined) {
		// 	if (isDoubles) {
		// 		item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
		// 	} else {
		// 		item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
		// 	}
		// }

		// Get moves
		// const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
		// If not choiced, add weather moves into moveset
		if (!["Choice Band", "Choice Scarf", "Choice Specs", "Assault Vest"].includes(item)) {
			if (["Chlorophyll", "Flower Gift", "Solar Power"].includes(ability) && !["Jumpluff"].includes(forme)) {
				movePool[3] = "Sunny Day";
			}
			if (["Swift Swim"].includes(ability)) {
				movePool[3] = "Rain Dance";
			}
		}
		const moves = new Set<string>();
		for (const moveid of movePool) {
			moves.add(moveid);
		}
		// moves = set["movepool"];
		// const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get level
		const level = this.getLevel(species, isDoubles);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || item === 'Heavy-Duty Boots';
		let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		// Crash damage move users want an odd HP to survive two misses
		if (['axekick', 'highjumpkick', 'jumpkick'].some(m => moves.has(m))) srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if ((moves.has('substitute') && ['Sitrus Berry', 'Salac Berry'].includes(item))) {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if ((moves.has('bellydrum') || moves.has('filletaway')) && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || ability === 'Regenerator' || ['Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		// const noAttackStatMoves = [...moves].every(m => {
		// 	const move = this.dex.moves.get(m);
		// 	if (move.damageCallback || move.damage) return true;
		// 	if (move.id === 'shellsidearm') return false;
		// 	// Magearna, though this can work well as a general rule
		// 	if (move.id === 'terablast' && moves.has('shiftgear')) return false;
		// 	return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		// });
		// if (noAttackStatMoves && !moves.has('transform')) {
		// 	evs.atk = 0;
		// 	ivs.atk = 0;
		// }

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 512),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			teraType,
			role,
		};
	}
}

export default RandomGayTeams;
