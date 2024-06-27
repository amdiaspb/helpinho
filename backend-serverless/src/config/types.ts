import { CreateDonationParams } from "../schemas/donation-schemas";
import { CreateHelpParams } from "../schemas/help-schemas";
import { CreateUserParams } from "../schemas/user-schemas";
import { ulid } from "ulid";

// USER =======================================================================

export class UserData {
  PK: string;
  SK: string;

  id: string;
  name: string;
  email: string;
  cpf: string;
  number: string;
  password: string;
  money: number;
  image: string;
  createdHelpCount: number;
  created: string;
  updated: string;
 
  constructor(data: CreateUserParams) {
    const { name, email, cpf, number, password } = data;
    
    this.PK = 'User#' + email;
    this.SK = '#Data';

    this.id = ulid();
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.number = number;
    this.password = password;
    this.money = 10000;
    this.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getRandomNumber(1, 500)}.png`;
    this.createdHelpCount = 0;
    this.created = new Date().toString();
    this.updated = new Date().toString();
  }
}

export class UserSession {
  PK: string;
  SK: string;

  id: string;
  token: string;
  created: string;
  updated: string;
 
  constructor(userPK: string, token: string) {
    this.PK = userPK;
    this.SK = "#Session"

    this.id = ulid();
    this.token = token;
    this.created = new Date().toString();
    this.updated = new Date().toString();
  }
}

export class UserDonation {
  PK: string;
  SK: string;

  id: string;
  value: number;
  helpId: string;
  created: string;
  updated: string;
 
  constructor(data: CreateDonationParams, userPK: string) {
    const { value, helpId } = data;
    const id = ulid();

    this.PK = userPK;
    this.SK = 'DONATION#' + id;
    
    this.id = id;
    this.value = value;
    this.helpId = helpId;
    this.created = new Date().toString();
    this.updated = new Date().toString();
  }
}

// HELP =======================================================================

export class HelpData {
  PK: string;
  SK: string;
  TYPE: string;

  id: string;
  image: string;
  title: string;
  description: string;
  tag: string;
  currentValue: number;
  totalValue: number;
  userId: string;
  urgent: boolean;
  created: string;
  updated: string;
 
  constructor(data: CreateHelpParams) {
    const { image, title, description, tag, totalValue, userId } = data;
    const id = ulid();

    this.PK = ('Help#' + id);
    this.SK = '#Data';
    this.TYPE = "HELP";

    this.id = id;
    this.image = image;
    this.title = title;
    this.description = description;
    this.tag = tag;
    this.currentValue = 0;
    this.totalValue = totalValue;
    this.userId = userId;
    this.urgent = false;
    this.created = new Date().toString();
    this.updated = new Date().toString();
  }
}

export class HelpUser {
  PK: string;
  SK: string;
  TYPE: string;

  name: string;
  email: string;
  image: string;
 
  constructor(helpPK: string, user: UserData) {
    this.PK = helpPK;
    this.SK = user.PK;
    this.TYPE = "HELP";

    this.name = user.name;
    this.email = user.email;
    this.image = user.image;
  }
}

export class HelpDonation {
  PK: string;
  SK: string;
  TYPE: string;

  value: number;
  name: string;
  email: string;
  image: string;
 
  constructor(helpPK: string, user: UserData) {
    this.PK = helpPK;
    this.SK = 'DONATION#' + user.PK;
    this.TYPE = "HELP"

    this.name = user.name;
    this.email = user.email;
    this.image = user.image;
  }
}

// HELPER =========================================================

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}
