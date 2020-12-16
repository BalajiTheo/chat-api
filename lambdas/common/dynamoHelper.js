
const AWS = require('aws-sdk');


const documentClient = new AWS.DynamoDB.DocumentClient();


const Dynamo = {

async get(id, tableName) {
    const params= {
        TableName: tableName,
        Key : {
            id
        }
    }

    console.log(params, "the parrams i passed");

    const data = await documentClient.get(params).promise();

    console.log("fetched data", data);
    if(!data || !data.Item){
        throw Error("Cannot fetch messages");
    }

    return data.Item;
},

async write(data, tableName) {

    const {id} = data;

    if(!id) {
        throw Error("No ID in message");
    }


    const params = {
        TableName: tableName,
        Item : data
    }

    const response = await documentClient.put(params).promise();

    if(!response){
        throw Error('cannot add message');
    }

    return data;
},

async findRoom(roomid, tableName) {

    const params = {
        TableName : tableName,
        Key : {
            roomid
        }
    }

    const response = await documentClient.get(params).promise();

    if(response && response.Item) return response.Item;

    return response;
  
},
async createRoom(data, tableName) {

console.log("came to create", data);
    const roomData = {
        TableName : tableName,
        Item : data
    }
    const response = await documentClient.put(roomData).promise();

    console.log("room created in Dynamo helper", response);
    if(!response){
        throw Error('cannot create room');
    }

    return response;
},
async addMessage(data, tableName){

    const params = {
        TableName: tableName,
        Item : data
    }
    const response = await documentClient.put(params).promise();

    return response;

},

async getReceiversId(tableName){

    const params = {
        TableName: tableName,
        ProjectionExpression: "connectionId, domainName, stage", 
    };

    const result = await documentClient.scan(params).promise();

    console.log("queried result", result);
    return result;

}


}

module.exports = Dynamo;