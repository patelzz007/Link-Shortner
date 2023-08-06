import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../enums/role.enum";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    console.log(
      "Testing this to see true or false",
      roles.some((role) => role === userRole),
    );
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    console.log("What are the roles: ", roles);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // console.log("What is this request: ", request);
    const user = request.user;
    console.log("What is this user: ", user);
    return this.matchRoles(roles, user.role);
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
  //   const request = context.switchToHttp().getRequest();

  //   const authorization = request.headers;
  //   console.log("Authorization", authorization);

  //   if (!requiredRoles) {
  //     return true;
  //   }
  //   const { user } = context.switchToHttp().getRequest();
  //   console.log("User at roles guard :", user);
  //   return requiredRoles.some((role) => user.roles?.includes(role));
  // }
}
