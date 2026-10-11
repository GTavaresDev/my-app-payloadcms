import type { Access, FieldAccess, User } from "payload";

export const companyID = (user: User | null | undefined) =>
  typeof user?.company === "object" ? user.company?.id : user?.company;
export const isSuperAdmin = (user: User | null | undefined) =>
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
