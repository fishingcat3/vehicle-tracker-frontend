import { fetchVehicles } from '$lib/functions.js';

export async function load({ fetch, params }) {
	const { vehicleMode } = params;

	return {
		vehicleMode,
		streamed: {
			vehicles: fetchVehicles(vehicleMode)
		}
	};
}
