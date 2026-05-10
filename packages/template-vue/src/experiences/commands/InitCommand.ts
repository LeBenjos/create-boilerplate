import { AssetUtils, DomKeyboardManager, DomPointerManager, DomResizeManager, TickerManager } from '@benjos/cookware';
import { AssetId } from '../constants/AssetId';
import DebugManager from '../managers/DebugManager';
import LoaderManager from '../managers/LoaderManager';
import ThreeAssetManager from '../managers/threes/ThreeAssetManager';
import ThreeCameraControllerManager from '../managers/threes/ThreeCameraControllerManager';
import ThreeRaycasterManager from '../managers/threes/ThreeRaycasterManager';

class InitCommand {
    public init(): void {
        this._initUtils();
        this._initProxies();
        this._initManagers();
        this._initCommonAssets();
        this._initThreeSharedAssets();
    }

    private _initUtils(): void {
        AssetUtils.Init();
    }

    private _initProxies(): void {
        //
    }

    private _initManagers(): void {
        TickerManager.init();
        DomKeyboardManager.init();
        DomPointerManager.init();
        ThreeAssetManager.init();
        ThreeCameraControllerManager.init();
        DomResizeManager.init();
        DebugManager.init();
        ThreeRaycasterManager.init();
        LoaderManager.init();
    }

    private _initCommonAssets(): void {
        //
    }

    private _initThreeSharedAssets(): void {
        ThreeAssetManager.addHDR(AssetId.THREE_HDR_TEMPLATE, AssetUtils.GetPath('hdrs/template.hdr'));
        ThreeAssetManager.addModel(AssetId.THREE_GLTF_TEMPLATE, AssetUtils.GetPath('models/template.glb'));
        ThreeAssetManager.addTexture(AssetId.THREE_TEXTURE_TEMPLATE, AssetUtils.GetPath('textures/template.jpg'));
        ThreeAssetManager.addFont(AssetId.THREE_FONT_TEMPLATE, AssetUtils.GetPath('fonts/template.typeface.json'));
    }
}

export default new InitCommand();
