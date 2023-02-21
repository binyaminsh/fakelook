export interface UpdatePostDto {
  content?: string;
  like?: string;
  tags?: { hashTags: string[]; userTags: string[] };
  comment?: {
    userId: string;
    content: string;
    likes: string[];
    tags: { hashTags: string[]; userTags: string[] };
  };
}
