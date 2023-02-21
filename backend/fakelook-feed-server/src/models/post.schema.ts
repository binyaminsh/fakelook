import { Schema, model, Types } from "mongoose";
export interface IPost {
  userId: string;
  content?: string;
  location: { lng: string; lat: string };
  photoUrl: string;
  likes?: Types.Array<string>;
  tags?: { hashTags: string[]; userTags: string[] };
  comments?: {
    userId: string;
    content: string;
    likes: string[];
    tags: { hashTags: string[]; userTags: string[] };
  }[];
}
const postSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    location: {
      lng: {
        type: String,
        required: true,
      },
      lat: {
        type: String,
        required: true,
      },
    },
    photoUrl: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      required: false,
    },
    tags: {
      userTags: [String],
      hashTags: [String],
    },
    comments: {
      type: [
        {
          userId: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          likes: {
            type: [String],
            required: false,
          },
          tags: {
            userTags: [String],
            hashTags: [String],
          },
        },
      ],
    },
  },
  { versionKey: false, timestamps: true }
);

export const Post = model<IPost>("Post", postSchema);
