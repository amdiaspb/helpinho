import { TABLE_NAME, dynamodb } from "../config/database";
import { UserSession } from "../config/types";

// GET ========================================================================

async function getByUserPK(userPK: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      'PK': userPK,
      'SK': "#Session"
    }
  };

  const result = await dynamodb.get(params).promise();
  return result.Item || null;
}

// CREATE ========================================================================

async function put(userPK: string, token: string) {
  const params = {
    TableName: TABLE_NAME,
    Item: new UserSession(userPK, token)
  };
  const result = await dynamodb.put(params).promise();
  return result;
}

export const sessionRepository = {
  getByUserPK,
  put
}
