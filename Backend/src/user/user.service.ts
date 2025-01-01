import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}


  async getUserById(id: string): Promise<{ name: string }> {
    const user = await this.userModel.findById(id).select('name').exec();
  
    if (!user) {
      throw new Error('User not found');
    }
    return { name: user.name };
  }
  
}
