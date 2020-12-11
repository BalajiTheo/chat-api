const Dynamo = require('../common/dynamoHelper');

const tableName = "ws_users";

exports.handler = async event => {

    const {connectionId : connectionID} = event.requestContext;

    const record = await Dynamo.get(connectionID,tableName);

    const {message} = event.body;

    const {messages} = record;

    messages.push(message);

    const data = {
        ...record,
        messages
    }
    await Dynamo.write(data, tableName);

    return {
        status : 200,
        message : `Message saved ${message}`
    }

}