// PillMatch Contraceptive Pills Database
// Structure: Generic Name, Brand Names, Suitable Groups (Age Group - BMI Group combinations)

const PILLS_DATABASE = {
    // Combined Oral Contraceptives (COCs)
    "Levonorgestrel + Ethinyl Estradiol": {
        brandNames: [
            "Alesse", "Aviane", "Lutera", "Sronyx", "Vienva", "Falmina", "Kurvelo", "Lessina", "Levora", "Nordette", "Portia", "Seasonale", "Seasonique", "Tri-Levlen", "Triphasil", "Trivora"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3",
            "Mature - BMI Group 1", "Mature - BMI Group 2"
        ],
        category: "Combined Oral Contraceptive",
        description: "Most common type of birth control pill. Contains both estrogen and progestin."
    },

    "Norethindrone + Ethinyl Estradiol": {
        brandNames: [
            "Brevicon", "Modicon", "Necon", "Nortrel", "Ortho-Novum", "Ovcon", "Zenchent"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3",
            "Mature - BMI Group 1", "Mature - BMI Group 2"
        ],
        category: "Combined Oral Contraceptive",
        description: "Traditional combined pill with norethindrone progestin."
    },

    "Drospirenone + Ethinyl Estradiol": {
        brandNames: [
            "Yasmin", "Yaz", "Beyaz", "Gianvi", "Loryna", "Ocella", "Safyral", "Slynd", "Syeda", "Vestura", "Zarah"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3",
            "Mature - BMI Group 1", "Mature - BMI Group 2"
        ],
        category: "Combined Oral Contraceptive",
        description: "Contains drospirenone, which may help with water retention and acne."
    },

    "Desogestrel + Ethinyl Estradiol": {
        brandNames: [
            "Apri", "Desogen", "Kariva", "Mircette", "Reclipsen", "Solia"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3",
            "Mature - BMI Group 1", "Mature - BMI Group 2"
        ],
        category: "Combined Oral Contraceptive",
        description: "Third-generation progestin with lower androgenic activity."
    },

    // Progestin-Only Pills (POPs) - Better for higher BMI and older age groups
    "Norethindrone (Progestin-Only)": {
        brandNames: [
            "Camila", "Errin", "Heather", "Jencycla", "Micronor", "Nora-BE", "Norlyda", "Ortho Micronor", "Sharobel"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3", "Young - BMI Group 4",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3", "Adult - BMI Group 4",
            "Mature - BMI Group 1", "Mature - BMI Group 2", "Mature - BMI Group 3", "Mature - BMI Group 4"
        ],
        category: "Progestin-Only Pill",
        description: "Mini-pill. No estrogen, safer for women with certain health conditions."
    },

    "Drospirenone (Progestin-Only)": {
        brandNames: [
            "Slynd"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3", "Young - BMI Group 4",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3", "Adult - BMI Group 4",
            "Mature - BMI Group 1", "Mature - BMI Group 2", "Mature - BMI Group 3", "Mature - BMI Group 4"
        ],
        category: "Progestin-Only Pill",
        description: "Progestin-only version of drospirenone, 24/4 dosing."
    },

    // Extended Cycle Pills
    "Levonorgestrel + Ethinyl Estradiol (Extended Cycle)": {
        brandNames: [
            "Seasonale", "Seasonique", "Quartette", "Amethia", "Camrese", "Camrese Lo", "Daysee", "Introvale", "Jolessa", "LoSeasonique", "Quasense"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3",
            "Mature - BMI Group 1", "Mature - BMI Group 2"
        ],
        category: "Extended Cycle Pill",
        description: "Reduces periods to 4 times per year or less."
    },

    // Low-Dose Options for Mature Age Group
    "Norethindrone + Ethinyl Estradiol (Low Dose)": {
        brandNames: [
            "Lo Loestrin Fe", "Loestrin", "Microgestin", "Junel", "Loestrin 24 Fe", "Gildess", "Hailey", "Larin", "Taytulla"
        ],
        suitableGroups: [
            "Mature - BMI Group 1", "Mature - BMI Group 2", "Mature - BMI Group 3"
        ],
        category: "Low-Dose Combined Pill",
        description: "Lower estrogen content, suitable for older women."
    },

    // Special Considerations for High BMI Groups
    "Norethindrone + Ethinyl Estradiol (High BMI)": {
        brandNames: [
            "Loestrin", "Microgestin", "Junel", "Gildess", "Hailey", "Larin", "Taytulla"
        ],
        suitableGroups: [
            "Young - BMI Group 4", "Adult - BMI Group 4", "Mature - BMI Group 4"
        ],
        category: "Combined Pill (High BMI)",
        description: "May be less effective in women with higher BMI. Consider progestin-only options."
    },

    // Emergency Contraception (for all groups)
    "Levonorgestrel (Emergency)": {
        brandNames: [
            "Plan B One-Step", "Take Action", "My Way", "AfterPill", "Ella", "Next Choice"
        ],
        suitableGroups: [
            "Young - BMI Group 1", "Young - BMI Group 2", "Young - BMI Group 3", "Young - BMI Group 4",
            "Adult - BMI Group 1", "Adult - BMI Group 2", "Adult - BMI Group 3", "Adult - BMI Group 4",
            "Mature - BMI Group 1", "Mature - BMI Group 2", "Mature - BMI Group 3", "Mature - BMI Group 4"
        ],
        category: "Emergency Contraception",
        description: "Emergency contraception, not for regular use."
    }
};

// Pill categories for filtering
const PILL_CATEGORIES = {
    "Combined Oral Contraceptive": "Combined Pills (Estrogen + Progestin)",
    "Progestin-Only Pill": "Progestin-Only Pills (Mini-Pills)",
    "Extended Cycle Pill": "Extended Cycle Pills",
    "Low-Dose Combined Pill": "Low-Dose Combined Pills",
    "Combined Pill (High BMI)": "Combined Pills (High BMI Considerations)",
    "Emergency Contraception": "Emergency Contraception"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PILLS_DATABASE, PILL_CATEGORIES };
} else {
    window.PILLS_DATABASE = PILLS_DATABASE;
    window.PILL_CATEGORIES = PILL_CATEGORIES;
} 