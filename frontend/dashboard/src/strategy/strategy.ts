import {SessionStatus} from "@/types/sessionStatus";

export interface strategy {
  execute(current: number, target: number): SessionStatus;
}