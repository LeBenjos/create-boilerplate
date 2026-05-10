import { MainThreeApp } from '../engines/threes/apps/MainThreeApp';

declare global {
    interface Window {
        mainThreeApp: MainThreeApp;
    }
}

export { };
