import { AssetUtils } from '@benjos/cookware';
import { TextureLoader } from 'three';
import { DRACOLoader, FontLoader, GLTFLoader, HDRLoader } from 'three/examples/jsm/Addons.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(AssetUtils.GetPath('loaders/draco/'));

export const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export const hdrLoader = new HDRLoader();
export const textureLoader = new TextureLoader();
export const fontLoader = new FontLoader();
