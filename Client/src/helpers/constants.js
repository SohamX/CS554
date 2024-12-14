export const cuisineTypeEnum = Object.freeze({
    AMERICAN: 'AMERICAN',
    MEXICAN: 'MEXICAN',
    ITALIAN: 'ITALIAN',
    FRENCH: 'FRENCH',
    GREEK: 'GREEK',
    DUTCH: 'DUTCH',
    POLISH: 'POLISH',
    HUNGARIAN: 'HUNGARIAN',
    INDIAN: 'INDIAN',
    CHINESE: 'CHINESE',
    JAPANESE: 'JAPANESE',
    KOREAN: 'KOREAN',
    VIETNAMESE: 'VIETNAMESE',
    THAI: 'THAI',
    MONGOLIAN: 'MONGOLIAN',
    OTHER: 'OTHER'
});

export const cardNumberPattern = new RegExp(/^\d{16}$/);

export const cvvPattern = new RegExp(/^\d{3}$/);

export const zipCodePattern = new RegExp(/^\d{5}(-\d{4})?$/);

export const taxPercent = 0.06;
