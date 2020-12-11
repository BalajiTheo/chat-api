

exports.handler = async event => {
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: 'Hi from server, you are succssfully connected',

          },
          null,
          2
        ),
      };
}