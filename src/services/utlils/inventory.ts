/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import {
    SpinalContext,
    SpinalGraphService,
    SpinalNode,
} from 'spinal-env-viewer-graph-service';
import * as constants from "../../constants";
import AttributeService from 'spinal-env-viewer-plugin-documentation-service';
const COLOR_1 = "#153284";
const COLOR_2 = "#CADEE2";

// export async function getRoomCategoryInventory(node: SpinalNode) {
//     let returnObj = {
//         node: node.getName().get(),
//         objectType: "ROOM_AREA_INVENTORY",
//         // headers: ["name", "area"],
//         headers: ["name", "area", "floor", node.getName().get()],
//         array: [],
//         resume: {},
//         resumeUnit: "m²"
//     };
//     let groups = await node.getChildren(constants.GROUP_RELATION_NAME);
//     for (let group of groups) {
//         let rooms = await group.getChildren(constants.SPACE_ROOM_RELATION);
//         // returnObj.headers.push(group.getName().get());
//         returnObj.resume[group.getName().get()] = [0, 0];
//         for (let room of rooms) {
//             let floors = await room.getParents("hasGeographicRoom");
//             const floor = floors.find((flr) => flr.getType().get() == "geographicFloor");
//             let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
//             if (attr != -1) {
//                 let obj = {
//                     name: room.getName().get(),
//                     area: Math.floor(attr.value.get()),
//                     floor: floor.getName().get()
//                 }
//                 // obj[group.getName().get()] = "x";
//                 obj[node.getName().get()] = group.getName().get();
//                 returnObj.resume[group.getName().get()][0] += 1;
//                 returnObj.resume[group.getName().get()][1] += Math.floor(attr.value.get());
//                 returnObj.array.push(obj);
//             }
//         }
//     }
//     return returnObj;
// }

// export async function getRoomContextInventory(node: SpinalNode) {
//     let returnObj = {
//         node: node.getName().get(),
//         objectType: "ROOM_AREA_INVENTORY",
//         // headers: ["name", "area"],
//         headers: ["name", "area", "floor"],
//         array: [],
//         resume: {},
//         resumeUnit: "m²"
//     };
//     let categories = await node.getChildren(constants.CATEGORY_RELATION_NAME);
//     for (let category of categories) {
//         returnObj.headers.push(category.getName().get());
//         let groups = await category.getChildren(constants.GROUP_RELATION_NAME);
//         for (let group of groups) {
//             let rooms = await group.getChildren(constants.SPACE_ROOM_RELATION);
//             returnObj.resume[group.getName().get()] = [0, 0];
//             for (let room of rooms) {
//                 let floors = await room.getParents("hasGeographicRoom");
//                 const floor = floors.find((flr) => flr.getType().get() == "geographicFloor");
//                 let index = returnObj.array.findIndex(elt => elt.name == room.getName().get());
//                 let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
//                 if (index == -1) {
//                     returnObj.resume[group.getName().get()][0] += 1;
//                     if (attr != -1) {
//                         let obj = {
//                             name: room.getName().get(),
//                             area: Math.floor(attr.value.get()),
//                             floor: floor.getName().get()
//                         }
//                         obj[category.getName().get()] = group.getName().get();
//                         returnObj.resume[group.getName().get()][1] += Math.floor(attr.value.get());
//                         returnObj.array.push(obj);
//                     }
//                 }
//                 else {
//                     returnObj.array[index][category.getName().get()] = group.getName().get();
//                     returnObj.resume[group.getName().get()][0] += 1;
//                     if (attr != -1) {
//                         returnObj.resume[group.getName().get()][1] += Math.floor(attr.value.get());
//                     }
//                 }
//             }
//         }

