import { ecsclass, EcsSingleton } from '../../../../../../../../pkg-export/@gamex/cc-ecs';

@ecsclass('GameSingleton')
export class GameSingleton extends EcsSingleton {
    public gameOver: boolean = false;
}
