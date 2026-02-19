import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../lib/appError.js";
import type { LoginInput } from "../validators/auth.validator.js";

export class AuthService {
  async login(input: LoginInput) {
    const admin = await prisma.admin.findUnique({
      where: { email: input.email },
    });

    if (!admin) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(input.password, admin.password);
    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign({ id: admin.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }

  async getAdmin(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!admin) {
      throw new UnauthorizedError("Admin not found");
    }

    return admin;
  }
}

export const authService = new AuthService();
