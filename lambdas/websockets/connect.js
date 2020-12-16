const Dynamo = require('../common/dynamoHelper');
const Responses = require('../common/apiResponse');

const tableName = "ws_users";
const roomTable = "ws_rooms";
exports.handler = async event => {

    console.log("connection event at line 8");
    console.log(event);
    console.log("connection event at line 9");
    console.log("connection event at line 10 req context");
    console.log(event.requestContext);
    const {connectionId, domainName, stage} = event.requestContext;

    const {userid} = event.queryStringParameters;

    if(!userid){
      throw Error('Id not found');
    }


    const data = {
        id: userid,
        connectionId : connectionId,
        date : Date.now(),
        domainName,
        stage
    }

    await Dynamo.write(data, tableName);

    return Responses._200({ message: 'connected' });  

}