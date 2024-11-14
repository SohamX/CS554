export const cuisineType = (function () {
    const cuisineTypeEnum = Object.freeze({
        AMERICAN: 'American',
        MEXICAN: 'Mexican',
        ITALIAN: 'Italian',
        FRENCH: 'French',
        GREEK: 'Greek',
        DUTCH: 'Dutch',
        POLISH: 'Polish',
        HUNGARIAN: 'Hungarian',
        INDIAN: 'Indian',
        CHINESE: 'Chinese',
        JAPANESE: 'Japanese',
        KOREAN: 'Korean',
        VIETNAMESE: 'Vietnamese',
        THAI: 'Thai',
        MONGOLIAN: 'Mongolian'
    });
    return {
        get: function (cuisineName) {
            return cuisineTypeEnum[cuisineName.toUpperCase()] || undefined;
        }
    };
})();

export const S3UrlPattern = new RegExp(
    /^https?:\/\/(?:[a-zA-Z0-9-]+\.s3\.[a-zA-Z0-9-]+\.amazonaws\.com\/[a-zA-Z0-9-._~%]*)|(?:https?:\/\/s3\.[a-zA-Z0-9-]+\.amazonaws\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._~%]*)$/
);

export const imageMagicUrlPattern = new RegExp(
    /^https:\/\/(?:[a-zA-Z0-9.-]+)\/(?:convert|mogrify)\/(?:[a-zA-Z0-9%._+~#=,-]+)\?(?:[a-zA-Z0-9=&]+)$/
);