import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto, UpdateAdminDto, LoginAdminDto } from './dtos/admin.dto';
import { User } from '../auth/schemas/user.schema';
import { Post } from '../post/schemas/post.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.adminModel.findOne({ email: createAdminDto.email });
    if (existingAdmin) {
      throw new UnauthorizedException('Admin with this email already exists');
    }
    
    const newAdmin = new this.adminModel(createAdminDto);
    const savedAdmin = await newAdmin.save();
    
    return {
      id: savedAdmin._id,
      email: savedAdmin.email,
      username: savedAdmin.username
    };
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const { email, password } = loginAdminDto;
    
    console.log('Attempting login for email:', email);
    const admin = await this.adminModel.findOne({ email });
    
    if (!admin) {
      console.log('No admin found with email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for admin:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin._id, email: admin.email, isAdmin: true };
    const access_token = this.jwtService.sign(payload);
    
    console.log('Login successful for admin:', email);
    return {
      access_token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username
      }
    };
  }

  async getAdminProfile(adminId: string) {
    const admin = await this.adminModel.findById(adminId).select('-password');
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async updateAdminProfile(updateAdminDto: UpdateAdminDto) {
    const { adminId, ...updateData } = updateAdminDto;
    const admin = await this.adminModel.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  async getAllPosts() {
    return this.postModel.find().populate('userId', 'username email');
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If points were updated, update the ranking
    if (userData.totalPoints !== undefined) {
      await this.userModel.findByIdAndUpdate(userId, {
        ranking: this.determineRanking(userData.totalPoints)
      });
    }

    return user;
  }

  private determineRanking(points: number): string {
    if (points >= 5000001) return 'Absolute God';
    if (points >= 4000000) return 'Guardian God';
    if (points >= 3000000) return 'Space God';
    if (points >= 2000000) return 'Sun God';
    if (points >= 1000000) return 'Moon God';
    if (points >= 600001) return 'Fire God';
    if (points >= 400000) return 'Wind God';
    if (points >= 200000) return 'Plant God';
    if (points >= 100001) return 'Superhuman';
    if (points >= 90000) return 'Supreme';
    if (points >= 75000) return 'Hero';
    if (points >= 50000) return 'Advanced';
    if (points >= 10000) return 'Intermediate';
    if (points >= 5000) return 'Novice';
    if (points >= 1501) return 'Civilian';
    return 'Beginner';
  }

  async updatePost(postId: string, postData: Partial<Post>) {
    const post = await this.postModel.findByIdAndUpdate(
      postId,
      { $set: postData },
      { new: true }
    ).populate('userId', 'username email');

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async deletePost(postId: string) {
    const post = await this.postModel.findByIdAndDelete(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return { message: 'Post deleted successfully' };
  }

  async getUserGrowthData(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // For now, generate mock historical data for the last 7 days
    const today = new Date();
    const mockData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate some random variations around the current counts
      const randomVariation = () => Math.floor(Math.random() * 5);
      const followers = Math.max(0, user.followerCount - randomVariation() * (i + 1));
      const following = Math.max(0, user.followingCount - randomVariation() * (i + 1));
      
      mockData.push({
        date: date.toISOString(),
        followers,
        following
      });
    }

    // Add current data
    mockData.push({
      date: today.toISOString(),
      followers: user.followerCount,
      following: user.followingCount
    });

    return mockData;
  }
}