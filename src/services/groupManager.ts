// import type {Str} from "spinal-core-connectorjs";
import { SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import AttributeService from "spinal-env-viewer-plugin-documentation-service";
import { FileSystem } from "spinal-core-connectorjs_type";
import { spinalGroup, spinalCategory, groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import * as constants from "../constants";

export async function getInformationsOfRoomInCategory(node:SpinalNode, categoryNode:SpinalNode){
    // 1 : récupérer les objs de reference
    let refs = await getReferencesOfRoom(node);
    // 2 : récupérer le groupe
    let group = await getGroupOfRoomInCatgory(node, categoryNode);
    // 3 : récupérer la surface
    let attr = await AttributeService.findOneAttributeInCategory(node, "Spatial", "area");
    return {
        name: node.getName().get(),
        id: node.getId().get(),
        serverId: node._server_id,
        group: {
            name: (group ? group.getName().get(): ""),
            id: (group ? group.getId().get(): ""),
            serverId: (group ? group._server_id: ""),
        },
        refs,
        area: (attr !=-1 ? attr.value.get() : ""),
        action: ""
    };
}

export async function getOtherRoomsInCategory(node:SpinalNode, color:string){
    let categories = await node.getParents("hasGroup");
    let returnTab = new Array();
    if(categories.length !=0){
        let groups = await categories[0].getChildren("hasGroup");
        let index = groups.indexOf(node);
        if(index !=-1){
            groups.splice(index, 1);
            for(let g of groups){
                returnTab = returnTab.concat(await getRoomsInGroup(g, color));
            }
        }
    }
    return returnTab;
}

export async function getRoomsInGroup(node: SpinalNode, color:string) {
    let children = await node.getChildren("groupHasgeographicRoom");
    let returnTab = new Array();
    for (let child of children) {
        returnTab.push({
            name: child.getName().get(),
            serverId: child._server_id,
            color,
            refs: await getReferencesOfRoom(child),
        });
    }
    return returnTab;
}

export async function getReferencesOfRoom(node: SpinalNode) {
    let refs = await node.getChildren("hasReferenceObject.ROOM");
    let returnTab = new Array();
    if (refs.length != 0) {
        for (let ref of refs) {
            returnTab.push({
                bimFileId: ref.info.bimFileId.get(),
                dbid: ref.info.dbid.get()
            });
        }
    }
    return returnTab;
}

export async function getGroupOfRoomInCatgory(room: SpinalNode, categoryNode: SpinalNode){
    let groupsOfCatgory = await categoryNode.getChildren("hasGroup");
    let groupsOfRoom = await room.getParents("groupHasgeographicRoom");
    if(groupsOfRoom.length !=0 && groupsOfCatgory.length !=0){
        for(let group of groupsOfRoom){
            if(groupsOfCatgory.includes(group)){
                return group;
            }
        }
    }
}

export async function handleAffectation(roomList:Array<any>, groupNode: SpinalNode){
    let categoryNode = await groupNode.getParents(spinalGroup.CATEGORY_TO_GROUP_RELATION);
    let contextNode = await categoryNode[0].getParents(spinalCategory.CONTEXT_TO_CATEGORY_RELATION);
    for(let room of roomList){
            if(room.action == "Désaffecter"){
                await groupManagerService.unLinkElementToGroup(groupNode.getId().get(), room.id);
            }
            else if(room.action == "Ré-affecter"){
                await groupManagerService.linkElementToGroup(contextNode[0].getId().get(), groupNode.getId().get(), room.id);
            }
            else if(room.action == "Affecter"){
                await groupManagerService.linkElementToGroup(contextNode[0].getId().get(), groupNode.getId().get(), room.id);
            }
    }

}
