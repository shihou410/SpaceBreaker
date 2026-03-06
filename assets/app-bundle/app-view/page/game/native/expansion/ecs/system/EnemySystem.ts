import { EcsSystem, Filter, filter, NodeComponent } from "db://pkg/@gamex/cc-ecs";
import EnemyComp from "../component/EnemyComp";
import DestroyComp from "../component/DestroyComp";

export default class EnemySystem extends EcsSystem {

    enemyFilter: Filter = filter.all(EnemyComp, NodeComponent).exclude(DestroyComp);

    protected execute(dt?: number, ...args: any[]): void {

        this.world.query(this.enemyFilter).forEach(entity => {
            if (entity.get(EnemyComp).hp <= 0) {
                entity.add(DestroyComp);
            }
        });

    }

}


