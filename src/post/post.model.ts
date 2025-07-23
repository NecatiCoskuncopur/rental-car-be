import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type PostDocument = Post &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

function isValidURL(url: string): boolean {
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  return urlRegex.test(url);
}

@Schema({ timestamps: true })
export class Post {
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) =>
        /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ\s.,!?;:()'"-]+$/.test(value),
      message:
        'Title can only contain letters, numbers, punctuation, and spaces',
    },
  })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    validate: {
      validator: isValidURL,
      message:
        'Image must be a valid URL ending with .png, .jpg, .jpeg, .gif, or .webp',
    },
  })
  image: string;

  @Prop({ required: true, unique: true })
  slug: string;
}

const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(mongoosePaginate);

export { PostSchema };
