import { getApp } from 'firebase/app';
import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend,
    Schema,
} from 'firebase/ai';

const LIGHTERPACK_CSV_COLUMNS_MAP: Record<string, number> = {
    ITEM_NAME: 0,
    CATEGORY: 1,
    DESC: 2,
    QTY: 3,
    WEIGHT: 4,
    UNIT: 5,
    URL: 6,
    PRICE: 7,
    WORN: 8,
    CONSUMABLE: 9,
    IMAGE_URL_SMALL: 10,
    IMAGE_URL_LARGE: 11,
};

const convertWeightToGrams = (
    weight: number | string,
    unit: string,
): number => {
    if (typeof weight === 'string') {
        weight = parseFloat(weight);
    }
    if (isNaN(weight)) return 0;

    switch (unit) {
        case 'gram':
            return _round(weight, constants.LIMIT.maxFractionDigits);
        case 'kilogram':
            return _round(weight * 1000);
        case 'ounce':
            return _round(weight * 28.3495);
        case 'pound':
            return _round(weight * 453.592);
        default:
            return 0;
    }
};

const CONVERT_LIGHTERPACK_CSV_TO_GEARS_PROMPT = `
    You are an expert in outdoor gear data processing.
    Your task is to convert a CSV data into a structured JSON object that strictly follows the provided schema.
    I want you to guess possible brands, categories, and acquisition dates of the gear items based on the CSV data.

    CSV columns:
    0. index: a unique identifier for each item (number)
    1. item name: the name of the gear item (string)
    2. category: the category of the gear item (user defined string)
    3. desc: a brief description of the gear item (string)
    4. worn: 'true' if the item is worn, otherwise empty

    Instructions:
    - Output a JSON object with a single property "gears", which is an array of gear objects.
    - Do NOT include any properties not defined in the schema.
    - Ensure the output matches the provided schema exactly.
    - For each gear object, include only the following properties:
      - index: from column 0 (number, required)
      - brand: a brand key from the predefined list below (omit if no suitable brand is found)
      - category: the mapped predefined category (omit if not sure)
    - The predefined brand list: [${constants.GEAR_BRAND_KEYS.join(',')}]
    
    Here is the CSV data:`;

// Provide a JSON schema object using a standard format.
const responseGearsJsonSchema = Schema.object({
    properties: {
        gears: Schema.array({
            items: Schema.object({
                properties: {
                    index: Schema.number({
                        description: 'A unique identifier for each gear item',
                    }),
                    brand: Schema.string({
                        description:
                            'The brand of the gear item if available, otherwise ignored.',
                    }),
                    category: Schema.enumString({
                        enum: constants.GEAR_CATEGORY_KEYS,
                        description: 'The category of the gear item.',
                    }),
                },
                optionalProperties: ['brand', 'category'],
            }),
        }),
    },
    description: 'A list of outdoor / hiking gear brand and category.',
});

