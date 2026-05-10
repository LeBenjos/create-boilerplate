import { ViewId } from '../../constants/ViewId';
import LoaderThreeApp from './apps/LoaderThreeApp';
import MainThreeApp from './apps/MainThreeApp';

class MainThreeEngine {
    public init(): void {
        LoaderThreeApp.init();
        MainThreeApp.init();
    }

    public setEntryView(): Promise<void> {
        return MainThreeApp.setCurrentView(ViewId.THREE_WORLD_1);
    }
}

export default new MainThreeEngine();
