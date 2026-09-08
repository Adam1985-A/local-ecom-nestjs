import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Roles } from '../common/decorator/roles.decorator.js';
import { Public } from '../common/decorator/public.decorator.js';
import { UserRole } from '../common/enums/user.role.enum.js';
import { BusinessType } from '../common/enums/business-type.enum.js';

@ApiTags('Categories') 
@ApiBearerAuth() 
@Controller('categories')

export class CategoriesController {
constructor(private readonly categoriesService: CategoriesService) {}

  @Public() 
  @Get() 
  findAll(@Query('businessType') bt?: BusinessType) {
     return this.categoriesService.findAll(bt); 
    }


  @Public() 
  @Get(':id') 
  findOne(@Param('id', ParseUUIDPipe) id: string) {
     return this.categoriesService.findById(id);
     }


  @Post()
   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    create(@Body() dto: CreateCategoryDto) {
       return this.categoriesService.create(dto);
       }

  @Patch(':id')
   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
   update(@Param('id', ParseUUIDPipe) id: string, 
   @Body() dto: UpdateCategoryDto) { 
    return this.categoriesService.update(id, dto); 
  }


  @Delete(':id')
   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) 
   remove(@Param('id', ParseUUIDPipe) id: string) {
     return this.categoriesService.remove(id); 
    }
}