export const useConvertLighterpackGears = () => {
    // Initialize the Gemini Developer API backend service
    const firebaseApp = getApp();
    const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

    /**
     * Convert a Lighterpack gears array to an array of gear items.
     * This function reads the lighterpackGears array, filters out consumable items, and formats the data
     * into a structure that can be used to create gear items.
     * Steps include:
     * 1. Iterate through each row and extract relevant columns.
     * 2. Use the Gemini AI model to convert the CSV data to gear items.
     * 3. Merge the result data with the formatted gear items.
     * 4. Format the result data to editing gear items.
     */
    const convertLighterpackGears = async (
        lighterpackGears: string[][],
        options: {
            currency: CurrencyCode;
        },
    ) => {
        // 1. filter out gear without item name or with consumable flag, and remove duplicates (same name and weight), and limit to importLimit
        const filteredLighterpackGearRows: string[][] = [];
        const seen = new Set<string>();
        let count = 0;
        lighterpackGears.forEach((row) => {
            if (count >= constants.LIMIT.importLimit) {
                return;
            }
            // filter out gear without item name
            if (!row[LIGHTERPACK_CSV_COLUMNS_MAP.ITEM_NAME]) {
                return;
            }
            // filter out consumable items
            if (row[LIGHTERPACK_CSV_COLUMNS_MAP.CONSUMABLE]) {
                return;
            }
            // filter out duplicates (same name and weight)
            const name = row[LIGHTERPACK_CSV_COLUMNS_MAP.ITEM_NAME];
            const weight = row[LIGHTERPACK_CSV_COLUMNS_MAP.WEIGHT];
            const key = `${name}__${weight}`;
            if (seen.has(key)) {
                return;
            }
            seen.add(key);
            filteredLighterpackGearRows.push(row);
            count++;
        });

        // 2. iterate through each row and extract relevant columns
        const gearRowsForGemini: (string | number)[][] = [];
        const gearsData: any[] = [];
        filteredLighterpackGearRows.forEach((row, index) => {
            // each formatted row should contain: index, item name, category, desc, worn
            const rowForGemini = [];
            rowForGemini.push(index);
            rowForGemini.push(row[LIGHTERPACK_CSV_COLUMNS_MAP.ITEM_NAME]);
            rowForGemini.push(row[LIGHTERPACK_CSV_COLUMNS_MAP.CATEGORY]);
            rowForGemini.push(row[LIGHTERPACK_CSV_COLUMNS_MAP.DESC]);
            rowForGemini.push(
                row[LIGHTERPACK_CSV_COLUMNS_MAP.WORN] ? 'true' : '',
            );
            gearRowsForGemini.push(rowForGemini);

            // format name, description, weight, price, image urls locally
            const partialData: any = {};
            const itemName = row[LIGHTERPACK_CSV_COLUMNS_MAP.ITEM_NAME];
            partialData.name = itemName
                .trim()
                .slice(0, constants.LIMIT.maxNameLength);
            const desc = row[LIGHTERPACK_CSV_COLUMNS_MAP.DESC];
            if (desc) {
                partialData.description = desc
                    .trim()
                    .slice(0, constants.LIMIT.maxGearDescriptionLength);
            }
            const weight = row[LIGHTERPACK_CSV_COLUMNS_MAP.WEIGHT];
            const weightUnit = row[LIGHTERPACK_CSV_COLUMNS_MAP.UNIT];
            partialData.weight = _clamp(
                convertWeightToGrams(weight, weightUnit),
                constants.LIMIT.minWeight,
                constants.LIMIT.maxWeight,
            );
            const price = row[LIGHTERPACK_CSV_COLUMNS_MAP.PRICE];
            if (+price > 0 && options.currency) {
                // only set price and currency if price is greater than 0
                partialData.price = price;
                partialData.currency = options.currency;
            }
            const imgUrlSm = row[LIGHTERPACK_CSV_COLUMNS_MAP.IMAGE_URL_SMALL];
            const imgUrlLg = row[LIGHTERPACK_CSV_COLUMNS_MAP.IMAGE_URL_LARGE];
            if (imgUrlSm && imgUrlLg) {
                partialData.imgUrlSm = imgUrlSm;
                partialData.imgUrlLg = imgUrlLg;
            }

            gearsData.push(partialData);
        });

        // 3. prompt the Gemini AI model to convert the CSV data to gear items
        try {
            const model = getGenerativeModel(ai, {
                model: 'gemini-2.0-flash',
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: responseGearsJsonSchema,
                },
            });
            const csvStr = gearRowsForGemini
                .map((row) => {
                    return row.join(',');
                })
                .join('\n');
            const prompt = `${CONVERT_LIGHTERPACK_CSV_TO_GEARS_PROMPT}\n${csvStr}`;
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const resultGearItems = JSON.parse(text).gears;

            // 4. merge the result data with the formatted gear items
            resultGearItems.forEach((item: any) => {
                // merge the result data with the item
                if (
                    item.index === undefined ||
                    item.index < 0 ||
                    item.index >= gearsData.length ||
                    gearsData[item.index] === undefined
                ) {
                    console.warn(`Invalid index ${item.index} for item:`, item);
                    return;
                }
                // set the brand only if it is a defined brand
                if (item.brand && constants.GEAR_BRANDS[item.brand]) {
                    gearsData[item.index].brand = item.brand;
                } else if (false) {
                    // TODO: use levenshtein distance to find the closest brand
                }
                gearsData[item.index].category = item.category;
            });

            // TODO: log total tokens and billable characters
            // const { totalTokens, totalBillableCharacters } =
            //     await model.countTokens(prompt);
            // console.log(
            //     `Total tokens: ${totalTokens}, total billable characters: ${totalBillableCharacters}`,
            // );
        } catch (error: any) {
            throw new Error(`Gemini AI error: ${error.message}`);
        }

        // 5. format the result data to editing gear items
        const resultGears = gearsData.map((item) =>
            dataUtils.formatFormStateToEditingGear(item),
        );
        return resultGears;
    };

    return {
        convertLighterpackGears,
    };
};
