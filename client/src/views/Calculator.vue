<template>
    <div class="w-full h-full flex flex-col items-center jus pt-10 gap-20 gacha-main">
        <div class="flex flex-wrap max-w-[60rem] gap-5 items-center justify-center">
            <div v-for="[optionName, optionData] of Object.entries(options)" class="main-container flex flex-col gap-2 w-min flex-grow">
                <p class="font-bold bg-secondary w-max px-3 -translate-x-3 text-xl capitalize">{{ optionName.replaceAll("_", " ") }}</p>
                <div class="flex items-center px-3 mx-3 h-10 mb-2 bg-[#030303]">
                    <img :src="imageUrl(optionName)" class="h-3/4">
                    <input v-model="options[optionName]" v-if="typeof(optionData) == 'number' || typeof(optionData) == 'string'" :name="optionName" type="number" min="0" @input="update" class="!bg-transparent input w-full !px-1" placeholder="0">
                    <div v-if="typeof(optionData) == 'boolean'" class="toggle">
                        <input v-model="options[optionName]" :name="optionName" @change="update" type="checkbox" :checked='optionData'/>
                    </div>
                    <div v-if="typeof(optionData) == 'object' && optionData.type == 'toggle'" class="flex items-center mr-7 min-w-32">
                        <div class="toggle">
                            <input v-model="optionData.state" :name="optionName" @change="update" type="checkbox" :checked='optionData.state'/>
                        </div>
                        <p class="capitalize pl-2">{{ optionData.values[optionData.state] }}</p>
                    </div>
                    <div v-if="typeof(optionData) == 'object' && optionData.type == 'select'" class="flex items-center">
                        <div v-if="typeof(optionData.state) == 'object'" class="select min-w-80">
                            <template v-for="[keys, key_values_array] of Object.entries(optionData.values)">
                            <label class="capitalize p-2">{{ keys }}</label>
                            <select v-model="optionData.state[keys]" @change="update" :name="keys">
                                <option v-for="[index, key_values] of Object.entries(key_values_array)" :value=parseInt(index)>{{ key_values }}</option>
                            </select>
                            </template>
                        </div>
                        <div v-if="typeof(optionData.state) == 'number'" class="select">
                            <select v-model="optionData.state" @change="update">
                                <option v-for="[index, v] of Object.entries(optionData.values)" :value=parseInt(index)>{{ v }} </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-8 flex-wrap justify-center">
            <div v-for="[displayGroup, displays] in Object.entries(display).slice(1)" class="main-container relative pb-2">
                <p class="font-bold bg-secondary w-max px-3 -translate-x-3 text-xl capitalize">{{ displayGroup.replaceAll("_", " ") }}</p>
                <div class="relative w-72 mx-2 h-20 -z-0 flex items-center justify-center">
                    <img class="w-10" :src="imageUrl(displayGroup)">
                    <p class="text-4xl text-main z-20 font-bold text-center">{{ displays.total.toLocaleString() }}</p>
                    <img class="h-20 absolute left-0 top-0 -z-10" src="/calculated_background.webp">
                </div>
                <div class="pl-1 pt-2">
                    <p v-for="[display, value] in Object.entries(displays).splice(1)" class="capitalize"><span class="text-highlight font-bold">+</span> <span class="bg-secondary px-1 font-bold">{{ value.toLocaleString() }}</span> {{ display.replaceAll("_", " ") }}</p>
                </div>
            </div>
            <div class="min-w-80 min-h-52 main-container relative">
                <p class="font-bold bg-secondary w-max px-3 -translate-x-3 text-xl capitalize">Stats</p>
                <Tooltip message="Some stats may be slightly innacurate due to a lack of data." class="absolute right-2 top-2"><p class="border border-highlight text-xs text-highlight cursor-pointer rounded-full ml-1 pt-0.5 px-[0.4rem]">?</p></Tooltip>
                <div class="flex items-center justify-center pt-2 flex-col gap-5">
                    <div class="flex flex-col gap-1">
                        <p><span class="bg-secondary px-1">{{ display.stats.nextPull }}%</span> Chance of <span class="gradient-ssr text-main font-bold px-1">SSR</span> in next pull.</p>
                        <p><span class="bg-secondary px-1">{{ display.stats.next10Pull }}%</span> Chance of <span class="gradient-ssr text-main font-bold px-1">SSR</span> in next <span class="font-bold">10</span> pull.</p>
                    </div>
                    <div class="flex gap-5">
                        <p>Soft Pity <span class="bg-secondary px-1">{{ display.stats.softPity }}</span></p>
                        <p>Hard Pity <span class="bg-secondary px-1">{{ display.stats.hardPity }}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Tooltip from '../components/Tooltip.vue';
