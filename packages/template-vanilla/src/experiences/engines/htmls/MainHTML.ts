import { ViewId } from '../../constants/experiences/ViewId';
import ViewProxy from '../../proxies/ViewProxy';
import LoaderHTMLView from '../../views/htmls/loaders/LoaderHTMLView';

class MainHTML {
    public init(): void {
        this._generateViews();
    }

    private _generateViews(): void {
        ViewProxy.add(ViewId.HTML_LOADER, LoaderHTMLView);
    }
}

export default new MainHTML();
