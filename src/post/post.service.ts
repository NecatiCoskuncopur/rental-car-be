import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument } from './post.model';
import { PaginateModel } from 'mongoose';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { CreatePostDto } from 'src/common/dto/create-post.dto';

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

  //UpdatePost after image upload implementation

  async deletePost(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // After image

    await this.postModel.findByIdAndDelete(id);
    return { message: 'The post has been deleted' };
  }
}
