export const Items: {[k: string]: ModdedItemData} = {
	// Edited Items
	berserkgene: {
		inherit: true,
		isNonstandard: null,
		desc: "On switch-in, raises holder's Attack by 1 and confuses it. Single use.",
		shortDesc: "On switch-in, raises holder's Attack by 1 and confuses it. Single use.",
		boosts: {atk: 1},
	},
	shellbell: {
		inherit: true,
		desc: "After an attack, holder gains 1/4 of the damage in HP dealt to other Pokemon.",
		shortDesc: "After an attack, holder gains 1/4 of the damage in HP dealt to other Pokemon.",
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.totalDamage && !pokemon.forceSwitchFlag) {
				this.heal(move.totalDamage / 4, pokemon);
			}
		},
	},
	luckypunch: {
		inherit: true,
		isNonstandard: null,
		shortDesc: "If held by a Chansey/Ledian, its critical hit ratio is raised by 2 stages.",
		desc: "If held by a Chansey/Ledian, its critical hit ratio is raised by 2 stages.",
		onModifyCritRatio(critRatio, user) {
			if (user.baseSpecies.name === 'Chansey' || user.baseSpecies.name === 'Ledian') {
				return critRatio + 2;
			}
		},
		itemUser: ["Chansey", "Ledian"],
	},
	// Making Illegal
	focusband: {
		"inherit": true,
		isNonstandard: "Past",
	},
	brightpowder: {
		"inherit": true,
		isNonstandard: "Past",
	},
	// Making Illegal
	thickclub: {
		"inherit": true,
		isNonstandard: null,
	},
	leek: {
		"inherit": true,
		isNonstandard: null,
	},
	custapberry: {
		"inherit": true,
		isNonstandard: null,
	},
	enigmaberry: {
		"inherit": true,
		isNonstandard: null,
	},
	dracoplate: {
		"inherit": true,
		isNonstandard: null,
	},
	dreadplate: {
		"inherit": true,
		isNonstandard: null,
	},
	earthplate: {
		"inherit": true,
		isNonstandard: null,
	},
	fistplate: {
		"inherit": true,
		isNonstandard: null,
	},
	flameplate: {
		"inherit": true,
		isNonstandard: null,
	},
	icicleplate: {
		"inherit": true,
		isNonstandard: null,
	},
	insectplate: {
		"inherit": true,
		isNonstandard: null,
	},
	ironplate: {
		"inherit": true,
		isNonstandard: null,
	},
	meadowplate: {
		"inherit": true,
		isNonstandard: null,
	},
	mindplate: {
		"inherit": true,
		isNonstandard: null,
	},
	skyplate: {
		"inherit": true,
		isNonstandard: null,
	},
	splashplate: {
		"inherit": true,
		isNonstandard: null,
	},
	spookyplate: {
		"inherit": true,
		isNonstandard: null,
	},
	stoneplate: {
		"inherit": true,
		isNonstandard: null,
	},
	toxicplate: {
		"inherit": true,
		isNonstandard: null,
	},
	zapplate: {
		"inherit": true,
		isNonstandard: null,
	},
	pixieplate: {
		"inherit": true,
		isNonstandard: null,
	},
	// magmarizer: {
	// 	"inherit": true,
	// 	onModifySpAPriority: 1,
	// 	onModifySpA(spa, pokemon) {
	// 		if (pokemon.baseSpecies.baseSpecies === 'Magmortar') {
	// 			return this.chainModify(1.5);
	// 		}
	// 	},
	// 	itemUser: ["Magmortar"],
	// 	isNonstandard: null,
	// },
	// electirizer: {
	// 	"inherit": true,
	// 	onModifyAtkPriority: 1,
	// 	onModifyAtk(atk, pokemon) {
	// 		if (pokemon.baseSpecies.baseSpecies === 'Electivire') {
	// 			return this.chainModify(1.5);
	// 		}
	// 	},
	// 	itemUser: ["Electivire"],
	// 	isNonstandard: null,
	// },
	// protector: {
	// 	"inherit": true,
	// 	onModifyDefPriority: 1,
	// 	onModifyDef(def, pokemon) {
	// 		if (pokemon.baseSpecies.baseSpecies === 'Rhyperior') {
	// 			return this.chainModify(1.5);
	// 		}
	// 	},
	// 	itemUser: ["Rhyperior"],
	// 	isNonstandard: null,
	// },
	dousedrive: {
		"inherit": true,
		isNonstandard: null,
	},
	shockdrive: {
		"inherit": true,
		isNonstandard: null,
	},
	burndrive: {
		"inherit": true,
		isNonstandard: null,
	},
	chilldrive: {
		"inherit": true,
		isNonstandard: null,
	},
	dubiousdisc: {
		"inherit": true,
		isNonstandard: null,
		onDrive: 'Ghost'
	},
	deepseascale: {
		inherit: true,
		isNonstandard: null,
	},
	deepseatooth: {
		inherit: true,
		isNonstandard: null,
	},
	souldew: {
		inherit: true,
		isNonstandard: null,
	},
	bugmemory: {
		inherit: true,
		isNonstandard: null,
	},
	darkmemory: {
		inherit: true,
		isNonstandard: null,
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: null,
	},
	electricmemory: {
		inherit: true,
		isNonstandard: null,
	},
	fairymemory: {
		inherit: true,
		isNonstandard: null,
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: null,
	},
	firememory: {
		inherit: true,
		isNonstandard: null,
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: null,
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: null,
	},
	grassmemory: {
		inherit: true,
		isNonstandard: null,
	},
	groundmemory: {
		inherit: true,
		isNonstandard: null,
	},
	icememory: {
		inherit: true,
		isNonstandard: null,
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: null,
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: null,
	},
	rockmemory: {
		inherit: true,
		isNonstandard: null,
	},
	steelmemory: {
		inherit: true,
		isNonstandard: null,
	},
	watermemory: {
		inherit: true,
		isNonstandard: null,
	},

};
