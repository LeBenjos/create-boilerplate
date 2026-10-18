import { Mesh, type Object3D } from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { AssetId } from '../../../../constants/AssetId';
import type { Object3DId } from '../../../../constants/Object3DId';
import ThreeAssetManager from '../../../../managers/threes/ThreeAssetManager';
import ThreeActorViewBase from './ThreeActorViewBase';

export interface ModelBaseParams {
    object3DId?: Object3DId;
    castShadow?: boolean;
    receiveShadow?: boolean;
}

export default abstract class ThreeModelViewBase extends ThreeActorViewBase {
    protected readonly _assetId: AssetId;
    protected readonly _parameters: ModelBaseParams;
    declare protected _model: Object3D;

    constructor(assetId: AssetId, params: ModelBaseParams = {}) {
        super();
        this._assetId = assetId;
        this._parameters = params;

        this._generateModel();
    }

    protected _generateModel(): void {
        const originalModel = ThreeAssetManager.getModel(this._assetId).scene;
        const model = SkeletonUtils.clone(originalModel);

        if (this._parameters.object3DId) {
            const target = model.getObjectByName(this._parameters.object3DId);
            if (!target)
                throw new Error(
                    `[${this.constructor.name}]: Object3D '${this._parameters.object3DId}' not found in model '${this._assetId}'`
                );
            this._model = target;
        } else {
            this._model = model;
        }

        this._model.traverse((child) => {
            if (child instanceof Mesh) {
                if (this._parameters.castShadow !== undefined) child.castShadow = this._parameters.castShadow;
                if (this._parameters.receiveShadow !== undefined) child.receiveShadow = this._parameters.receiveShadow;
            }
        });

        this.add(this._model);
    }

    protected _getObjectByName(name: string): Object3D {
        const object = this._model.getObjectByName(name);
        if (!object) {
            throw new Error(
                `[${this.constructor.name}]: Object3D not found for name: ${name} in model with ID: ${this._parameters.object3DId ?? this._assetId}`
            );
        }
        return object;
    }

    public update(dt: number): void {
        super.update(dt);
    }
}
