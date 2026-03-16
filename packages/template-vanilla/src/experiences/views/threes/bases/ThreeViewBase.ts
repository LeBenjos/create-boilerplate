import { Object3D } from 'three';
import { ViewId } from '../../../constants/experiences/ViewId';
import LoaderManager from '../../../managers/LoaderManager';
import ThreeActorBase from '../worlds/components/actors/bases/ThreeActorBase';

export default abstract class ThreeViewBase extends Object3D {
    private readonly _id: ViewId;
    protected readonly _actors: ThreeActorBase[];
    private _areActorsGenerated = false;

    constructor(id: ViewId) {
        super();
        this._id = id;
        this._actors = [];
    }

    protected _declareAssets(): void {
        //
    }

    protected _prepare(): void {
        this._declareAssets();
        if (LoaderManager.isLoaded) {
            this._onAssetsReady();
        } else {
            LoaderManager.onFinishLoad.add(this._onLoadFinished);
            LoaderManager.loadAssets();
        }
    }

    public init(): void {
        this.reset();
        if (this._areActorsGenerated) {
            for (const actor of this._actors) actor.init();
        } else {
            this._prepare();
        }
    }

    public reset(): void {
        for (const actor of this._actors) actor.reset();
    }

    private readonly _onLoadFinished = (): void => {
        LoaderManager.onFinishLoad.remove(this._onLoadFinished);
        this._onAssetsReady();
    };

    private _onAssetsReady(): void {
        this._generateActors();
        this.init();
    }

    protected _generateActors(): void {
        this._areActorsGenerated = true;
    }

    public dispose(): void {
        LoaderManager.onFinishLoad.remove(this._onLoadFinished);
        for (const actor of this._actors) {
            actor.dispose();
        }
    }

    public update(_dt: number): void {
        //
    }

    //#region Getters
    //
    public get viewId(): ViewId { return this._id; }
    //
    //#endregion
}
