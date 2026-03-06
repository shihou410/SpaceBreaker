import { ecsclass } from "db://assets/pkg-export/@gamex/cc-ecs";
import { EcsComponent } from "db://pkg/@gamex/cc-ecs";

@ecsclass("DestroyComp")
export default class DestroyComp extends EcsComponent {
    public static allowRecycling: boolean = true;


}


