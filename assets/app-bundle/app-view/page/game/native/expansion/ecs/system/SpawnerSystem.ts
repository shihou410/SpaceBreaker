import { EcsWorld } from "db://assets/pkg-export/@gamex/cc-ecs";
import { EcsSystem } from "db://pkg/@gamex/cc-ecs";
import { GameSingleton } from "../singleton/GameSingleton";
import { app } from "db://assets/app/app";

export default class SpawnerSystem extends EcsSystem {

    private passTime: number = 0;





    protected execute(dt?: number, ...args: any[]): void {

        this.passTime += dt;
        if (this.passTime > EcsWorld.inst.getSingleton(GameSingleton).spawnInvertal) {
            this.passTime = 0;
            app.controller.game.spawn();
        }


    }






}


