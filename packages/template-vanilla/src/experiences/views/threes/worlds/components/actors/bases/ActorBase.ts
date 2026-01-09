import { Object3D } from 'three';

export default abstract class ActorBase extends Object3D {
    constructor() {
        super();
    }

    public dispose(): void {
        //
    }

    public update(_dt: number): void { }
}
