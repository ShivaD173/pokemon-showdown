import {RandomTeams} from './../../random-teams';

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
	'Flamigo', 'Dachsbun', 'Kricketune', 'Slurpuff', 'Castform', 'Linoone',
	// Unoptimized Sets
	'Eelektross', 'Wyrdeer', 'Lurantis',
	// Blobs
	'Bastiodon', 'Vaporeon', 'Probopass', 'Shuckle',
];

const HARD_TO_USE = [
	// REquire TR
	'Marowak', 'Cursola', 'Arboliva', 'Vikavolt',
	// Super frail
	'Ninjask', 'Wugtrio', 'Eevee', 'Squawkabilly', 'Pikachu', 'Flapple', 'Raticate',
	// Require Enemy
	'Brambleghast', 'Shiftry', 'Klawf',
];

const CONSISTENT = [
	'Heatran', 'Latios', 'Latias', 'Blissey', 'Iron Hands',
	// Tailwind
	'Whimsicott', 'Volbeat', 'Illumise', 'Tornadus',
	// Follow Me
	'Blastoise', 'Indeedee-F', 'Maushold', 'Magmortar',
];

const BITCHES = [
	'Porygon2', 'Registeel', 'Goodra-Hisui', 'Kecleon', 'Tropius', 'Greedent'
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
		if (NICHE_POKEMON.includes(species.name)) {
			return 54;
		} else if (KINDA_NICHE_POKEMON.includes(species.name)) {
			return 52;
		} else if (HARD_TO_USE.includes(species.name)) {
			return 51;
		} else if (CONSISTENT.includes(species.name)) {
			return 49;
		} else if (BITCHES.includes(species.name)) {
			return 48;
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
		// const possibleSets = [];

		// const ruleTable = this.dex.formats.getRuleTable(this.format);

		// for (const set of sets) {
		// 	// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
		// 	if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
		// 		continue;
		// 	}
		// 	possibleSets.push(set);
		// }
		const set = this.sampleIfArray(sets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const teraTypes = set.teraTypes;
		const teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		const types = species.types;
		const abilities = new Set(Object.values(species.abilities));
		if (species.unreleasedHidden) abilities.delete(species.abilities.H);

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
		// const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get ability
		// ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		ability = set["ability"];

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

		// if (species.baseSpecies === 'Pikachu') {
		// 	forme = 'Pikachu' + this.sample(['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner', '-World']);
		// }

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
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm') return false;
			// Magearna, though this can work well as a general rule
			if (move.id === 'terablast' && moves.has('shiftgear')) return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});
		if (noAttackStatMoves && !moves.has('transform')) {
			evs.atk = 0;
			ivs.atk = 0;
		}

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
			shiny: this.randomChance(1, 1024),
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
