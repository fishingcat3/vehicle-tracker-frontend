import { fetchVehicleData } from '$lib/functions.js';

export async function load({ fetch: loadFetch, params, url }) {
	const { vehicleMode, vehicle_id } = params;
	const page = url.searchParams.get('page') || 1;
	return fetchVehicleData({ loadFetch, vehicleMode, vehicle_id, currentPage: page });
}
