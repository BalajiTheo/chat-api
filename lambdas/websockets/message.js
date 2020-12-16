const Dynamo = require('../common/dynamoHelper');
const WebSocket = require('../common/webSocketMessage');
const Responses = require('../common/apiResponse');
const tableName = "ws_users";
const roomTable = "ws_rooms";

exports.handler = async event => {

    // const {connectionId} = event.requestContext;

    const body = JSON.parse(event.body);
    console.log("whats the body",body);
    const {roomid, message, participants} = body;


    const record = await Dynamo.findRoom(roomid,roomTable);

    console.log("record after fetch", record);

    let currentMessages = [];



    if(record && !record.roomid){

        currentMessages.push(message);

        const data = {
            roomid: roomid,
            messages: currentMessages,
            participants: participants
        }
        await Dynamo.createRoom(data, roomTable);

    } else {

        console.log("record inside else", record);

        currentMessages = [...record.messages];

        // const{messages} = record;

        currentMessages.push(message);

        const data = {
            ...record,
            messages : currentMessages,
            participants
        }
       

        await Dynamo.addMessage(data, roomTable);
    }

    // now send the message to all participants

    const receiverIds = await Dynamo.getReceiversId(tableName);

    // const allMessages = JSON.stringify(currentMessages);

    const postCalls = receiverIds.Items.map(async ({connectionId, domainName,stage}) =>{

        try{
            return await WebSocket.send({
                    domainName : domainName,
                    stage: stage,
                    connectionId: connectionId,
                    message : JSON.stringify(message)
                })
        } catch (err){
                console.log('error in websockert send',err);
        }
    });

    try{

        await Promise.all(postCalls);

    } catch(error){
        console.log('error in promise all',error);
        return Responses._400({ message: 'message could not be received' });
    }





    return Responses._200({ message: 'got a message' });

}