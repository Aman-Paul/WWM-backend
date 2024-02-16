// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";

// import { ENV_KEYS } from "../../config/appConstants.json";
// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "src/prisma/prisma.service";

// @Injectable()
// export class JwtStrategy extends  PassportStrategy(Strategy, 'jwt') {
//     constructor( config: ConfigService, private prisma: PrismaService ){
//         super({
//             jwtFromRequest: ExtractJwt.fromHeader("token"),
//             secretOrKey: config.get(ENV_KEYS.JWT_SECRET_KEY)
//         })
//     }

//     async validate(
//         payload: {
//             sub: number;
//             email: string;
//         }) {

//         const user = await this.prisma.user.findUnique({
//             where: {
//                 id: payload.sub
//             }
//         });

//         return user;
//     }
// }