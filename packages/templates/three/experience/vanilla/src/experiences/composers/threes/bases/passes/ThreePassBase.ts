import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { PassShader } from '../../../../types/passTypes';

export default abstract class ThreePassBase extends ShaderPass {
    constructor(shader: PassShader) {
        super(shader);
    }

    public update(_dt: number): void {
        //
    }
}
