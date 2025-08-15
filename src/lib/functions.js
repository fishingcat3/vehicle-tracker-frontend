export function shortDate(date) {
	if (!(date instanceof Date)) date = new Date(parseInt(date));

	return `${date.toLocaleTimeString('en-AU', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	})} ${date.toLocaleDateString('en-AU', {
		weekday: 'short'
	})} ${date.toLocaleDateString('en-AU', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	})}`;
}

export function shortYear(dateString) {
	const year = parseInt(dateString.substring(0, 4));
	const month = parseInt(dateString.substring(4, 6)) - 1;
	const day = parseInt(dateString.substring(6, 8));

	const date = new Date(year, month, day);

	const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
	const dayFormatted = date.getDate().toString().padStart(2, '0');
	const monthFormatted = (date.getMonth() + 1).toString().padStart(2, '0');
	const yearFormatted = date.getFullYear().toString().slice(-2);

	return `${weekday} ${dayFormatted}/${monthFormatted}/${yearFormatted}`;
}

export async function fetchVehicles(vehicleMode) {
	try {
		const response = await fetch(
			`https://gtfs-r-vehicles.up.railway.app/api/realtime/${vehicleMode}`
		);
		if (!response.ok) throw new Error('Network response was not ok');
		const data = await response.json();
		return (data.results || []).sort((a, b) => a.vehicle_id.localeCompare(b.vehicle_id));
	} catch (error) {
		console.error('Error fetching vehicles:', error);
		return [];
	}
}
