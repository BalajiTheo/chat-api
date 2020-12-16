const AWS = require('aws-sdk');


const create = (domainName,stage) => {

    const endpoint = `${domainName}/${stage}`;

    return new AWS.ApiGatewayManagementApi({
        apiVersion : '2018-11-29',
        endpoint
    });

}

const send = ({domainName, stage, connectionId, message}) => {

    const ws = create(domainName, stage);

    const postPararms = {
        Data : message,
        ConnectionId: connectionId
    };

   return ws.postToConnection(postPararms).promise();
}

module.exports = {
    send
};