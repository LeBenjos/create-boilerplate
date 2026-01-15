import { Object3D } from 'three';
import ThreeActorBase from '../worlds/components/actors/bases/ThreeActorBase';

export default abstract class ThreeViewBase extends Object3D {
    protected readonly _actors: ThreeActorBase[];

    constructor() {
        super();

        this._actors = [];
    }

    public init(): void {
        this.reset();
        for (const actor of this._actors) actor.init();
    }

    public reset(): void {
        for (const actor of this._actors) actor.reset();
    }

    protected _generateActors(): void {
        //
    }

    public dispose(): void {
        for (const actor of this._actors) {
            actor.dispose();
        }
    }

    public update(dt: number): void {
        //
    }
}
