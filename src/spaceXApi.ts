const BASE_URL = "https://api.spacexdata.com/";

const apiOperation = {
    nextLaunch: "v5/launches/next",
    pastLaunches: "v5/launches/past",
    payload: (payloadId: string) => `v4/payloads/${payloadId}`,
    launchpad: (launchpadId: string) => `v4/launchpads/${launchpadId}`,
};

export const fetchNextLaunch = async () => {
    try {
        const response = await fetch(BASE_URL + apiOperation.nextLaunch);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch next launch:", error);
        return null;
    }
};

export const fetchLaunchPad = async (launchpadId: string) => {
    try {
        const response = await fetch(BASE_URL + apiOperation.launchpad(launchpadId));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            id: data.id,
            name: data.name,
        } as LaunchPad;
    } catch (error) {
        console.error(`Failed to fetch launchpad ${launchpadId}:`, error);
        return null;
    }
};

export const fetchPayload = async (payloadId: string) => {
    try {
        const response = await fetch(BASE_URL + apiOperation.payload(payloadId));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            id: data.id,
            name: data.name,
            customers: data.customers,
        } as Payload;
    } catch (error) {
        console.error(`Failed to fetch payload ${payloadId}:`, error);
        return null;
    }
};

export const fetchLaunches = async (): Promise<Launch[]> => {
    try {
        const response = await fetch(BASE_URL + apiOperation.pastLaunches);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const launchesData = await response.json();

        return await Promise.all(
            launchesData.map(async (launch: any) => {
                try {
                    const launchPad = await fetchLaunchPad(launch.launchpad).catch(() => null);

                    const payloads = await Promise.all(
                        (launch.payloads as string[]).map((payloadId) =>
                            fetchPayload(payloadId).catch(() => null)
                        )
                    );

                    return {
                        name: launch.name,
                        details: launch.details,
                        date_utc: launch.date_utc,
                        youtube_id: launch.links.youtube_id,
                        wikipedia: launch.links.wikipedia,
                        image: launch.links.patch.small,
                        failures: launch.failures,
                        payloads,
                        launchPad,
                    } as Launch;
                } catch {
                    return {
                        name: launch.name,
                        details: null,
                        date_utc: launch.date_utc,
                        youtube_id: null,
                        wikipedia: null,
                        image: null,
                        failures: [],
                        payloads: [],
                        launchPad: null,
                    } as Launch;
                }
            })
        );
    } catch (error) {
        console.error("Failed to fetch launches:", error);
        return [];
    }
};



