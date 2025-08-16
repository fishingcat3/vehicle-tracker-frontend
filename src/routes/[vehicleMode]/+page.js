import { fetchVehicles } from '$lib/functions.js';

export async function load({ fetch: loadFetch, params }) {
	const { vehicleMode } = params;
	return {
		vehicleMode,
		streamed: {
			vehicles: fetchVehicles({ loadFetch, vehicleMode })
		}
	};
}
