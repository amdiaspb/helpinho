import { TABLE_NAME, dynamodb } from "../config/database";
import { HelpData, HelpUser, UserData } from "../config/types";
import { CreateHelpParams } from "../schemas/help-schemas";
import { CreateUserParams } from "../schemas/user-schemas";

// GET ========================================================================

async function getAll() {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "TYPE",
    KeyConditionExpression: '#pk = :pk',
    ExpressionAttributeValues: { ':pk': 'HELP' },
    ExpressionAttributeNames: { '#pk': 'TYPE' },
  };

  const result = await dynamodb.query(params).promise();
  return result.Count ? result.Items : null;
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

async function createData(data: CreateHelpParams) {
  const helpData = new HelpData(data);
  const params = {
    TableName: TABLE_NAME,
    Item: helpData
  };
  const result = await dynamodb.put(params).promise();
  return { PK: helpData.PK, result };
}

async function createUser(helpPK: string, user: UserData) {
  const params = {
    TableName: TABLE_NAME,
    Item: new HelpUser(helpPK, user)
  };
  const result = await dynamodb.put(params).promise();
  return result;
}

// UPDATE ========================================================================

async function updateCurrentValue(help: HelpData, currentValue: number) {
  const params = {
    TableName: TABLE_NAME,
    Key: { "PK": help.PK, "SK": help.SK },
    UpdateExpression: 'set #value = :value',
    ExpressionAttributeNames: { '#value': 'currentValue' },
    ExpressionAttributeValues: { ':value': currentValue, },
    ReturnValues: "ALL_NEW"
  }
  const result = await dynamodb.update(params).promise();
  return result;
}

export const helpRepository = {
  getAll,
  getByPK,
  getQueryByPK,
  createData,
  createUser,
  updateCurrentValue
}
