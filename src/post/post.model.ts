import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({
    required: true,
    unique: true,
  })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, unique: true })
  slug: string;
}

const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(mongoosePaginate);

export { PostSchema };
