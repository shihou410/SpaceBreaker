import { EcsSystem, filter, NodeComponent, Filter } from "db://pkg/@gamex/cc-ecs";
import PlayerComp from "../component/PlayerComp";
import ShootComp from "../component/ShootComp";
import { app } from "db://assets/app/app";
import { GameEntity } from "../entity/GameEntity";

export default class ShootSystem extends EcsSystem {

    playerFilter: Filter = filter.all(ShootComp, NodeComponent);

    protected execute(dt?: number, ...args: any[]): void {

        this.world.query(this.playerFilter).forEach(entity => {

            const shootComp = entity.get(ShootComp);
            shootComp.shootPassTime += dt;
            if (shootComp.shootPassTime >= shootComp.shootInterval) {
                app.controller.game.shoot(entity as GameEntity);
                shootComp.shootPassTime = 0;
            }
        });

    }


}

