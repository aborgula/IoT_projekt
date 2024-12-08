import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";


class UserController implements Controller {
    public path = '/api/user';
    public router = Router();
    private userService = new UserService();
    private passwordService = new PasswordService();
    private tokenService = new TokenService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.delete(`${this.path}/logout/:token`, auth, this.removeHashSession);
    }

    private authenticate = async (request: Request, response:    Response, next: NextFunction) => {
        const {name, password} = request.body;
        console.log(name);
        console.log("tuu");

        try {
            const user = await this.userService.getByEmailOrName(name);

            if (user) {

                await this.passwordService.authorize(user.id, await this.passwordService.hashPassword(password));

                const token = await this.tokenService.create(user);
                console.log('Generated token:', token); 

                response.status(200).json(this.tokenService.getToken(token));
            } else {
                response.status(401).json({ error: 'Unauthorized' });
            }
        } catch (error) {
            console.error(`Validation Error: ${(error as Error).message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };

    private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        console.log("tuu");
        const userData = request.body;
        console.log(userData);
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (user !== null) {
                if (userData.password) {
                    const hashedPassword = await this.passwordService.hashPassword(userData.password)
                    await this.passwordService.createOrUpdate({
                        userId: user._id,
                        password: hashedPassword
                    });
                }
                response.status(200).json({ user, userId: user._id });
            } else {
                response.status(400).json({ error: 'Bad request', value: 'User is null' });
            }
        } catch (error) {
            console.error(`Validation Error: ${(error as Error).message}`);
            response.status(400).json({error: 'Bad request', value: (error as Error).message});
        }

    };

    private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const {userId} = request.params;
        
    
        try {
            const result = await this.tokenService.remove(userId);
            console.log('aaa', result)
            response.status(200).json(result);
        } catch (error) {
            console.error(`Validation Error: ${(error as Error).message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
    };
}

export default UserController;
