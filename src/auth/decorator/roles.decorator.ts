import { SetMetadata } from "@nestjs/common";
import { Role } from "../../enums/role.enum";

export const ROLES_KEY = "roles";

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

console.log("ROLES_KEY", ROLES_KEY);
console.log("Roles", Roles);