import { Authority } from "../domain/authority.entity";

export interface Payload {
  id: string;
  username: string;
  authorities?: Authority[];
}
