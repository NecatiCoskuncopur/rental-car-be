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
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreatePostDto } from 'src/common/dto/create-post.dto';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { UpdatePostDto } from 'src/common/dto/update-post.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PostService } from './post.service';

@ApiExtraModels(PaginateQueryDto)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiRoles('guest')
  @Get('getPosts')
  getAllPosts(@Query() query: PaginateQueryDto) {
    return this.postService.getPosts(query);
  }

  @ApiRoles('guest')
  @Get('getPost/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.postService.getPostBySlug(slug);
  }

  @ApiRoles('guest')
  @Get('getSlugs')
  async getSlugs(): Promise<string[]> {
    return this.postService.getSlugs();
  }

  @ApiRoles('guest')
  @Get('getAdjacentPosts/:slug')
  async getAdjacentPosts(@Param('slug') slug: string) {
    return this.postService.getAdjacentPosts(slug);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Post('createPost')
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updatePost/:postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deletePost/:postId')
  async deletePost(@Param('postId') postId: string) {
    return this.postService.deletePost(postId);
  }
}
