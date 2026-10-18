import { AssetUtils } from '@benjos/cookware';
import { AssetId } from '../constants/AssetId';

import DebugManager from '../managers/DebugManager';
import DomKeyboardManager from '../managers/doms/DomKeyboardManager';
import DomPointerManager from '../managers/doms/DomPointerManager';
import DomResizeManager from '../managers/doms/DomResizeManager';
import LoaderManager from '../managers/LoaderManager';
import TickerManager from '../managers/TickerManager';
import ThreeAssetManager from '../managers/threes/ThreeAssetManager';
import ThreeRaycasterManager from '../managers/threes/ThreeRaycasterManager';

import MainHTMLEngine from '../engines/htmls/MainHTMLEngine';
import MainThreeEngine from '../engines/threes/MainThreeEngine';

class InitCommand {
    public async init(): Promise<void> {
        this._initUtils();
        this._initProxies();
        await this._initManagers();
        this._initCommonAssets();
        this._initThreeSharedAssets();
        this._initEngines();
    }

    private _initUtils(): void {
        AssetUtils.Init();
    }

    private _initProxies(): void {
        //
    }

    private async _initManagers(): Promise<void> {
        // Core
        TickerManager.init();

        // DOM
        DomKeyboardManager.init();
        DomPointerManager.init();
        DomResizeManager.init();

        // Three
        ThreeAssetManager.init();
        ThreeRaycasterManager.init();

        // App
        await DebugManager.init();
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

    private _initEngines(): void {
        MainHTMLEngine.init();
        MainThreeEngine.init();
    }
}

export default new InitCommand();
