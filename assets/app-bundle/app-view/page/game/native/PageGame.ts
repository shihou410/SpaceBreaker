import { _decorator, EventTouch, instantiate, Node, Prefab, UITransform, v3, view } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';
import { GameController } from '../../../../../app-builtin/app-controller/GameController';
import { EcsWorld } from 'db://pkg/@gamex/cc-ecs';
import { NodePool } from 'cc';
import { GameEntity } from './expansion/ecs/entity/GameEntity';
import { MoveComponent, MoveSystem, NodeComponent } from 'db://assets/pkg-export/@gamex/cc-ecs';
import PlayerComp from './expansion/ecs/component/PlayerComp';
import { NodeEventType } from 'cc';
import { InputSingleton } from './expansion/ecs/singleton/InputSingleton';
import PlayerSystem from './expansion/ecs/system/PlayerSystem';
import AnimaComp from './expansion/ecs/component/AnimaComp';
import ShootComp from './expansion/ecs/component/ShootComp';
import ShootSystem from './expansion/ecs/system/ShootSystem';
import SpawnerSystem from './expansion/ecs/system/SpawnerSystem';
import { GameSingleton } from './expansion/ecs/singleton/GameSingleton';



const EnemyPx: number[] = [-270, -135, 0, 135, 270];

const { ccclass, property } = _decorator;
@ccclass('PageGame')
export class PageGame extends BaseView.BindController(GameController) {

    @property({ tooltip: "boss", type: Prefab })
    prefab_boss: Prefab = null;
    @property({ tooltip: "玩家子弹", type: Prefab })
    prefab_pbullet: Prefab = null;
    @property({ tooltip: "敌人子弹", type: Prefab })
    prefab_eBbullet: Prefab = null;
    @property({ tooltip: "敌人", type: Prefab })
    prefab_enemy: Prefab = null;
    @property({ tooltip: "道具", type: Prefab })
    prefab_prop: Prefab = null;
    @property({ tooltip: "玩家", type: Prefab })
    prefab_player: Prefab = null;


    protected miniViews: IMiniViewNames = ['PaperGameIndex'];

    private content: Node = null;
    private layer_bg: Node = null;
    private layer_bullet: Node = null;
    private layer_ins: Node = null;
    private layer_boss: Node = null;
    private layer_effect: Node = null;

    private pool_boss: NodePool = null;
    private pool_pbullet: NodePool = null;
    private pool_ebullet: NodePool = null;
    private pool_prop: NodePool = null;
    private pool_enemy: NodePool = null;


    onLoad() {
        this.content = this.node.getChildByName('content');
        this.layer_bg = this.content.getChildByName('layer_bg');
        this.layer_bullet = this.content.getChildByName('layer_bullet');
        this.layer_ins = this.content.getChildByName('layer_ins');
        this.layer_boss = this.content.getChildByName('layer_boss');
        this.layer_effect = this.content.getChildByName('layer_effect');

        this.pool_boss = new NodePool();
        this.pool_pbullet = new NodePool();
        this.pool_ebullet = new NodePool();
        this.pool_prop = new NodePool();
        this.pool_enemy = new NodePool();

        this.controller.on('Shoot', this.onShoot, this);
        this.controller.on('Spawn', this.onSpawn, this);
    }

    onShow(params: any) {
        this.showMiniViews({
            views: this.miniViews
        });

        this.initGame();
    }

    onHide(result: undefined) {
        return result;
    }

    private initGame() {

        EcsWorld.inst.addSingleton(GameSingleton);

        EcsWorld.inst.addSystem(PlayerSystem);
        EcsWorld.inst.addSystem(ShootSystem);
        EcsWorld.inst.addSystem(MoveSystem);
        EcsWorld.inst.addSystem(SpawnerSystem);




        this.initNodePool(15);
        this.initPlayer();
    }

    private initNodePool(count: number) {
        for (let i = 0; i < count; i++) {
            const node = instantiate(this.prefab_boss);
            this.pool_boss.put(node);
        }
        for (let i = 0; i < count; i++) {
            const node = instantiate(this.prefab_pbullet);
            this.pool_pbullet.put(node);
        }
        for (let i = 0; i < count; i++) {
            const node = instantiate(this.prefab_eBbullet);
            this.pool_ebullet.put(node);
        }
        for (let i = 0; i < count; i++) {
            const node = instantiate(this.prefab_prop);
            this.pool_prop.put(node);
        }
        for (let i = 0; i < count; i++) {
            const node = instantiate(this.prefab_enemy);
            this.pool_enemy.put(node);
        }

    }


    protected update(dt: number): void {
        EcsWorld.inst.execute(dt);
    }

    private initPlayer() {

        const node = instantiate(this.prefab_player);
        this.layer_ins.addChild(node);

        node.setPosition(0, -320);

        const entity = EcsWorld.inst.createEntity(GameEntity, node);
        const playComp = entity.add(PlayerComp);
        const nodeComp = entity.add(NodeComponent);
        const animaComp = entity.add(AnimaComp);



        nodeComp.setPosition(node.x, node.y);
        playComp.target.set(node.x, node.y);

        const endFun: Function = (e: EventTouch) => {
            const shootComp = entity.get(ShootComp);
            entity.remove(shootComp);
            animaComp.state = "idle";
        };

        node.on(NodeEventType.TOUCH_START, (e: EventTouch) => {
            animaComp.state = "move";
            const shootComp = entity.add(ShootComp);
            shootComp.shootInterval = 0.12;
        }, this);
        node.on(NodeEventType.TOUCH_MOVE, (e: EventTouch) => {
            const lp = e.getUILocation();
            playComp.target = this.layer_ins.getComponent(UITransform).convertToNodeSpaceAR(v3(lp.x, lp.y, 1));
        }, this);
        node.on(NodeEventType.TOUCH_END, endFun, this);
        node.on(NodeEventType.TOUCH_CANCEL, endFun, this);
    }


    private onShoot(entity: GameEntity) {

        const playerComp = entity.get(PlayerComp);
        const nodeComp = entity.get(NodeComponent);

        if (playerComp) {
            playerComp.bulletCount++;
            const x = Math.round(Math.sin(playerComp.bulletCount * Math.PI / 3)) * 30 + nodeComp.x;
            this.createBullet(x, nodeComp.y, 90, 1200);
        }
    }


    private createBullet(x: number, y: number, angle: number, speed: number) {
        const node = this.pool_pbullet.get() || instantiate(this.prefab_pbullet);
        this.layer_bullet.addChild(node);
        node.setPosition(x, y);

        const entity = EcsWorld.inst.createEntity(GameEntity, node);
        const nodeComp = entity.add(NodeComponent);
        const moveComp = entity.add(MoveComponent);

        moveComp.toward = angle;
        moveComp.speed = speed;

        nodeComp.setPosition(node.x, node.y);
    }



    private onSpawn() {

        for (let i = 0; i < EnemyPx.length; i++) {
            this.createEnemy(EnemyPx[i]);
        }

    }

    private createEnemy(x: number,) {
        const node = this.pool_enemy.get() || instantiate(this.prefab_enemy);
        this.layer_ins.addChild(node);
        node.setPosition(x, view.getVisibleSize().height / 2 + 100);

        const entity = EcsWorld.inst.createEntity(GameEntity, node);
        const nodeComp = entity.add(NodeComponent);
        const moveComp = entity.add(MoveComponent);
        // const enemyComp = entity.add()

        moveComp.toward = -90;
        moveComp.speed = 368;

        nodeComp.setPosition(node.x, node.y);
    }

}

