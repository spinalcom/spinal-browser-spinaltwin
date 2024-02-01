/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

const asset2 = require("../../assets/sprites/icon.svg");
const asset = require("../../assets/sprites/circle.svg");
const asset3 = require("../../assets/sprites/fan_coil.svg");
const asset4 = require("../../assets/sprites/icon.png");
const assetText = require("../../assets/sprites/textv2.svg");
const thermo = require("../../assets/thermo2.jpg")

import { Sprite } from "three";
import { SVGLoader } from "./SVGLoader"
import { SpinalGraphService  } from "spinal-env-viewer-graph-service";
// import THREE from "three"
// import { SVGLoader } from 
// JSONLoader Loader 
import { CSS2DRenderer, CSS2DObject } from './CSS2DRenderer';

import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

export async function createSprite(position: { x: null, y: null, z: null }, text){
    let viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
    await viewer.loadExtension('Autodesk.Edit3D');
    const label = new Autodesk.Edit3D.Label3D(viewer, position, text);
    label.container.style.pointerEvents = 'auto';
    label.container.style.backgroundColor = 'green';
    label.container.addEventListener('click', (item) => {
  });
}

export async function testEdit3D(){

    let viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
    await viewer.loadExtension('Autodesk.Edit3D');
    // const bboxAndMatrix = await getBBoxAndMatrix(item?.dbid, item?.model, viewer);

    // const labelPos = bboxAndMatrix.bbox.center();
    // get label position (center of the bbox zMin-face)
    // labelPos.z = bboxAndMatrix.bbox.min.z;

    // create label
    const text = 'TEST ???';
    // const label = new Autodesk.Edit3D.Label3D(viewer, labelPos, text);
    const label = new Autodesk.Edit3D.Label3D(viewer, { x:100,y:100,z:100}, text);
    label.container.style.pointerEvents = 'auto';
    label.container.style.backgroundColor = 'red';
    label.container.addEventListener('click', (item) => {
  });
}

export async function testThreeText(){
    let container = document.createElement( 'div' );
    document.body.appendChild( container );
    let permalink = document.getElementById( 'permalink' );
}

export async function testSprite(){
    for ( let i = 0; i < 50; i ++ ) {

        const material = new THREE.SpriteMaterial( { color: Math.random() * 0xffffff } );
        const sprite = new THREE.Sprite( material );
        sprite.position.x = Math.random() * 1000 - 500;
        sprite.position.y = Math.random() * 1000 - 500;
        sprite.position.z = Math.random() * 1000 - 500;
        sprite.scale.set( 64, 64, 1 );
        // scene.add( sprite );
        if (!window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.hasScene("nameOfScene")) {
            let fg = window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addScene("nameOfScene");
        }
        window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addMesh(sprite, "nameOfScene");

    }
}

export async function testThree(){

    // /home/flallier/Projects/000_dev_vinci_A/plateforme_avec_dump_vinci_A_8010/module/spinal-browser-spinaltwin/src/assets/thermo.png
    const textureLoader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshPhongMaterial( {
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load( thermo ),
    } ); 
    const mesh = new THREE.Mesh( geometry, material );
    // mesh.layers.enable(0);
    // mesh.layers.enable(1);
    // mesh.layers.enable(2);


    // if (!window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.hasScene("default-threejs-scene")) {
    //     window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addScene("default-threejs-scene");
    // }
    // window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addMesh(mesh, "default-threejs-scene");

    
    // mesh.layers.enable(4);
    const meshDiv = document.createElement('div');
    meshDiv.className = 'threeManager';
    meshDiv.textContent = "25°C";
    meshDiv.style.marginTop = '-1em';
    const meshLabel = new CSS2DObject(meshDiv);
    meshLabel.position.set(100, 100, 100);
    document.body.appendChild( meshDiv );
    window.spinal.SpinalForgeViewer.viewerManager.viewer.impl.scene.add(meshLabel);
    // mesh.add(meshLabel);
    // meshLabel.layers.set(1);
    // new THREE.Vector3(100, 100, 100)

    // let labelRenderer = new CSS2DRenderer();
    // labelRenderer.setSize( window.innerWidth, window.innerHeight );
	// labelRenderer.domElement.style.position = 'absolute';
	// labelRenderer.domElement.style.top = '1000px';
    // labelRenderer.domElement.style.left = '200px';
	// document.body.appendChild( labelRenderer.domElement );
}

