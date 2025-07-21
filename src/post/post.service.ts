import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument } from './post.model';
import { PaginateModel } from 'mongoose';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { CreatePostDto } from 'src/common/dto/create-post.dto';
import { deleteImageFromStorage } from 'src/common/utils/deketeImageFromStorage';
import { UpdatePostDto } from 'src/common/dto/update-post.dto';
import { pickAllowedKeys } from 'src/common/utils/object.util';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: PaginateModel<PostDocument>,
  ) {}

  getPosts(query: PaginateQueryDto) {
    const { page = 1, limit = 10, order = 'desc' } = query;

    const queryConditions = {};

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: order === 'asc' ? 1 : -1 },
      lean: true,
      customLabels: {
        totalDocs: 'totalPosts',
        docs: 'posts',
        limit: 'perPage',
        page: 'currentPage',
        totalPages: 'totalPages',
        nextPage: 'next',
        prevPage: 'prev',
        pagingCounter: 'pageStartIndex',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
      },
    };

    return this.postModel.paginate(queryConditions, options);
  }

  async getPostBySlug(slug: string) {
    const post = await this.postModel.findOne({ slug }).lean();

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  async createPost(body: CreatePostDto) {
    const slug = body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new this.postModel({ ...body, slug });
    return newPost.save();
  }

  async updatePost(postId: string, data: UpdatePostDto) {
    const allowedUpdates = ['title', 'content', 'image'];
    const updates = pickAllowedKeys(data, allowedUpdates);

    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (data.image && data.image !== post.image) {
      await deleteImageFromStorage(post.image);
    }

    if (!data.image) {
      delete updates.image;
    }

    if (typeof updates.title === 'string') {
      updates.slug = updates.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');
    }
    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        postId,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .lean();

    return updatedPost;
  }

  async deletePost(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.image) {
      await deleteImageFromStorage(post.image);
    }

    await this.postModel.findByIdAndDelete(id);
    return { message: 'The post has been deleted' };
  }
}
