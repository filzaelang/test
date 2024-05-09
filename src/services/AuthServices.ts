import { AppDataSource } from "../data-source";
import { Repository, FindManyOptions } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

export default new class AuthServices {
    private readonly AuthRepository: Repository<User> = AppDataSource.getRepository(User);

    async register(data: User): Promise<object | string> {
        try {
            const usernameCheck = await this.AuthRepository.count({
                where: { username: data.username },
            });

            if (usernameCheck > 0) {
                throw new Error(`Username already used`);
            }

            const emailCheck = await this.AuthRepository.count({
                where: { email: data.email },
            });

            if (emailCheck > 0) {
                throw new Error(`Email already registered`);
            }


            const hashPassword = await bcrypt.hash(data.password, 10);

            const obj = await this.AuthRepository.create({
                ...data,
                password: hashPassword,
            })
            console.log("obj", obj)

            const response = await this.AuthRepository.save(obj);

            return {
                message: "success creating a User",
                data: response
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login(data: User): Promise<object | string> {
        try {
            const idCheck = await this.AuthRepository.findOne({
                where: [
                    { username: data.username },
                    { email: data.username },
                ],
            } as FindManyOptions<User>);
            if (!idCheck) {
                throw new Error("Username or email does not exist");
            }

            const comparePassword = await bcrypt.compare(data.password, idCheck.password);
            if (!comparePassword) {
                throw new Error("Password & email/username doesn't match !")
            }

            const obj = {
                id: idCheck.id,
                username: idCheck.username,
                fullname: idCheck.email,
                email: idCheck.email
            }

            const token = jwt.sign({ obj }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            return {
                message: `Login success`,
                token,
                obj
            };
        } catch (error) {
            throw new Error(error.message)
        }
    }
}