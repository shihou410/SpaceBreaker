import { Animation } from "cc";
import { EcsComponent, ecsclass } from "db://pkg/@gamex/cc-ecs";


@ecsclass("AnimaComp")
export default class AnimaComp extends EcsComponent {
    public static allowRecycling: boolean = true;

    private anima: Animation = null;

    protected onAdd(): void {
        this._state = "";
        this.anima = this.entity.node.getComponent(Animation);
        this.anima.on(Animation.EventType.FINISHED, () => { this._state = "" }, this);
    }

    protected onRemove(): void {
        this.anima = null;
    }


    private _state: string = "";
    public get state(): string { return this._state; }
    public set state(v: string) {
        if (this._state === v) return;
        this._state = v;
        this.anima.play(this._state);
    }

}


