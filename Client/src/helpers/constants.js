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

export const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => {
      return (value * Math.PI) / 180;
    };
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in meters
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const km = getDistance(lat1, lon1, lat2, lon2) / 1000;
    return km;
};

export const getCoordinatesFromAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GMAP_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if(data.results && data.results.length > 0 ){
            const { lat, lng } = data.results[0].geometry.location;
            return { latitude: lat, longitude: lng };
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}