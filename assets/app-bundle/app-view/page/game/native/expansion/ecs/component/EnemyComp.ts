import { Label } from "cc";
import { Animation, Node } from "cc";
import { EcsComponent, ecsclass } from "db://pkg/@gamex/cc-ecs";


@ecsclass("EnemyComp")
export default class EnemyComp extends EcsComponent {
    public static allowRecycling: boolean = true;

    private content: Node = null;

    protected onAdd(): void {
        this.content = this.entity.node.getChildByName('content');
    }


    private _hp: number = 0;
    public get hp(): number { return this._hp; }
    public set hp(v: number) {
        this._hp = v;
        this.content.getChildByName('hp').getComponent(Label).string = v.toString();
    }

}


