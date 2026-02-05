export interface Recycler {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    types: string[];
    contact: string;
    status: 'Open' | 'Closed';
}

const RECYCLER_NAMES = [
    "EcoGreen E-Waste Solutions",
    "Urban Recover Center",
    "TechCycle Hub",
    "Sustainable Electronics Processors",
    "Green Earth Recyclers",
    "City Scrappers & Refiners",
    "Circuit Reclaim Works",
    "Future Waste Management",
];

const WASTE_TYPES = ["Mobile", "Laptop", "Batteries", "Cables", "Monitors", "Printers", "PCBs"];

export function generateMockRecyclers(center: { lat: number; lng: number }, count: number = 5): Recycler[] {
    return Array.from({ length: count }).map((_, i) => {
        // Random offset within ~2-5km
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;

        const types = Array.from({ length: Math.floor(Math.random() * 3) + 2 })
            .map(() => WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)])
            .filter((v, i, a) => a.indexOf(v) === i); // Unique

        return {
            id: `recycler-${i}-${Date.now()}`,
            name: RECYCLER_NAMES[Math.floor(Math.random() * RECYCLER_NAMES.length)],
            location: {
                lat: center.lat + latOffset,
                lng: center.lng + lngOffset,
                address: `${Math.floor(Math.random() * 100) + 1}, Ind. Area ${String.fromCharCode(65 + i)}`,
            },
            types: types,
            contact: `+91 98${Math.floor(Math.random() * 100000000)}`,
            status: Math.random() > 0.2 ? 'Open' : 'Closed',
        };
    });
}

// Admin Map specific bin interface
export interface AdminBin {
    _id: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    type: string[];
    fillLevel: number;
    batteryLevel?: number;
    sensorStatus?: 'ok' | 'malfunction';
    status: 'active' | 'full' | 'maintenance' | 'offline';
    lastCollection?: string;
}

export function generateAdminMockBins(center: { lat: number; lng: number }, count: number = 8): AdminBin[] {
    return Array.from({ length: count }).map((_, i) => {
        const latOffset = (Math.random() - 0.5) * 0.03; // ~3km radius
        const lngOffset = (Math.random() - 0.5) * 0.03;

        const statuses: AdminBin['status'][] = ['active', 'full', 'maintenance', 'offline', 'active', 'active'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        let fillLevel = Math.floor(Math.random() * 60);
        if (status === 'full') fillLevel = 90 + Math.floor(Math.random() * 10);
        if (status === 'active') fillLevel = Math.floor(Math.random() * 50);

        return {
            _id: `mock-admin-bin-${i}-${Date.now()}`,
            location: {
                lat: center.lat + latOffset,
                lng: center.lng + lngOffset,
                address: `Sector ${Math.floor(Math.random() * 20) + 1}, Cross ${Math.floor(Math.random() * 10)}`,
            },
            type: ["General", "Plastic", "E-Waste"].slice(0, Math.floor(Math.random() * 2) + 1),
            fillLevel: fillLevel,
            batteryLevel: Math.floor(Math.random() * 100),
            sensorStatus: status === 'offline' ? 'malfunction' : 'ok',
            status: status,
            lastCollection: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),
        };
    });
}
