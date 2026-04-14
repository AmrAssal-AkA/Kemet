const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const googleMapsService = {
    async getGeocoding(address) {
        try {
            const response = await client.geocode({
                params: {
                    address: address,
                    key: API_KEY
                }
            });

            if (response.data.results.length > 0) {
                const result = response.data.results[0];
                return {
                    coordinates: [result.geometry.location.lng, result.geometry.location.lat],
                    formattedAddress: result.formatted_address,
                    placeId: result.place_id
                };
            }
            throw new Error("No location found for this address");
        } catch (error) {
            console.error("Geocoding Error:", error.response?.data?.error_message || error.message);
            throw error;
        }
    },

    async getPlaceDetails(placeId) {
        try {
            const response = await client.placeDetails({
                params: {
                    place_id: placeId,
                    fields: ['name', 'rating', 'formatted_phone_number'],
                    key: API_KEY
                }
            });
            return response.data.result;
        } catch (error) {
            console.error("Place Details Error:", error.message);
            throw error;
        }
    }
};

module.exports = googleMapsService;