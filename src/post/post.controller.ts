import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { CreatePostDto } from 'src/common/dto/create-post.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

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

  @UseGuards(AuthGuard, AdminGuard)
  @Post('createPost')
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deletePost/:id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
