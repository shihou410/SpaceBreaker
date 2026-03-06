import { ecsclass } from "db://assets/pkg-export/@gamex/cc-ecs";
import { EcsComponent } from "db://pkg/@gamex/cc-ecs";

@ecsclass("ShootComp")
export default class ShootComp extends EcsComponent {
    public static allowRecycling: boolean = true;


    /** 射击间隔 */
    public shootInterval: number = 3;

    public shootPassTime: number = 0;

    protected onAdd(): void {
        this.shootInterval = 3;
        this.shootPassTime = 0;
    }


}


