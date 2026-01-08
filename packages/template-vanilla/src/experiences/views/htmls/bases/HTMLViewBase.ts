import { DomUtils } from '@benjos/cookware';
import { DomEvent } from '@benjos/spices';
import type { ViewId } from '../../../constants/experiences/ViewId';
import { ViewType } from '../../../constants/experiences/ViewType';
import ViewBase from '../../bases/ViewBase';

export default abstract class HTMLViewBase extends ViewBase {
    private readonly _parentElement: HTMLElement;
    protected readonly _htmlContainer: HTMLDivElement;

    constructor(id: ViewId, parentElement: HTMLElement = DomUtils.GetApp()) {
        super(id, ViewType.HTML);
        this._parentElement = parentElement;
        this._htmlContainer = document.createElement('div');
        this._htmlContainer.classList.add('view-html-container');

        this._htmlContainer.addEventListener(DomEvent.ANIMATION_END, this._onAnimationEnd);
    }

    protected override _show(): void {
        super._show();
        this._parentElement.appendChild(this._htmlContainer);
        this._htmlContainer.classList.remove('hide');
        requestAnimationFrame(this._onShow);
    }

    private readonly _onShow = (): void => {
        this._htmlContainer.classList.add('show');
    };

    protected override _hide(): void {
        super._hide();
        this._htmlContainer.classList.remove('show');
        this._htmlContainer.classList.add('hide');
    }

    private readonly _onAnimationEnd = (event: AnimationEvent): void => {
        if (event.animationName === 'hideView') {
            this._parentElement.removeChild(this._htmlContainer);
        }
    };
}
