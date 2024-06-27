import { CreateDonationParams } from "../schemas/donation-schemas";
import { CreateHelpParams } from "../schemas/help-schemas";
import { CreateUserParams } from "../schemas/user-schemas";
import { ulid } from "ulid";

export class User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  number: string;
  password: string;
  money: number;
  image: string;
  created: Date;
  updated: Date;
 
  constructor(data: CreateUserParams) {
    const { name, email, cpf, number, password } = data;
    this.id = ulid();
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.number = number;
    this.password = password;
    this.money = 10000;
    this.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getRandomNumber(1, 500)}.png`;
    this.created = new Date();
    this.updated = new Date();
  }
}

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export class Help {
  id: string;
  image: string;
  title: string;
  description: string;
  tag: string;
  currentValue: number;
  totalValue: number;
  userId: string;
  urgent: boolean;
  created: Date;
  updated: Date;
 
  constructor(data: CreateHelpParams) {
    const { image, title, description, tag, totalValue, userId } = data;
    this.id = ulid();
    this.image = image;
    this.title = title;
    this.description = description;
    this.tag = tag;
    this.currentValue = 0;
    this.totalValue = totalValue;
    this.userId = userId;
    this.urgent = false;
    this.created = new Date();
    this.updated = new Date();
  }
}

export class Donation {
  id: string;
  value: number;
  userId: string;
  helpId: string;
  created: Date;
  updated: Date;
 
  constructor(data: CreateDonationParams) {
    const { value, userId, helpId } = data;
    this.id = ulid();
    this.value = value;
    this.userId = userId;
    this.helpId = helpId;
    this.created = new Date();
    this.updated = new Date();
  }
}

export class Session {
  id: string;
  userId: string;
  token: string;
  created: Date;
  updated: Date;
 
  constructor(userId: string, token: string) {
    this.id = ulid();
    this.userId = userId;
    this.token = token;
    this.created = new Date();
    this.updated = new Date();
  }
}

export type Database = {
  user: User[],
  help: Help[],
  donation: Donation[],
  session: Session[]
}
