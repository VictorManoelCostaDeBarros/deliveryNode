import { prisma } from "../../../database/prismaClient";
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient) {
    const client = await prisma.clients.findFirst({
      where: {
        username
      }
    })

    if (!client) {
      throw new Error("Username or password invalid!")
    }

    const passwordMatch = await compare(password, client.password)

    if (!passwordMatch) {
      throw new Error("Username or password invalid!")
    }

    const token = sign({ username }, "5c32e196ec8a9a9b15ea74f7e8bfe2e5", {
      subject: client.id,
      expiresIn: "1d"
    })

    return token
  }
}