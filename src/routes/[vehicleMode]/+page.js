export async function load({ fetch, params }) {
	const { vehicleMode } = params;

	async function fetchVehicles() {
		try {
			const response = await fetch(
				`https://gtfs-r-vehicles.up.railway.app/api/realtime/${vehicleMode}`
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			let processedVehicles = data.results || [];

			if (vehicleMode === 'lightrailcbdandsoutheast') {
				const coupledVehicles = [];
				processedVehicles.forEach((v) => {
					coupledVehicles.push(v); // Add the original
					if (v.coupled_vehicle_id) {
						// Create a swapped entry for the coupled vehicle
						const coupled = {
							...v,
							vehicle_id: v.coupled_vehicle_id,
							coupled_vehicle_id: v.vehicle_id
						};
						coupledVehicles.push(coupled);
					}
				});
				processedVehicles = coupledVehicles;
			}

			// Sort all vehicles by vehicle_id
			return processedVehicles.sort((a, b) => a.vehicle_id.localeCompare(b.vehicle_id));
		} catch (error) {
			console.error('Error fetching vehicles:', error);
			return []; // Return empty array on error
		}
	}

	return {
		vehicleMode,
		streamed: {
			vehicles: fetchVehicles()
		}
	};
}
