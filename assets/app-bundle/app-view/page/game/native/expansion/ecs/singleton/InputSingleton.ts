import { ecsclass, EcsSingleton } from '../../../../../../../../pkg-export/@gamex/cc-ecs';

@ecsclass('InputSingleton')
export class InputSingleton extends EcsSingleton {
    x = 0;
    y = 0;
}