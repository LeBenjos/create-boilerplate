import { Mesh, MeshStandardMaterial, type MeshStandardMaterialParameters } from 'three';
import { TextGeometry, type TextGeometryParameters } from 'three/examples/jsm/Addons.js';
import { AssetId } from '../../../../constants/AssetId';
import ThreeAssetManager from '../../../../managers/threes/ThreeAssetManager';
import ThreeActorBase from '../../bases/components/ThreeActorBase';

export default class TemplateFontThreeActor extends ThreeActorBase {
    private static readonly _DEFAULT_TEXT: string = 'Hello boilerplate!';
    private static readonly _DEFAULT_TEXT_OPTION: TextGeometryParameters = {
        font: null!,
        size: 0.25,
        depth: 0.01,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    };
    private static readonly _DEFAULT_MATERIAL_OPTION: MeshStandardMaterialParameters = {
        color: 0xffffff,
        metalness: 0.7,
        roughness: 0.2,
        envMapIntensity: 0,
    };
    private static readonly _DEFAULT_MESH_POSITION_Y = 3;

    declare private _geometry: TextGeometry;
    declare private _material: MeshStandardMaterial;
    declare private _mesh: Mesh;

    constructor() {
        super();

        this._generateGeometry();
        this._generateMaterial();
        this._generateMesh();
    }

    private _generateGeometry(): void {
        this._geometry = new TextGeometry(TemplateFontThreeActor._DEFAULT_TEXT, {
            ...TemplateFontThreeActor._DEFAULT_TEXT_OPTION,
            font: ThreeAssetManager.getFont(AssetId.THREE_FONT_TEMPLATE),
        });
        this._geometry.center();
    }

    private _generateMaterial(): void {
        this._material = new MeshStandardMaterial(TemplateFontThreeActor._DEFAULT_MATERIAL_OPTION);
    }

    private _generateMesh(): void {
        this._mesh = new Mesh(this._geometry, this._material);
        this._mesh.position.y = TemplateFontThreeActor._DEFAULT_MESH_POSITION_Y;

        this.add(this._mesh);
    }
}
