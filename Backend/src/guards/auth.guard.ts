import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            // return false; //Forbidden 403
            throw new UnauthorizedException("Invalid token");
        }

        try {
            const payload = this.jwtService.verify(token);
            request.userId = payload.userId;
        } catch(e) {
            Logger.error(e.message);
            throw new UnauthorizedException("Invalid token");
        }
        return true;

        
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        // Bearer fdlakjf;lajf;ljsafk -> split to get the token after the word "Bearer"
        return request.headers['authorization']?.split(' ')[1];
    }
}