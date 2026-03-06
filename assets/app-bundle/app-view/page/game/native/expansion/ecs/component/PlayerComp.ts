import { ecsclass } from "db://assets/pkg-export/@gamex/cc-ecs";
import { EcsComponent } from "db://pkg/@gamex/cc-ecs";
import { Vec3 } from "cc";

@ecsclass("PlayerComp")
export default class PlayerComp extends EcsComponent {
    public static allowRecycling: boolean = true;


    target: Vec3 = null;
    protected onAdd(): void {
        this.target = new Vec3();
    }

    protected onRemove(): void {
        this.target = null;
    }

    bulletCount: number = 0;

}


