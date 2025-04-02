import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Invalid token');
        }

        try {
            const payload = this.jwtService.verify(token);
            // Check if the user is an admin
            if (!payload.isAdmin) {
                throw new UnauthorizedException('Unauthorized: Admin access required');
            }
            request.userId = payload.sub;
            request.isAdmin = payload.isAdmin;
        } catch (e) {
            throw new UnauthorizedException('Invalid token or insufficient permissions');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}