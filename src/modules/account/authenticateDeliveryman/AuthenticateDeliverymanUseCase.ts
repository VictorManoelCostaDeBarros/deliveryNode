import { prisma } from "../../../database/prismaClient";
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

export class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: IAuthenticateDeliveryman) {
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username
      }
    })

    if (!deliveryman) {
      throw new Error("Username or password invalid!")
    }

    const passwordMatch = await compare(password, deliveryman.password)

    if (!passwordMatch) {
      throw new Error("Username or password invalid!")
    }

    const token = sign({ username }, "5c32e196ec8a9a9b17ea74f7e8bfe2e5", {
      subject: deliveryman.id,
      expiresIn: "1d"
    })

    return token
  }
}