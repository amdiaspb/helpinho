import { TABLE_NAME, dynamodb } from "../config/database";
import { UserData } from "../config/types";
import { CreateUserParams } from "../schemas/user-schemas";

// GET ========================================================================

async function getByEmail(id: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      'PK': 'User#' + id,
      'SK': "#Data"
    }
  };

  const result = await dynamodb.get(params).promise();
  return result.Item || null;
}

async function getByPK(PK: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      'PK': PK,
      'SK': "#Data"
    }
  };

  const result = await dynamodb.get(params).promise();
  return result.Item || null;
}

async function getQueryByPK(PK: string) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeValues: { ':pk': PK },
    ExpressionAttributeNames: { '#pk': 'PK' }
  };

  const result = await dynamodb.query(params).promise();
  return result.Items || null;
}

// CREATE ========================================================================

async function create(data: CreateUserParams) {
  const params = {
    TableName: TABLE_NAME,
    Item: new UserData(data)
  };
  const result = await dynamodb.put(params).promise();
  return result;
}

// UPDATE ========================================================================

async function updateMoney(user: UserData, money: number) {
  const params = {
    TableName: TABLE_NAME,
    Key: { "PK": user.PK, "SK": user.SK },
    UpdateExpression: 'set #money = :money',
    ExpressionAttributeNames: { '#money': 'money' },
    ExpressionAttributeValues: { ':money': money, },
    ReturnValues: "ALL_NEW"
  }
  const result = await dynamodb.update(params).promise();
  return result;
}

async function increaseCreatedHelpCount(user: UserData) {
  const params = {
    TableName: TABLE_NAME,
    Key: { "PK": user.PK, "SK": user.SK },
    UpdateExpression: 'set #helpCount = :helpCount',
    ExpressionAttributeNames: { '#helpCount': 'createdHelpCount' },
    ExpressionAttributeValues: { ':helpCount': user.createdHelpCount + 1 },
    ReturnValues: "ALL_NEW"
  }
  const result = await dynamodb.update(params).promise();
  return result;
}

// Export ========================================================================

export const userRepository = {
  getByEmail,
  getByPK,
  getQueryByPK,
  create,
  updateMoney,
  increaseCreatedHelpCount,
}
