import { DataTexture, DirectionalLight, Object3D, Vector3 } from 'three';
import { AssetId } from '../../../../constants/experiences/AssetId';
import MainThree from '../../../../engines/threes/MainThree';
import DebugManager from '../../../../managers/DebugManager';
import ThreeAssetsManager from '../../../../managers/threes/ThreeAssetsManager';

interface EnvironmentMap {
    intensity?: number;
    texture?: DataTexture;
}

export default class Environment extends Object3D {
    private static readonly _DEFAULT_ENVIRONMENT_MAP_INTENSITY: number = 1;
    private static readonly _DEFAULT_SUN_LIGHT_COLOR: number = 0xffffff;
    private static readonly _DEFAULT_SUN_LIGHT_INTENSITY: number = 10;
    private static readonly _DEFAULT_SUN_SHADOW_CAMERA_FAR: number = 15;
    private static readonly _DEFAULT_SUN_SHADOW_MAP_SIZE: number = 1024;
    private static readonly _DEFAULT_SUN_SHADOW_NORMAL_BIAS: number = 0.05;
    private static readonly _DEFAULT_SUN_POSITION: Vector3 = new Vector3(0, 2, 1);

    declare private _environmentMap: EnvironmentMap;
    declare private _sunLight: DirectionalLight;

    constructor() {
        super();

        this._generateEnvironmentMap();
        this._generateSunLight();
    }

    private _generateEnvironmentMap = (): void => {
        this._environmentMap = {};
        this._environmentMap.intensity = Environment._DEFAULT_ENVIRONMENT_MAP_INTENSITY;
        this._environmentMap.texture = ThreeAssetsManager.getHDR(AssetId.THREE_HDR_TEMPLATE);
        this._environmentMap.texture.needsUpdate = true;

        MainThree.scene.environment = this._environmentMap.texture;
        MainThree.scene.environmentIntensity = this._environmentMap.intensity!;

        if (DebugManager.isActive) {
            const environmentFolder = DebugManager.gui.addFolder('Environment');
            environmentFolder.add(this._environmentMap, 'intensity', 0, 10, 0.01).onChange(() => {
                MainThree.scene.environmentIntensity = this._environmentMap.intensity!;
            });
        }
    };

    private _generateSunLight(): void {
        this._sunLight = new DirectionalLight(
            Environment._DEFAULT_SUN_LIGHT_COLOR,
            Environment._DEFAULT_SUN_LIGHT_INTENSITY
        );
        this._sunLight.castShadow = true;
        this._sunLight.shadow.camera.far = Environment._DEFAULT_SUN_SHADOW_CAMERA_FAR;
        this._sunLight.shadow.mapSize.set(
            Environment._DEFAULT_SUN_SHADOW_MAP_SIZE,
            Environment._DEFAULT_SUN_SHADOW_MAP_SIZE
        );
        this._sunLight.shadow.normalBias = Environment._DEFAULT_SUN_SHADOW_NORMAL_BIAS;
        this._sunLight.position.copy(Environment._DEFAULT_SUN_POSITION);
        this.add(this._sunLight);

        if (DebugManager.isActive) {
            const sunLightFolder = DebugManager.gui.addFolder('Sun Light');
            sunLightFolder.add(this._sunLight, 'intensity', 0, 10, 0.01).name('intensity');
            sunLightFolder.add(this._sunLight.position, 'x', -5, 5, 0.01).name('positionX');
            sunLightFolder.add(this._sunLight.position, 'y', -5, 5, 0.01).name('positionY');
            sunLightFolder.add(this._sunLight.position, 'z', -5, 5, 0.01).name('positionZ');
        }
    }

    public update(_dt: number): void {}
}
