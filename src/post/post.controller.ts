import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreatePostDto } from 'src/common/dto/create-post.dto';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { UpdatePostDto } from 'src/common/dto/update-post.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('getPosts')
  getAllPosts(@Query() query: PaginateQueryDto) {
    return this.postService.getPosts(query);
  }

  @Get('getPost/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.postService.getPostBySlug(slug);
  }

  @Get('getSlugs')
  async getSlugs(): Promise<string[]> {
    return this.postService.getSlugs();
  }

  @Get('getAdjacentPosts/:slug')
  async getAdjacentPosts(@Param('slug') slug: string) {
    return this.postService.getAdjacentPosts(slug);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('createPost')
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updatePost/:id')
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postService.updatePost(id, body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deletePost/:id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
