import { Object3D } from 'three';

export default abstract class ThreeActorBase extends Object3D {
    constructor() {
        super();
    }

    public init(): void {
        this.reset();
    }

    public reset(): void {
        //
    }

    public dispose(): void {
        //
    }

    public update(_dt: number): void { }
}
