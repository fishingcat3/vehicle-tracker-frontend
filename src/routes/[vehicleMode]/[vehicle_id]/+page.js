import { fetchVehicleData } from '$lib/functions.js';

export async function load({ fetch, params }) {
	const { vehicleMode, vehicle_id } = params;
	return fetchVehicleData(vehicleMode, vehicle_id);
}
