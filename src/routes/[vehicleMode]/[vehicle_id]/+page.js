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
		const vehicleDetails = data.results;
		for (const t of vehicleDetails.trips) t.key = t.date + t.trip_id;
		return {
			vehicleDetails,
			vehicleMode,
			vehicle_id
		};
	} catch (error) {
		console.error('Error fetching vehicle details:', error);
		return {
			vehicleDetails: null,
			vehicleMode,
			vehicle_id
		};
	}
}
