import {strategy} from "@/strategy/strategy";
import{SessionStatus} from "@/types/sessionStatus";

export class stateMate implements strategy {

    execute(currentTemperature: number, targetTemperature: number): SessionStatus {

        if(currentTemperature < targetTemperature - 10){
            return SessionStatus.CALENTANDO;
        } else if (currentTemperature < targetTemperature) {
            return SessionStatus.CASI_LISTO;
        } else {
            return SessionStatus.LISTO;
        }

    }

}