export async function testMarkup(){
    window.spinal.SpinalForgeViewer.viewerManager.viewer.loadExtension('IconMarkupExtension', {
        button: {
            icon: 'fa-thermometer-half',
            tooltip: 'Show Temperature'
        },
        icons: [
            { dbId: 3944,   label: '300&#176;C', css: 'fas fa-thermometer-full' },
            { dbId: 721,    label: '356&#176;C', css: 'fas fa-thermometer-full' },
            { dbId: 10312,  label: '450&#176;C', css: 'fas fa-thermometer-empty' },
            { dbId: 563,                         css: 'fas fa-exclamation-triangle' },
        ],
        onClick: (id) => {
        }
    })
}


export async function testing(nameOfScene="default-threejs-scene"){

    const map = new THREE.TextureLoader().load( asset4, function(map){
        const material = new THREE.SpriteMaterial( { map: map, color:0xff0000 } );
        const sprite = new THREE.Sprite( material );
        sprite.scale.set(200, 200, 1)
        let scene = window.spinal.SpinalForgeViewer.viewerManager.viewer.scene;
        // scene.add(sprite);
        if (!window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.hasScene(nameOfScene)) {
            let fg = window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addScene(nameOfScene);
        }
        window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addMesh(sprite, nameOfScene);

    } );

    // const loader = new SVGLoader();
    // loader.load(asset3, function(data){

	// 	const paths = data.paths;
	// 	const group = new THREE.Group();

	// 	for ( let i = 0; i < paths.length; i ++ ) {

	// 		const path = paths[ i ];

	// 		const material = new THREE.MeshBasicMaterial( {
	// 			color: path.color,
	// 			side: THREE.DoubleSide,
	// 			depthWrite: false
	// 		} );

	// 		const shapes = SVGLoader.createShapes( path );

	// 		for ( let j = 0; j < shapes.length; j ++ ) {

	// 			const shape = shapes[ j ];
	// 			const geometry = new THREE.ShapeGeometry( shape );
	// 			const mesh = new THREE.Mesh( geometry, material );
	// 			group.add( mesh );

	// 		}

	// 	}
    //     if (!window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.hasScene(nameOfScene)) {
    //         window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addScene(nameOfScene);
    //     }
	// 	window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addMesh(group, nameOfScene);

	// });



    // const map = new THREE.TextureLoader().load( asset );
    // const mat = new THREE.SpriteMaterial( { map: map, color: 0xff0000 } );
    // const geometry = new THREE.BoxGeometry( 10, 10, 10 );
    // const sprite = new THREE.Sprite( mat );
    // sprite.position = new THREE.Vector3(100, 100, 100);
    // sprite.scale.set(200, 200, 1)
    // if (!window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.hasScene(nameOfScene)) {
    //     window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addScene(nameOfScene);
    // }
    // window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addMesh(sprite, nameOfScene);




    let geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(100, 100, 100)
    );
    var material = new THREE.LineBasicMaterial ({
        color: new THREE.Color (0x00FF00),
        transparent: true,
        depthWrite: false, // false pour passer au premier plan
        depthTest: false,
        linewidth: 1,
        // opacity: 1.0,
        blending: THREE.NoBlending
      });
    let line = new THREE.Line(geometryLine, material);
    if (!window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.hasScene(nameOfScene)) {
        window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addScene(nameOfScene);
    }

    window.spinal.SpinalForgeViewer.viewerManager.viewer.overlays.addMesh(line, nameOfScene);
}








///////////// SPRITES
// let viewableData = undefined;

// export async function createSprites(datas = [{ position: { x: null, y: null, z: null }, dbid: null, spinalModel: { nodeId: "", spriteType: "" } }], /*dataOfPositionAndDbid, spinalModel={ nodeId: "", spriteType: "" },*/ onHoveringFunction = undefined, onClickFunction = undefined) {
//     this.viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
//     const dataVizExtn = await this.viewer.loadExtension("Autodesk.DataVisualization");

//     const DataVizCore = Autodesk.DataVisualization.Core;
//     const viewableType = DataVizCore.ViewableType.SPRITE;
//     // let viewableData = new DataVizCore.ViewableData();
//     // if (viewableData == undefined) {
//     //     viewableData = new DataVizCore.ViewableData();
//     // }
//     let viewableData = new DataVizCore.ViewableData();
//     // viewableData = new DataVizCore.ViewableData();
//     viewableData.spriteSize = 30; //px

//     for (let elt of datas) {

