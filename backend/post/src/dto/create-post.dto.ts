export interface CreatePostDto {
    userId: string;
    text?: string;
    location: { longitude: string, latitude: string };
    photoUrl: string;
    tags?: { hashTags: string[],userTags: string[] };
}