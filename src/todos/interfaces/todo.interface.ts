import { User } from "src/users/interfaces/user.interface";

export interface Todo {
  id: string;
  description: string;
  isComplete: boolean;
  assignedTo?: User;
}
