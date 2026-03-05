import { Node } from 'cc';
import BaseController from '../../../extensions/app/assets/base/BaseController';
import { PlayerComponent } from '../../app-bundle/app-view/page/game/native/expansion/ecs/component/PlayerComponent';
import { NodeComponent } from '../../pkg-export/@gamex/cc-ecs';
import { GameEntity } from '../../app-bundle/app-view/page/game/native/expansion/ecs/entity/GameEntity';
export class GameController extends BaseController<GameController, {
    // 定义了事件，并同时定义参数列表和返回值
    Shoot: (entity: GameEntity) => void
    Spawn: () => void
    Prop: (node: NodeComponent, splitChance?: number) => void
    CollectBullet: (node: Node) => void
    CollectEnemy: (node: Node) => void
    CollectProp: (node: Node) => void

    RemoveEntity: (entity: GameEntity) => void
}>() {
    shoot(entity: GameEntity) {
        this.emit(GameController.Event.Shoot, entity);
    }

    spawn() {
        this.emit(GameController.Event.Spawn);
    }

    prop(node: NodeComponent, splitChance = 0) {
        this.emit(GameController.Event.Prop, node, splitChance);
    }

    collectBullet(node: Node) {
        this.emit(GameController.Event.CollectBullet, node);
    }

    collectEnemy(node: Node) {
        this.emit(GameController.Event.CollectEnemy, node);
    }

    collectProp(node: Node) {
        this.emit(GameController.Event.CollectProp, node);
    }

    removeEntity(entity: GameEntity) {
        this.emit(GameController.Event.RemoveEntity, entity);
    }

}
