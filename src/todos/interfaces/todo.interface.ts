export interface Todo {
  id: string;
  description: string;
  isComplete: boolean;
  assignedTo: string;
  rewardsForCompletion: string[];
}
