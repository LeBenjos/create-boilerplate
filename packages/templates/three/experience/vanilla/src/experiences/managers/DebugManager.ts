import { Action } from '@benjos/cookware';
import { KeyboardCode } from '@benjos/spices';
import { ThreePerf } from 'three-perf';
import { Pane, type FolderApi } from 'tweakpane';
import type { DebugGuiTitle } from '../constants/DebugGuiTitle';
import MainThreeApp from '../engines/threes/apps/MainThreeApp';
import DomKeyboardManager from './doms/DomKeyboardManager';

class DebugManager {
    private static readonly _IS_ACTIVE_STRING: string = '#debug';
    private static readonly _GUI_TITLE: string = 'Debug Panel';
    private static readonly _PANE_CONTAINER_CLASS_NAME: string = 'debug-panel';
    private static readonly _THREE_PERF_ANCHOR_X: 'left' | 'right' = 'left';
    private static readonly _THREE_PERF_ANCHOR_Y: 'top' | 'bottom' = 'bottom';
    private static readonly _TOGGLE_HIDDEN_KEYS: string[] = [KeyboardCode.SHIFT_LEFT, KeyboardCode.KEY_H];

    private readonly _isActive = window.location.hash === DebugManager._IS_ACTIVE_STRING;
    private _isDebugVisible = true;
    declare private _pane: Pane;
    private readonly _folders = new Map<DebugGuiTitle, FolderApi>();
    declare private _threePerf: ThreePerf;
    public onToggleVisibility = new Action();

    public init(): void {
        if (this.isActive) {
            this._initPane();
        }
    }

    private _initPane(): void {
        const container = document.createElement('div');
        container.classList.add(DebugManager._PANE_CONTAINER_CLASS_NAME);
        document.body.appendChild(container);
        this._pane = new Pane({ container, title: DebugManager._GUI_TITLE, expanded: false });
        DomKeyboardManager.onKeyDown.remove(this._onKeyDown);
        DomKeyboardManager.onKeyDown.add(this._onKeyDown);
    }

    private _initThreePerf = (): void => {
        this._threePerf = new ThreePerf({
            anchorX: DebugManager._THREE_PERF_ANCHOR_X,
            anchorY: DebugManager._THREE_PERF_ANCHOR_Y,
            domElement: document.body,
            renderer: MainThreeApp.renderer,
            showGraph: false,
            overClock: false,
        });
    };

    private _addGuiFolder(title: DebugGuiTitle): FolderApi {
        const folder = this._pane.addFolder({ title, expanded: false });
        this._folders.set(title, folder);
        return folder;
    }

    public getGuiFolder(title: DebugGuiTitle): FolderApi {
        return this._folders.get(title) ?? this._addGuiFolder(title);
    }

    public beginPerf(): void {
        if (!this._threePerf) this._initThreePerf();
        this._threePerf.begin();
    }

    public endPerf(): void {
        this._threePerf.end();
    }

    private readonly _onKeyDown = (_e: KeyboardEvent): void => {
        if (DomKeyboardManager.areAllKeysDown(DebugManager._TOGGLE_HIDDEN_KEYS)) {
            this._toggleVisibility();
        }
    };

    private _toggleVisibility(): void {
        this._isDebugVisible = !this._isDebugVisible;
        this._pane.hidden = !this._isDebugVisible;
        if (this._threePerf) this._threePerf.visible = this._isDebugVisible;
        this.onToggleVisibility.execute();
    }

    //#region Getters
    //
    public get isActive(): boolean {
        return this._isActive;
    }
    //
    //#endregion
}

export default new DebugManager();
