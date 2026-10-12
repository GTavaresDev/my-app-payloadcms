import { relationshipID } from '../utilities/relationship-id'
import type { Access, FieldAccess } from "payload";
import type { User } from "../payload-types";

export type UserLike =
  | User
  | {
      id?: number | string;
      company?: (number | null) | { id?: number | string; slug?: string } | null;
      roles?: ('super-admin' | 'company-admin' | 'user' | string)[] | null;
    }
  | null
  | undefined;

export const companyID = (user: UserLike) =>
  relationshipID(user?.company);
export const isSuperAdmin = (user: UserLike) =>
  Boolean(user?.roles?.includes("super-admin"));
export const superAdmin: Access = ({ req }) => isSuperAdmin(req.user);
export const superAdminField: FieldAccess = ({ req }) => isSuperAdmin(req.user);
export const tenantRead: Access = ({ req }) => {
  if (!req.user || isSuperAdmin(req.user)) return true;
  const id = companyID(req.user);
  return id ? { company: { equals: id } } : false;
};
export const tenantUpdate: Access = ({ req }) => {
  if (!req.user) return false;
  return tenantRead({ req });
};
