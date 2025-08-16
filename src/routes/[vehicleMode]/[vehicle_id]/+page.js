import { fetchVehicleData } from '$lib/functions.js';

export async function load({ fetch: loadFetch, params }) {
	const { vehicleMode, vehicle_id } = params;
	return fetchVehicleData({ loadFetch, vehicleMode, vehicle_id });
}