//         let spriteColor = new THREE.Color(0xFF0000);;
//         let spriteIconUrl = assetText;
//         if (elt.spinalModel != undefined) {
//             // let exists = spriteExists(elt.spinalModel.nodeId);
//             let exists = false;
//             if (exists == false) {
//                 const style = new DataVizCore.ViewableStyle(
//                     viewableType,
//                     spriteColor,
//                     spriteIconUrl
//                 );
//                 const viewable = new DataVizCore.SpriteViewable(elt.position, style, elt.dbid);
//                 viewable.info = elt.spinalModel;
//                 viewableData.addViewable(viewable);
//             }
//         }
//     }

//     await viewableData.finish();
//     dataVizExtn.addViewables(viewableData);

//     const showViewables = true;
//     const enableOcclusion = true;

//     dataVizExtn.showHideViewables(showViewables, enableOcclusion);

    
//     this.viewer.addEventListener(DataVizCore.MOUSE_CLICK, onSpriteClicked);
    
// }

function onSpriteClicked(event) {
    event.hasStopped = true;
    let sprite = getSpriteFromDbid(event.dbId);
    // let realNode = SpinalGraphService.getRealNode(sprite.info.nodeId);

    // const viewablesToUpdate = [event.dbId];
    // dataVizExtn.invalidateViewables(viewablesToUpdate, (viewable) => {
    //     return {
    //         scale: 2.0, // Double the viewable size
    //         url: "https://.../smiley.svg",
    //     };
    // });

    // Continue with application logic that reacts to the click event (e.g.
    // update UI to reflect details specific to the sprite being clicked on).
}

///////////////// THREE
function getSpriteFromDbid(dbId){
    let sprite = undefined;
    // let index = viewableData.viewables.findIndex(elt => elt.dbId == dbId);
    // if (index > -1) {
    //     sprite = viewableData.viewables[index];
    // }
    // return sprite;
}

export async function drawLineBetweenPositions(origin, destination, lineColor, nameOfScene="default-threejs-scene"){
    let geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(
        new THREE.Vector3(origin.x, origin.y, origin.z),
        new THREE.Vector3(destination.x, destination.y, destination.z)
    );
    // var material = new THREE.LineBasicMaterial({
    //     color: 0x00FF00
    // });
    var material = new THREE.LineBasicMaterial ({
        color: new THREE.Color (lineColor),
        transparent: true,
        depthWrite: false, // false pour passer au premier plan
        depthTest: false,
        linewidth: 2,
        // opacity: 1.0,
        blending: THREE.NoBlending
      })

    let line = new THREE.Line(geometryLine, material);

    if (!window.spinal.ForgeViewer.viewer.overlays.hasScene(nameOfScene)) {
        window.spinal.ForgeViewer.viewer.overlays.addScene(nameOfScene);
    }

    window.spinal.ForgeViewer.viewer.overlays.addMesh(line, nameOfScene);
    
    return line;
}

export async function getLinesFromPositionAndSceneName(position, nameOfScene="default-threejs-scene"){
    let vectorToCheck = new THREE.Vector3(position.x, position.y, position.z);
    let lines = [];
    if(window.spinal.ForgeViewer.viewer.overlays.impl.overlayScenes[nameOfScene] != undefined){
        let scene = window.spinal.ForgeViewer.viewer.overlays.impl.overlayScenes[nameOfScene].scene;
        let children = scene.children;
        for(let child of children){
            let vertices = child.geometry.vertices;
            vertices.forEach(vert => {
                if(vert.x == position.x && vert.y == position.y && vert.z == position.z) lines.push(child);
            });
        }
    }
    return lines;
}

export async function removeAllLinesOfScene(nameOfScene="default-threejs-scene"){
    if(window.spinal.ForgeViewer.viewer.overlays.impl.overlayScenes[nameOfScene] != undefined){
        let children = window.spinal.ForgeViewer.viewer.overlays.impl.overlayScenes[nameOfScene].scene.children;
        children.splice(0,children.length);
    }
}

export async function removeLinesFromScene(lines=[], nameOfScene="default-threejs-scene"){
    if(window.spinal.ForgeViewer.viewer.overlays.impl.overlayScenes[nameOfScene] != undefined){
        let children = window.spinal.ForgeViewer.viewer.overlays.impl.overlayScenes[nameOfScene].scene.children;
        for(let line of lines){
            let index = children.indexOf(line);
            if(index > -1){
                children.splice(index, 1);
                
            }
        }
    }
}

// export async function getLinesOfRoom(roomId, nameOfScene="default-threejs-scene"){
// }