</script>

<script>
    export default {
        data() {
            return {
                options: {
                    access_permission: 0,
                    collapse_piece: 0,
                    credit_token: 0,
                    withdrawal_receipts: 0,
                    current_pity: 0,
                    days_until_pull: 0,
                    //refund_rares: true,
                    crystal_contract: false,
                    platoon_daily: true,
                    pvp_drill_daily: true,

                    peak_value_assessment: {
                        type: 'select',
                        state: 0,
                        values: [
                            'N/A',
                            'Wave 1',
                            'Wave 2',
                            'Wave 3',
                            'Wave 4',
                            'Wave 5',
                            'Wave 6',
                            'Wave 7',
                        ]
                    },

                    pvp_rank: {
                        type: 'select',
                        state: {
                            title: 0,
                            rank:  0
                        },
                        values: {
                            title: [
                                'N/A',
                                'Junior',
                                'Professional',
                                'Elite',
                                'Adept',
                                'Expert',
                                'Master',
                            ],
                            rank:[
                                'N/A',
                                'I',
                                'II',
                                'III',
                                'IV',
                                'V',
                            ],
                        }
                    },


                    // TODO: need to calc the number of tickets for paid voyage pass
                    // 35 days for a full cycle, 31 days active, then 4 days off
                    // allegedly, CN server switches to 23 day cycles
                    //     (unsure if this includes the 4 day off, or if it's 27 day cycles after including them)

                    voyage_pass: {
                        type: 'select',
                        state: 0,
                        values: [
                            "N/A",
                            "Free to Play",     // base is 11 piece boxes, with 5 in each
                            "Hunter's Path",    // paid is 11 more with 10 in each, and flat +680 on top
                            "Broker's Path",    // 20$ paid is +600 more on top of that
                        ],
                        durration: 35,

                        pieces_per_pass: (() => {
                            let num_cp_boxes = 11;
                            let cp_per_box = [0,5,10,10];
                            let additional_flat_cp = [0,0,680,600];

                            let pieces = [];

                            for (let i = 0; i < cp_per_box.length; i++) {
                                pieces[i] = num_cp_boxes * cp_per_box[i] + additional_flat_cp.slice(0,i+1).reduce((a, b) => a + b);
                            }

                            // each of the paid BPs also include the free BP,
                            // so add the free pass count to the paid ones
                            pieces[2] += pieces[1];
                            pieces[3] += pieces[1];

                            return pieces;
                        })(),

                        // any paid tier of the voyage pass gives 4 extra access permissions
                        access_permission_per_pass: [0,0,4,4],
                    },

                    // monthy_military_sim_participation: true,

                    // gunsmoke is once every 3 weeks
                    gunsmoke_individual: {
                        type: 'select',
                        state: 0,
                        values: [
                            "N/A",
                            "600",
                            "2000",
                            "3800",
                            "8600",
                            "11600",
                            "15400"
                        ],
                    },

                    gunsmoke_platoon: {
                        type: 'select',
                        state: 0,
                        values: [
                            "N/A",
                            "10000",
                            "25000",
                            "50000",
                            "125000",
                            "175000",
                            "225000"
                        ],
                    },


                    boundary_push_bounties: {
                        type: 'select',
                        state: 0,
                        values: [
                            "N/A",
                            "Surface Layer",
                            "Intermediate Layer",
                            "Deep Layer"
                        ],
                    },

                    // TODO: add feild for days until Drill reset
                    //       could probably calculate this from the current day since it resets on sundays
                    expansion_drill: {
                        type: 'select',
                        state: 0,
                        values: [
                            'N/A',
                            'Drill I',
                            'Drill II',
                            'Drill III',
                            'Drill IV',
                            'Drill V',
                            'Drill VI',
                            'Drill VII',
                            'Drill VIII',
                            'Drill IX',
                            'Drill X',
                        ]
                    },

                    // TODO: add an option for current login streak for daily login
                    daily_login: true,

                    banner_type: {
                        type: 'toggle',
                        state: true,
                        values: {
                            false: "weapon",
                            true: "character",
                        }
                    }
                },

                display: {
                    stats: {
                        nextPull: "0.60",
                        next10Pull: "5.84",
                        softPity: "0.00",
                        hardPity: "0.00",
                    },
                    collapse_piece: {
                        total: 0,
                        owned: 0,
                        credit_token_exchange: 0,
                        commisions: 0,
                        crystal_contract: 0,
                        voyage_pass: 0,
                        daily_login: 0,
                        platoon_daily: 0,
                        gunsmoke_individual: 0,
                        gunsmoke_platoon: 0,
                        pvp_drill_daily: 0,
                        pvp_rank: 0,
                        expansion_drill: 0,
                        peak_value_assessment: 0,
                        boundary_push_bounties: 0,
                    },
                    access_permission: {
                        total: 0,
                        owned: 0,
                        previous_pulls: 0,
                        paid_voyage_pass: 0,
                        collapse_piece_exchange: 0,
                        withdrawal_receipts_exchange: 0,
                        //rare_refunds: 0
                    }
                }
            }
        },
        methods: {
            imageUrl(optionName) {
                const items = ["access_permission", "collapse_piece", "credit_token", "withdrawal_receipts"]

                if (items.includes(optionName)) {
                    return `/items/${optionName.replace("access_permission", "targeted_access_permission")}.webp`
                } else {
                    return `/${optionName}.webp`
                }
            },

            // TODO: update func to differentiate between weapon and character pity when calculating chances
            //       Currently this func assumes that weapon pity is the same as character pity.
            calculateChance(pity, pullAmount, baseChance, pityChance) {
                if (pity > 79) {
                    pity = 79
                }

                const basePulls = pity < (58 - pullAmount) ? pullAmount : (pity < 58 ? 58 - pity : 0)
                const pityPulls = pullAmount - basePulls
                const pullsAboveSoftcap = pity > 58 ? pity - 58 : 0

                var chance = 1

                for (let i = 1; i <= basePulls; i++) {
                    chance *= (1 - baseChance)
                }

                for (let i = pullsAboveSoftcap + 1; i <= pityPulls + pullsAboveSoftcap; i++) {
                    chance *= (1 - (i * pityChance + baseChance))
                }

                return (100 * (1 - chance))
            },
            update() {
                for (const [optionName, value] of Object.entries(this.options)) {
                    if (typeof(value) == "string") {
                        this.options[optionName] = Number(value)
                    }

                    if (typeof(value) == "number") {
                        this.options[optionName] = Math.max(0, Math.min(Number(value), 999999))
                    }

                    if (optionName == "days_until_pull") {
                        this.options[optionName] = Math.max(0, Math.min(Number(value), 9999))
                    }
                }

                this.display.collapse_piece.owned = this.options.collapse_piece
                this.display.collapse_piece.credit_token_exchange = this.options.credit_token
                this.display.collapse_piece.commisions = 60 * this.options.days_until_pull
                this.display.collapse_piece.platoon_daily = (this.options.platoon_daily) ? (20 * this.options.days_until_pull): 0
                this.display.collapse_piece.pvp_drill_daily = (this.options.pvp_drill_daily) ? (30 * this.options.days_until_pull): 0
                this.display.collapse_piece.crystal_contract = (this.options.crystal_contract) ? (80 * this.options.days_until_pull): 0
                // array values are the amout of Collapse Pieces awarded for each Wave of PVA cleared
                this.display.collapse_piece.peak_value_assessment = [0,20,20,25,25,30,30,40].slice(0, this.options.peak_value_assessment.state + 1).reduce((a, b) => a + b) * Math.floor(this.options.days_until_pull / 7)

                // for every full week of login, you get 30 Collapse Pieces
                // for the remaining days of the week, you get 15 Collapse Pieces on the 1st and 4th days
                // by dividing the remaining days by 3 and rounding up, we get 0, 1, or 2 for the number of times we need to add 15
                this.display.collapse_piece.daily_login = (this.options.daily_login) ? 30 * (Math.floor(this.options.days_until_pull / 7)) + 15 * Math.ceil((this.options.days_until_pull % 7)/3): 0

                //each Expansion Drill cleared awards 50 Collapse Pieces
                this.display.collapse_piece.expansion_drill = 50 * this.options.expansion_drill.state * Math.floor(this.options.days_until_pull / 14)

                // each Gunsmoke individual and platoon points tier awards 50 Collapse Pieces, and gunsmoke is run once every 3 weeks
                this.display.collapse_piece.gunsmoke_individual = 50 * this.options.gunsmoke_individual.state * Math.floor(this.options.days_until_pull / 21)
                this.display.collapse_piece.gunsmoke_platoon = 50 * this.options.gunsmoke_platoon.state * Math.floor(this.options.days_until_pull / 21)

                // voyage_pass
                this.display.collapse_piece.voyage_pass = this.options.voyage_pass.pieces_per_pass[this.options.voyage_pass.state] * Math.floor(this.options.days_until_pull / this.options.voyage_pass.durration)
                this.display.access_permission.paid_voyage_pass = this.options.voyage_pass.access_permission_per_pass[this.options.voyage_pass.state] * Math.floor(this.options.days_until_pull / this.options.voyage_pass.durration)

                // asumes you do all 4 bounties per week
                let bounty_depth_rewards = [0,20,25,30]
                this.display.collapse_piece.boundary_push_bounties = 4 * bounty_depth_rewards[this.options.boundary_push_bounties.state] * Math.floor(this.options.days_until_pull / 7)

                if (this.options.pvp_rank.state.title == 0 || this.options.pvp_rank.state.rank == 0) {
                    this.display.collapse_piece.pvp_rank = 0;
                }
                else
                {
                    // weekly pvp rank rewards start at 80 and then increases by 5 for each rank
                    // each Rank is worth 5 Collapse Pieces, but since Ranks go from 5 to 1, we need to get its compliment and multiply by 5 to get the correct amount
                    // each Title is 5 Ranks, each one is worth 25 Collapse Pieces, except the first Title (Junior) which doesn't award any on top of the base 80
                    this.display.collapse_piece.pvp_rank = (80 + (5**2 * (this.options.pvp_rank.state.title - 1) + 5 * (5 - this.options.pvp_rank.state.rank))) * Math.floor(this.options.days_until_pull / 7)
                }

                this.display.collapse_piece.total = Object.values(this.display.collapse_piece).slice(1).reduce((a, b) => a + b)

                this.display.access_permission.owned = this.options.access_permission
                this.display.access_permission.previous_pulls = this.options.current_pity
                this.display.access_permission.collapse_piece_exchange = Math.floor(this.display.collapse_piece.total / 150)
                this.display.access_permission.withdrawal_receipts_exchange = (1 + Math.floor(this.options.days_until_pull / 30)) * Math.min(Math.floor(this.options.withdrawal_receipts / 20), 5)
                this.display.access_permission.total = Object.values(this.display.access_permission).slice(1).reduce((a, b) => a + b)
                //const total = Object.values(this.display.access_permission).slice(1).reduce((a, b) => a + b)
                //this.display.access_permission.refund_rares = Math.floor((total * 1.7) / 20)
                //this.display.access_permission.total = total + this.display.access_permission.rare_refunds

                const accessPermissions = this.display.access_permission.total

                if (this.options.banner_type.state) {
                    this.display.stats.nextPull = this.calculateChance(accessPermissions, 1, 0.006, 0.04518).toFixed(2)
                    this.display.stats.next10Pull = this.calculateChance(accessPermissions, 10, 0.006, 0.04518).toFixed(2)
                } else {
                    this.display.stats.nextPull = this.calculateChance(accessPermissions, 1, 0.007, 0.04518).toFixed(2)
                    this.display.stats.next10Pull = this.calculateChance(accessPermissions, 10, 0.007, 0.04518).toFixed(2)
                }

                this.display.stats.softPity = (1 - ((58 - accessPermissions) / 58)).toFixed(2)
                this.display.stats.hardPity = (1 - ((80 - accessPermissions) / 80)).toFixed(2)
            }
        }
    }
</script>