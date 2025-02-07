import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        //UserModel, RefreshTokenModel -> 소문자 사용 
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
        private jwtService: JwtService,
    ) {}
    async signup(signupData: SignupDto) {
        const { email, name, password } = signupData;
        //Check if email is in use
        const emailInUse = await this.UserModel.findOne({
            email: signupData.email,
        });
        if (emailInUse) {
            throw new BadRequestException('Email already in use');
        }
        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10); //create different hash for same password
        //Create user document and save in mongoDB

        await this.UserModel.create({
            name, 
            email, 
            password: hashedPassword,
        })
    }

    async login(credentials: LoginDto){
        const { email, password } = credentials;

        //Find if user exists by email
        const user = await this.UserModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //Compare entered password with existing password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //Generate JWT Tokens
        const tokens = await this.generateUserTokens(user._id);
        return {
            ...tokens,
            userId: user._id,
            username: user.name,
        };
    }

    async refreshTokens(refreshToken: string) {
        //Find refresh token in DB
        const token = await this.RefreshTokenModel.findOne({
            token: refreshToken,
            expiryDate: { $gte: new Date() },
        })

        //Check if refresh token expired
        if (!token) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        return this.generateUserTokens(token.userId);
        
    }


    async generateUserTokens(userId:any) {
        const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
        const refreshToken = uuidv4();
        
        await this.storeRefreshToken(refreshToken, userId);
        return {
            accessToken,
            refreshToken,
        }

    }

    async storeRefreshToken(token:string, userId:any) {
        //calc expiry date 3 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3);

        await this.RefreshTokenModel.updateOne(
            {userId}, 
            {$set: { expiryDate, token}}, 
            {upsert: true}
        );
    }
}
