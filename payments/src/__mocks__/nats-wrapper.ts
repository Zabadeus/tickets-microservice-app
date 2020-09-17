import { StandardValidation } from "express-validator/src/context-items";

export const natsWrapper = {
    client: {
        publish: jest
            .fn()
            .mockImplementation((subject: string, data: string, callback: () => void) => {
                callback();
            })
    }
};