import { TABLE_NAME, dynamodb } from "../config/database";
import { HelpDonation, UserData, UserDonation } from "../config/types";
import { CreateDonationParams } from "../schemas/donation-schemas";


// CREATE ========================================================================

async function createUserDonation(data: CreateDonationParams, userPK: string) {
  const params = {
    TableName: TABLE_NAME,
    Item: new UserDonation(data, userPK)
  };
  const result = await dynamodb.put(params).promise();
  return result;
}

async function createHelpDonation(helpPK: string, user: UserData) {
  const params = {
    TableName: TABLE_NAME,
    Item: new HelpDonation(helpPK, user)
  };
  const result = await dynamodb.put(params).promise();
  return result;
}

export const donationRepository = {
  createUserDonation,
  createHelpDonation
}
