import { EcsSystem, filter, NodeComponent, Filter } from "db://pkg/@gamex/cc-ecs";
import PlayerComp from "../component/PlayerComp";
import { v3 } from "cc";

export default class PlayerSystem extends EcsSystem {

    playerFilter: Filter = filter.all(PlayerComp, NodeComponent);

    protected execute(dt?: number, ...args: any[]): void {

        this.world.query(this.playerFilter).forEach(entity => {
            const playerComp = entity.get(PlayerComp);
            const nodeComp = entity.get(NodeComponent);
            const res = v3(nodeComp.x, nodeComp.y, 0).lerp(playerComp.target, 1);
            nodeComp.x = res.x;
            nodeComp.y = res.y;
        });

    }


}

