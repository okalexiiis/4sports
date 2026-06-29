export type MemberType = {
  id: number;
  slug: string;
  name: string;
  lastname: string;
  role: "owner" | "admin" | "viewer" | "organizer";
  email: string;
  phone: string;
  status: "active" | "inactive";
};
