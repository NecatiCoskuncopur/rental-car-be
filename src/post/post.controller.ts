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

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreatePostDto } from 'src/common/dto/request/create-post.dto';
import { PaginateQueryDto } from 'src/common/dto/request/paginate-query.dto';
import { UpdatePostDto } from 'src/common/dto/request/update-post.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { PostResponseDto } from 'src/common/dto/response/post-response.dto';
import { PostsResponseDto } from 'src/common/dto/response/posts-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiRoles('guest')
  @Get('getPosts')
  getAllPosts(@Query() query: PaginateQueryDto): Promise<PostsResponseDto> {
    return this.postService.getPosts(query);
  }

  @ApiRoles('guest')
  @Get('getPost/:slug')
  async getPostBySlug(@Param('slug') slug: string): Promise<PostResponseDto> {
    return this.postService.getPostBySlug(slug);
  }

  @ApiRoles('guest')
  @Get('getSlugs')
  async getSlugs(): Promise<string[]> {
    return this.postService.getSlugs();
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Post('createPost')
  async createPost(@Body() body: CreatePostDto): Promise<PostResponseDto> {
    return this.postService.createPost(body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updatePost/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(postId, body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deletePost/:postId')
  async deletePost(
    @Param('postId') postId: string,
  ): Promise<DeleteResponseDto> {
    return this.postService.deletePost(postId);
  }
}