//     }
//     return returnObj;
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////   ROOM INVENTORIES  ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export async function getRoomOfCategoryInventory(node: SpinalNode) {
    let returnObj = {
        title: "Inventaire des salles sur : " + node.getName().get(),
        arrayComponent: {
            display: true,
            header: ["Nom", "Étage", "Surface", node.getName().get()],
            data: new Array<Object>(),
        },
        barChartComponent: {
            display: true,
            labels: new Array<String>(),
            barChartData: [{
                backgroundColor: COLOR_1,
                data: new Array<number>(),
                hidden: false,
                label: "Surface (m²)"
            },
            {
                backgroundColor: COLOR_2,
                data: new Array<number>(),
                hidden: true,
                label: "Nombre"
            }
            ]
        }
    };

    let groups = await node.getChildren(constants.GROUP_RELATION_NAME);
    for (let group of groups) {
        let rooms = await group.getChildren(constants.SPACE_ROOM_RELATION);

        for (let room of rooms) {
            let floors = await room.getParents(constants.ROOM_RELATION);
            const floor = floors.find((flr) => flr.getType().get() == constants.FLOOR_TYPE);
            let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
            let tableObj = {
                Nom: room.getName().get(),
                Étage: floor?.getName().get()
            };
            tableObj[node.getName().get()] = group.getName().get();
            if (attr != -1) {
                tableObj["Surface"] = Math.floor(Number(attr.value.get()));
                let indexOfGroupInChart = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                if (indexOfGroupInChart == -1) {
                    returnObj.barChartComponent.labels.push(group.getName().get());
                    returnObj.barChartComponent.barChartData[0].data.push(Math.floor(Number(attr.value.get())));
                    returnObj.barChartComponent.barChartData[1].data.push(1);
                }
                else{
                    returnObj.barChartComponent.barChartData[0].data[indexOfGroupInChart] += Math.floor(Number(attr.value.get()));
                    returnObj.barChartComponent.barChartData[1].data[indexOfGroupInChart] += 1;
                }
            }
            else {
                let indexOfGroupInChart = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                if (indexOfGroupInChart == -1) {
                    returnObj.barChartComponent.labels.push(group.getName().get());
                    returnObj.barChartComponent.barChartData[0].data.push(0);
                    returnObj.barChartComponent.barChartData[1].data.push(1);
                }
                else{
                    returnObj.barChartComponent.barChartData[1].data[indexOfGroupInChart] += 1;
                }
            }

            returnObj.arrayComponent.data.push(tableObj)
        }
    }
    return returnObj;
}

export async function getRoomCategoryInventory(node: SpinalNode, std_name: String){
    let returnObj = {
        title: "",
        arrayComponent: {
            display: true,
            header: ["Nom", "Étage", "Surface"],
            data: new Array<Object>(),
        },
        barChartComponent: {
            display: true,
            labels: new Array<String>(),
            barChartData: [{
                backgroundColor: COLOR_1,
                data: new Array<number>(),
                hidden: false,
                label: "Surface (m²)"
            },
            {
                backgroundColor: COLOR_2,
                data: new Array<number>(),
                hidden: true,
                label: "Nombre"
            }
            ]
        }
    };

    let rooms = await getRoomsFromParent(node);
    for(let room of rooms){
        let floors = await room.getParents(constants.ROOM_RELATION);
        let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
        const floor = floors.find((flr) => flr.getType().get() == constants.FLOOR_TYPE);
        let tableObj = {
            Nom: room.getName().get(),
            Étage: floor?.getName().get(),
            Surface: ((attr != -1) ? Math.floor(Number(attr.value.get())) : "")
            
        };

        let groups = await room.getParents(constants.SPACE_ROOM_RELATION);
        for(let group of groups){
            let categories = await group.getParents(constants.GROUP_RELATION_NAME);
            for(let category of categories){
                if(category.info.standard_name != undefined){
                    if(category.info.standard_name.get() == std_name){
                        returnObj.title = 'Inventaire de la catégorie d\'espaces "' + category.getName().get() + '" sur : ' + node.getName().get();
                        if(returnObj.arrayComponent.header.includes(category.getName().get()) == false){
                            returnObj.arrayComponent.header.push(category.getName().get());
                        }
                        
                        tableObj[category.getName().get()] = group.getName().get();
                        returnObj.arrayComponent.data.push(tableObj);

                        // let index = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                        //     if (index == -1) {
                        //         returnObj.barChartComponent.labels.push(group.getName().get());
                        //         returnObj.barChartComponent.barChartData[1].data.push(1);
                        //         if(attr != -1){
                        //             returnObj.barChartComponent.barChartData[0].data.push(Math.floor(Number(attr.value.get())));
                        //         }
                        //     }
                        //     else {
                        //         returnObj.barChartComponent.barChartData[1].data[index]++;
                        //     }

                        if (attr != -1) {
                            // tableObj["Surface"] = Math.floor(Number(attr.value.get()));
                            let indexOfGroupInChart = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                            if (indexOfGroupInChart == -1) {
                                returnObj.barChartComponent.labels.push(group.getName().get());
                                returnObj.barChartComponent.barChartData[0].data.push(Math.floor(Number(attr.value.get())));
                                returnObj.barChartComponent.barChartData[1].data.push(1);
                            }
                            else{
                                returnObj.barChartComponent.barChartData[0].data[indexOfGroupInChart] += Math.floor(Number(attr.value.get()));
                                returnObj.barChartComponent.barChartData[1].data[indexOfGroupInChart] += 1;
                            }
                        }
                        else {
                            let indexOfGroupInChart = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                            if (indexOfGroupInChart == -1) {
                                returnObj.barChartComponent.labels.push(group.getName().get());
                                returnObj.barChartComponent.barChartData[0].data.push(0);
                                returnObj.barChartComponent.barChartData[1].data.push(1);
                            }
                            else{
                                returnObj.barChartComponent.barChartData[1].data[indexOfGroupInChart] += 1;
                            }
                        }
                    }
                }
            }
        }
    }

    return returnObj;
}

