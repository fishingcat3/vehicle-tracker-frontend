export async function load({ fetch, params }) {
	const { vehicleMode, vehicle_id } = params;

	try {
		const response = await fetch(
			`https://gtfs-r-vehicles.up.railway.app/api/vehicle/${vehicleMode}?vehicle_id=${vehicle_id}`
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return {
			vehicleDetails: data.results,
			vehicleMode,
			vehicle_id
		};
	} catch (error) {
		console.error('Error fetching vehicle details:', error);
		return {
			vehicleDetails: null, // Return null on error
			vehicleMode,
			vehicle_id
		};
	}
}
