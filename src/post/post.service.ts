import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { PaginateModel } from 'mongoose';

import { CreatePostDto } from 'src/common/dto/request/create-post.dto';
import { PaginateQueryDto } from 'src/common/dto/request/paginate-query.dto';
import { UpdatePostDto } from 'src/common/dto/request/update-post.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { PostResponseDto } from 'src/common/dto/response/post-response.dto';
import { PostsResponseDto } from 'src/common/dto/response/posts-response.dto';
import { pickAllowedKeys } from 'src/common/utils/pickAllowedKeys.util';
import { PostDocument } from './post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: PaginateModel<PostDocument>,
  ) {}

  async getPosts(query: PaginateQueryDto): Promise<PostsResponseDto> {
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

    const result = await this.postModel.paginate(queryConditions, options);

    const postsDto = plainToInstance(PostsResponseDto, {
      posts: result.posts,
      pagination: {
        perPage: result.perPage,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        pageStartIndex: result.pageStartIndex,
        hasPrev: result.hasPrev,
        hasNext: result.hasNext,
        prev: result.prev,
        next: result.next,
      },
      totalPosts: result.totalPosts,
    });

    return postsDto;
  }

  async getPostBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postModel.findOne({ slug }).lean();

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return plainToInstance(PostResponseDto, post);
  }

  async getSlugs(): Promise<string[]> {
    const posts = await this.postModel.find({}, 'slug').exec();
    return posts.map((post) => post.slug);
  }

  async createPost(body: CreatePostDto): Promise<PostResponseDto> {
    const slug = body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new this.postModel({ ...body, slug });
    const post = await newPost.save();

    return plainToInstance(PostResponseDto, post);
  }

  async updatePost(
    postId: string,
    data: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const allowedUpdates = ['title', 'content', 'image'];
    const updates = pickAllowedKeys(data, allowedUpdates);

    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    //After image
    // if (data.image && data.image !== post.image) {
    //   await deleteImageFromStorage(post.image);
    // }

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
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return plainToInstance(PostResponseDto, updatedPost);
  }

  async deletePost(id: string): Promise<DeleteResponseDto> {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) throw new NotFoundException('Post not found');

    //after image
    // if (post.image) {
    //   await deleteImageFromStorage(post.image);
    // }

    return { message: 'The post has been deleted' };
  }
}
