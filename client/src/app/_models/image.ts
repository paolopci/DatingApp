// photo.ts (separato se ti serve tenerlo)
export interface Image {
    id: number | string;
    url: string;
    isMain?: boolean;
}