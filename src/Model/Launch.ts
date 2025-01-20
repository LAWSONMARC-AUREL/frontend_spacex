interface Launch {
    name: string;
    details: string;
    date_utc: string;
    youtube_id: string;
    wikipedia: string,
    image : string;
    payloads: Payload[];
    launchPad: LaunchPad;
    failures: any[];
}
