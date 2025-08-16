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

export function shortTime(date) {
	if (!(date instanceof Date)) date = new Date(parseInt(date));

	return `${date.toLocaleTimeString('en-AU', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	})}`;
}

export function shortYear(dateString) {
	const year = parseInt(dateString.substring(0, 4));
	const month = parseInt(dateString.substring(4, 6)) - 1;
	const day = parseInt(dateString.substring(6, 8));

	const date = new Date(year, month, day);

	const weekday = date.toLocaleDateString('en-AU', { weekday: 'long' });

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	return `${weekday}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function secondsToHMS(i) {
	let s = Math.floor(Math.abs(i));
	const w = Math.floor(s / 604800);
	s %= 604800;
	const d = Math.floor(s / 86400);
	s %= 86400;
	const h = Math.floor(s / 3600);
	s %= 3600;
	const m = Math.floor(s / 60);
	s %= 60;

	const parts = [];
	if (w > 0) parts.push(`${w}w`);
	if (d > 0) parts.push(`${d}d`);
	if (h > 0) parts.push(`${h}h`);
	if (m > 0) parts.push(`${m}m`);
	if (s > 0 || parts.length === 0) parts.push(`${s}s`);

	return parts.join(' ');
}

export async function fetchVehicles({ loadFetch, vehicleMode }) {
	try {
		const response = await loadFetch(
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

export async function fetchVehicleData({ loadFetch, vehicleMode, vehicle_id }) {
	try {
		const response = await loadFetch(
			`https://gtfs-r-vehicles.up.railway.app/api/vehicle/${vehicleMode}?vehicle_id=${vehicle_id}`
		);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		const vehicleDetails = data.results;
		for (const t of vehicleDetails.trips) t.key = t.date + t.trip_id;
		const dateGroups = Object.groupBy(vehicleDetails.trips, ({ date }) => date);
		vehicleDetails.trips = [];
		const tripEntries = Object.entries(dateGroups).sort((a, b) => b[0] - a[0]);
		for (const [day, trips] of tripEntries) {
			vehicleDetails.trips.push({
				dateHeader: `${shortYear(day)} (${trips.length} trips)`,
				key: day
			});
			vehicleDetails.trips.push(...trips);
		}
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
