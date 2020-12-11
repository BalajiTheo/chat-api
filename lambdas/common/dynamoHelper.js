
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

    const data = await documentClient.get(params).promise();

    if(!data || !data.item){
        throw Error("Cannot fetch messages");
    }

    return data.item;
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
}


}

module.exports = Dynamo;