export async function getFullRoomCategoryInventory(node: SpinalNode){
    let returnObj = {
        title: "Inventaire complet des espaces sur : " + node.getName().get(),
        arrayComponent: {
            display: true,
            header: ["Nom", "Étage", "Surface"],
            data: new Array<Object>(),
        },
        barChartComponent: {
            display: false,
            labels: new Array<String>(),
            barChartData: [{
                backgroundColor: COLOR_1,
                data: new Array<number>(),
                hidden: false,
                label: "Surface (m²)"
            },
            {
                backgroundColor: COLOR_2,
                data: new Array<number>(),
                hidden: true,
                label: "Nombre"
            }
            ]
        }
    };
    let rooms = await getRoomsFromParent(node);
    for(let room of rooms){
        let floors = await room.getParents(constants.ROOM_RELATION);
        let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
        const floor = floors.find((flr) => flr.getType().get() == constants.FLOOR_TYPE);
        let tableObj = {
            Nom: room.getName().get(),
            Étage: floor?.getName().get(),
            Surface: ((attr != -1) ? Math.floor(Number(attr.value.get())) : "")
            
        };

        let groups = await room.getParents(constants.SPACE_ROOM_RELATION);
        for(let group of groups){
            let categories = await group.getParents(constants.GROUP_RELATION_NAME);
            for(let category of categories){
                        if(returnObj.arrayComponent.header.includes(category.getName().get()) == false){
                            returnObj.arrayComponent.header.push(category.getName().get());
                        }
                        
                        tableObj[category.getName().get()] = group.getName().get();
                        returnObj.arrayComponent.data.push(tableObj);

                        // let index = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                        //     if (index == -1) {
                        //         returnObj.barChartComponent.labels.push(group.getName().get());
                        //         returnObj.barChartComponent.barChartData[1].data.push(1);
                        //         if(attr != -1){
                        //             returnObj.barChartComponent.barChartData[0].data.push(Math.floor(Number(attr.value.get())));
                        //         }
                        //     }
                        //     else {
                        //         returnObj.barChartComponent.barChartData[1].data[index]++;
                        //     }

                        // if (attr != -1) {
                        //     // tableObj["Surface"] = Math.floor(Number(attr.value.get()));
                        //     let indexOfGroupInChart = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                        //     if (indexOfGroupInChart == -1) {
                        //         returnObj.barChartComponent.labels.push(group.getName().get());
                        //         returnObj.barChartComponent.barChartData[0].data.push(Math.floor(Number(attr.value.get())));
                        //         returnObj.barChartComponent.barChartData[1].data.push(1);
                        //     }
                        //     else{
                        //         returnObj.barChartComponent.barChartData[0].data[indexOfGroupInChart] += Math.floor(Number(attr.value.get()));
                        //         returnObj.barChartComponent.barChartData[1].data[indexOfGroupInChart] += 1;
                        //     }
                        // }
                        // else {
                        //     let indexOfGroupInChart = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                        //     if (indexOfGroupInChart == -1) {
                        //         returnObj.barChartComponent.labels.push(group.getName().get());
                        //         returnObj.barChartComponent.barChartData[0].data.push(0);
                        //         returnObj.barChartComponent.barChartData[1].data.push(1);
                        //     }
                        //     else{
                        //         returnObj.barChartComponent.barChartData[1].data[indexOfGroupInChart] += 1;
                        //     }
                        // }
                    
                
            }
        }
    }

    return returnObj;

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////   EQUIPMENT INVENTORIES  //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getEquipmentCategoryInventory(node: SpinalNode, std_name: String) {
    let returnObj = {
        title: "",
        arrayComponent: {
            display: true,
            header: ["Nom", "Étage", "Salle"],
            data: new Array<Object>(),
        },
        barChartComponent: {
            display: true,
            labels: new Array<String>(),
            barChartData: [{
                backgroundColor: COLOR_1,
                data: new Array(),
                hidden: false,
                label: "Nombre"
            }]
        }
    };

    // let rooms = await node.getChildren(constants.SPACE_ROOM_RELATION);
    let rooms = await getRoomsFromParent(node);
    for (let room of rooms) {
        let equipments = await room.getChildren(constants.EQUIPMENT_RELATION);
        //table
        let floors = await room.getParents(constants.ROOM_RELATION);
        const floor = floors.find((flr) => flr.getType().get() == constants.FLOOR_TYPE);
        //
        for (let eq of equipments) {
            let groups = await eq.getParents(constants.GROUP_EQUIPMENT_RELATION_NAME);
            for (let group of groups) {
                let categories = await group.getParents(constants.GROUP_RELATION_NAME);

                for (let category of categories) {
                    if (category.info.standard_name != undefined) {
                        if (category.info.standard_name.get() == std_name) {
                            returnObj.title = 'Inventaire de la catégorie d\'objets "' + category.getName().get() + '" sur : ' + node.getName().get()
                            // table
                            if(returnObj.arrayComponent.header.includes(category.getName().get()) == false){
                                returnObj.arrayComponent.header.push(category.getName().get());
                            }
                            let tableObj = {
                                Nom: eq.getName().get(),
                                Étage: floor?.getName().get(),
                                Salle: room.getName().get()
                            };
                            tableObj[category.getName().get()] = group.getName().get();
                            returnObj.arrayComponent.data.push(tableObj);
                            //

                            
                            let index = returnObj.barChartComponent.labels.indexOf(group.getName().get());
                            if (index == -1) {
                                returnObj.barChartComponent.labels.push(group.getName().get());
                                returnObj.barChartComponent.barChartData[0].data.push(1);
                            }
                            else {
                                returnObj.barChartComponent.barChartData[0].data[index]++;
                            }
                            // ((returnObj[group.getName().get()] == undefined) ? (returnObj[group.getName().get()] = 0) : (returnObj[group.getName().get()]++));

                        }
                    }

                }
            }
        }
    }

    return returnObj;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////   UTILITIES  //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getRoomsFromParent(node: SpinalNode) {
    let type = node.getType().get();
    if (type == constants.ROOM_TYPE) {
        return [node];
    }
    else if (type == constants.FLOOR_TYPE) {
        return (await node.getChildren(constants.ROOM_RELATION));
    }
    else if (type == constants.SPACE_GROUP_TYPE) {
        return (await node.getChildren(constants.SPACE_ROOM_RELATION));
    }
    else if (type == constants.SPACE_CATEGORY_TYPE) {
        let returnTab = new Array();
        let groups = await node.getChildren(constants.GROUP_RELATION_NAME);
        for (let group of groups) {
            let rooms = await getRoomsFromParent(group);
            returnTab = returnTab.concat(rooms);
        }
        return returnTab;
    }
    else if (type == constants.GEO_BUILDING_TYPE) {
        let returnTab = new Array();
        let floors = await node.getChildren(constants.FLOOR_RELATION);
        for (let floor of floors) {
            let rooms = await getRoomsFromParent(floor);
            returnTab = returnTab.concat(rooms);
        }
        return returnTab;
    }
    else {
        return (new Array<SpinalNode>())
    }
}




// let returnObj = {
//     title: "",
//     arrayComponent: {
//         display: false,
//         header: new Array<String>(),
//         data: new Array(),
//     },
//     barChartComponent: {
//         display: true,
//         labels: new Array<String>(),
//         data: new Array<Object>()
//         // data: [{
//         //     backgroundColor: COLOR_1,
//         //     data: new Array(),
//         //     hidden: false,
//         //     label: "Nombre"
//         // }]
//     }
// };