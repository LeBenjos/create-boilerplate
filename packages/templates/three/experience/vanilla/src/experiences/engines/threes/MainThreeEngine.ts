import { ViewId } from '../../constants/ViewId';
import LoaderThreeApp from './apps/LoaderThreeApp';
import MainThreeApp from './apps/MainThreeApp';

class MainThreeEngine {
    private static readonly _ENTRY_VIEW_ID: ViewId = ViewId.THREE_WORLD_1;

    public init(): void {
        LoaderThreeApp.init();
        MainThreeApp.init();
    }

    public setEntryView(): Promise<void> {
        return MainThreeApp.setCurrentView(MainThreeEngine._ENTRY_VIEW_ID);
    }
}

export default new MainThreeEngine();
