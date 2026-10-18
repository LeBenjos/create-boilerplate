import { DirectionalLight, Vector3, type DataTexture } from 'three';
import { AssetId } from '../../../../constants/AssetId';
import { DebugGuiTitle } from '../../../../constants/DebugGuiTitle';
import MainThreeApp from '../../../../engines/threes/apps/MainThreeApp';
import DebugManager from '../../../../managers/DebugManager';
import ThreeAssetManager from '../../../../managers/threes/ThreeAssetManager';
import ThreeActorViewBase from '../../bases/components/ThreeActorViewBase';

interface EnvironmentMap {
    intensity?: number;
    texture?: DataTexture;
}

export default class EnvironmentThreeActor extends ThreeActorViewBase {
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

    public init(): void {
        this.reset();
        if (this._environmentMap) {
            MainThreeApp.scene.environment = this._environmentMap.texture!;
            MainThreeApp.scene.environmentIntensity = this._environmentMap.intensity!;
        }
        if (DebugManager.isActive) this._setupDebug();
    }

    public reset(): void {
        //
    }

    private _generateEnvironmentMap = (): void => {
        this._environmentMap = {};
        this._environmentMap.intensity = EnvironmentThreeActor._DEFAULT_ENVIRONMENT_MAP_INTENSITY;
        this._environmentMap.texture = ThreeAssetManager.getHDR(AssetId.THREE_HDR_TEMPLATE);
        this._environmentMap.texture.needsUpdate = true;

        MainThreeApp.scene.environment = this._environmentMap.texture;
        MainThreeApp.scene.environmentIntensity = this._environmentMap.intensity!;
    };

    private _generateSunLight(): void {
        this._sunLight = new DirectionalLight(
            EnvironmentThreeActor._DEFAULT_SUN_LIGHT_COLOR,
            EnvironmentThreeActor._DEFAULT_SUN_LIGHT_INTENSITY
        );
        this._sunLight.castShadow = true;
        this._sunLight.shadow.camera.far = EnvironmentThreeActor._DEFAULT_SUN_SHADOW_CAMERA_FAR;
        this._sunLight.shadow.mapSize.set(
            EnvironmentThreeActor._DEFAULT_SUN_SHADOW_MAP_SIZE,
            EnvironmentThreeActor._DEFAULT_SUN_SHADOW_MAP_SIZE
        );
        this._sunLight.shadow.normalBias = EnvironmentThreeActor._DEFAULT_SUN_SHADOW_NORMAL_BIAS;
        this._sunLight.position.copy(EnvironmentThreeActor._DEFAULT_SUN_POSITION);
        this.add(this._sunLight);
    }

    public update(_dt: number): void {}

    private _setupDebug(): void {
        const viewsDebug = DebugManager.getGuiFolder(DebugGuiTitle.THREE_VIEWS);

        const environmentFolder = viewsDebug.addFolder({ title: 'Environment', expanded: false });
        environmentFolder
            .addBinding(this._environmentMap, 'intensity', { min: 0, max: 10, step: 0.01 })
            .on('change', () => {
                MainThreeApp.scene.environmentIntensity = this._environmentMap.intensity!;
            });

        const sunLightFolder = viewsDebug.addFolder({ title: 'Sun Light', expanded: false });
        sunLightFolder.addBinding(this._sunLight, 'intensity', { min: 0, max: 10, step: 0.01, label: 'intensity' });
        sunLightFolder.addBinding(this._sunLight.position, 'x', { min: -5, max: 5, step: 0.01, label: 'positionX' });
        sunLightFolder.addBinding(this._sunLight.position, 'y', { min: -5, max: 5, step: 0.01, label: 'positionY' });
        sunLightFolder.addBinding(this._sunLight.position, 'z', { min: -5, max: 5, step: 0.01, label: 'positionZ' });
    }
}
